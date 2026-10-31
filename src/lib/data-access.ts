// データアクセス層。
// 現段階ではモックデータ(インメモリ)を返すのみだが、関数シグネチャは
// 将来 Supabase (PostgreSQL) に接続した際にもそのまま使えるように非同期関数として定義している。
// 実DB接続時は、この中身を Supabase クライアントのクエリに差し替えるだけで済む想定。

import {
  ORG_ID,
  appointments,
  bodyMetrics,
  computeAlerts,
  contracts,
  customerNotes,
  customers,
  googleBusyBlocks,
  invoices,
  menuItems,
  messages,
  planTemplates,
  sessions,
  staff,
  tickets,
} from "@/lib/mock/data";
import type {
  AlertNotification,
  Appointment,
  Contract,
  Customer,
  CustomerStatus,
  GoogleBusyBlock,
  Invoice,
  MenuItem,
  PlanTemplate,
  Session,
  Staff,
  Ticket,
} from "@/lib/types";

function delay<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

// ---------------------------------------------------------------------------
// スタッフ
// ---------------------------------------------------------------------------
export async function getStaffList(): Promise<Staff[]> {
  return delay(staff);
}

export async function getStaffById(id: string): Promise<Staff | undefined> {
  return delay(staff.find((s) => s.id === id));
}

// ---------------------------------------------------------------------------
// 顧客まわりの派生情報
// ---------------------------------------------------------------------------
export function getActiveContract(customerId: string): Contract | undefined {
  return contracts.find((c) => c.customerId === customerId && c.status !== "cancelled");
}

export function getCustomerTickets(customerId: string): Ticket[] {
  return tickets.filter((t) => t.customerId === customerId);
}

export function getTicketRemaining(ticket: Ticket): number {
  return ticket.purchasedCount - ticket.usedCount;
}

export function getNextAppointment(customerId: string): Appointment | undefined {
  const now = new Date();
  return appointments
    .filter((a) => a.customerId === customerId && a.status === "confirmed" && new Date(a.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
}

export function getLastVisit(customerId: string): Appointment | undefined {
  return appointments
    .filter((a) => a.customerId === customerId && a.status === "completed")
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0];
}

export interface CustomerListItem {
  customer: Customer;
  staffName?: string;
  contract?: Contract;
  ticketRemaining?: number;
  nextAppointment?: Appointment;
  lastVisit?: Appointment;
}

export interface CustomerListFilter {
  query?: string;
  status?: CustomerStatus | "no_next_appointment" | "ticket_low";
  staffId?: string;
}

export async function getCustomerListItems(filter: CustomerListFilter = {}): Promise<CustomerListItem[]> {
  let list = customers.slice();

  if (filter.query) {
    const q = filter.query.trim().toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (filter.staffId) {
    list = list.filter((c) => c.primaryStaffId === filter.staffId);
  }

  const items: CustomerListItem[] = list.map((customer) => {
    const contract = getActiveContract(customer.id);
    const customerTickets = getCustomerTickets(customer.id);
    const ticketRemaining = customerTickets.length
      ? customerTickets.reduce((sum, t) => sum + getTicketRemaining(t), 0)
      : undefined;
    return {
      customer,
      staffName: staff.find((s) => s.id === customer.primaryStaffId)?.name,
      contract,
      ticketRemaining,
      nextAppointment: getNextAppointment(customer.id),
      lastVisit: getLastVisit(customer.id),
    };
  });

  if (filter.status === "no_next_appointment") {
    return items.filter((i) => i.customer.status === "active" && !i.nextAppointment);
  }
  if (filter.status === "ticket_low") {
    return items.filter((i) => i.ticketRemaining !== undefined && i.ticketRemaining <= 2);
  }
  if (filter.status) {
    return items.filter((i) => i.customer.status === filter.status);
  }

  return delay(items);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  return delay(customers.find((c) => c.id === id));
}

export interface CustomerFullProfile {
  customer: Customer;
  staffName?: string;
  pairedCustomer?: { id: string; name: string };
  contracts: Contract[];
  tickets: Ticket[];
  appointments: Appointment[];
  sessions: Session[];
  bodyMetrics: typeof bodyMetrics;
  invoices: Invoice[];
  notes: typeof customerNotes;
  messages: typeof messages;
  nextAppointment?: Appointment;
  lastVisit?: Appointment;
}

export async function getCustomerFullProfile(id: string): Promise<CustomerFullProfile | undefined> {
  const customer = customers.find((c) => c.id === id);
  if (!customer) return undefined;

  const pairedCustomer = customer.pairedCustomerId
    ? customers.find((c) => c.id === customer.pairedCustomerId)
    : undefined;

  return {
    customer,
    staffName: staff.find((s) => s.id === customer.primaryStaffId)?.name,
    pairedCustomer: pairedCustomer ? { id: pairedCustomer.id, name: pairedCustomer.name } : undefined,
    contracts: contracts.filter((c) => c.customerId === id),
    tickets: tickets.filter((t) => t.customerId === id),
    appointments: appointments
      .filter((a) => a.customerId === id)
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()),
    sessions: sessions
      .filter((s) => s.customerId === id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    bodyMetrics: bodyMetrics
      .filter((m) => m.customerId === id)
      .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()),
    invoices: invoices
      .filter((inv) => inv.customerId === id)
      .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
    notes: customerNotes.filter((n) => n.customerId === id),
    messages: messages
      .filter((m) => m.customerId === id)
      .sort((a, b) => new Date(b.sentAt ?? 0).getTime() - new Date(a.sentAt ?? 0).getTime()),
    nextAppointment: getNextAppointment(id),
    lastVisit: getLastVisit(id),
  };
}

// ---------------------------------------------------------------------------
// 予約・スケジュール
// ---------------------------------------------------------------------------
export interface AppointmentWithDetails extends Appointment {
  customerName: string;
  staffName?: string;
}

export async function getAppointmentsInRange(start: Date, end: Date): Promise<AppointmentWithDetails[]> {
  return delay(
    appointments
      .filter((a) => {
        const t = new Date(a.startAt).getTime();
        return t >= start.getTime() && t < end.getTime();
      })
      .map((a) => ({
        ...a,
        customerName: customers.find((c) => c.id === a.customerId)?.name ?? "不明",
        staffName: staff.find((s) => s.id === a.staffId)?.name,
      }))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
  );
}

export async function getTodayAppointments(): Promise<AppointmentWithDetails[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return getAppointmentsInRange(start, end);
}

export async function getGoogleBusyBlocksInRange(start: Date, end: Date): Promise<GoogleBusyBlock[]> {
  return delay(
    googleBusyBlocks.filter((b) => {
      const t = new Date(b.startAt).getTime();
      return t >= start.getTime() && t < end.getTime();
    }),
  );
}

// ---------------------------------------------------------------------------
// ダッシュボード KPI
// ---------------------------------------------------------------------------
export interface DashboardKpis {
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: number;
  monthlySessionCount: number;
  trialCount: number; // 体験中(現時点)の人数
  newMembersThisMonth: number; // 今月の入会者数(体験 → 契約中)
  leftThisMonth: number; // 今月の退会者数
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyRevenue = invoices
    .filter((inv) => new Date(inv.issuedAt) >= monthStart && inv.status !== "unpaid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const monthlySessionCount = sessions.filter((s) => new Date(s.date) >= monthStart).length;

  const trialCount = customers.filter((c) => c.status === "trial").length;
  const newMembersThisMonth = customers.filter((c) => c.joinedAt && new Date(c.joinedAt) >= monthStart).length;
  const leftThisMonth = contracts.filter(
    (c) => c.status === "cancelled" && c.endDate && new Date(c.endDate) >= monthStart,
  ).length;

  return delay({
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "active").length,
    monthlyRevenue,
    monthlySessionCount,
    trialCount,
    newMembersThisMonth,
    leftThisMonth,
  });
}

// ---------------------------------------------------------------------------
// アラート(要対応)
// ---------------------------------------------------------------------------
export async function getAlerts(): Promise<(AlertNotification & { customerName: string })[]> {
  return delay(
    computeAlerts().map((a) => ({
      ...a,
      customerName: customers.find((c) => c.id === a.customerId)?.name ?? "不明",
    })),
  );
}

// ---------------------------------------------------------------------------
// セッション(一覧)
// ---------------------------------------------------------------------------
export interface SessionListItem extends Session {
  customerName: string;
  staffName?: string;
}

export async function getSessionListItems(): Promise<SessionListItem[]> {
  return delay(
    sessions
      .map((s) => ({
        ...s,
        customerName: customers.find((c) => c.id === s.customerId)?.name ?? "不明",
        staffName: staff.find((st) => st.id === s.staffId)?.name,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  );
}

// ---------------------------------------------------------------------------
// 契約・回数券(一覧)
// ---------------------------------------------------------------------------
export interface ContractListItem {
  contract: Contract;
  customerName: string;
  ticket?: Ticket;
}

export async function getContractListItems(): Promise<ContractListItem[]> {
  return delay(
    contracts.map((contract) => ({
      contract,
      customerName: customers.find((c) => c.id === contract.customerId)?.name ?? "不明",
      ticket: tickets.find((t) => t.contractId === contract.id),
    })),
  );
}

// ---------------------------------------------------------------------------
// 練習メニュー管理(マスタ)
// ---------------------------------------------------------------------------
export async function getMenuItems(): Promise<MenuItem[]> {
  return delay(menuItems.slice().sort((a, b) => a.name.localeCompare(b.name, "ja")));
}

// ---------------------------------------------------------------------------
// 契約管理(マスタ = プランのひな形)
// ---------------------------------------------------------------------------
export async function getPlanTemplates(): Promise<PlanTemplate[]> {
  return delay(planTemplates.slice());
}

export interface PlanTemplateUsage {
  template: PlanTemplate;
  customerCount: number;
}

export async function getPlanTemplateUsage(): Promise<PlanTemplateUsage[]> {
  return delay(
    planTemplates.map((template) => ({
      template,
      customerCount: contracts.filter((c) => c.planName === template.name && c.status !== "cancelled").length,
    })),
  );
}

// ---------------------------------------------------------------------------
// 請求・入金
// ---------------------------------------------------------------------------
export interface InvoiceListItem extends Invoice {
  customerName: string;
}

export interface InvoiceListFilter {
  status?: "unpaid" | "overdue";
}

export async function getInvoiceListItems(filter: InvoiceListFilter = {}): Promise<InvoiceListItem[]> {
  let list = invoices.map((inv) => ({
    ...inv,
    customerName: customers.find((c) => c.id === inv.customerId)?.name ?? "不明",
  }));

  if (filter.status) {
    list = list.filter((inv) => inv.status === filter.status);
  }

  return delay(list.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()));
}

export interface BillingSummary {
  totalUnpaid: number;
  totalOverdue: number;
  unpaidCount: number;
  overdueCount: number;
  paidThisMonth: number;
}

export async function getBillingSummary(): Promise<BillingSummary> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const unpaid = invoices.filter((inv) => inv.status === "unpaid");
  const overdue = invoices.filter((inv) => inv.status === "overdue");
  const paidThisMonth = invoices
    .filter((inv) => inv.status === "paid" && inv.paidAt && new Date(inv.paidAt) >= monthStart)
    .reduce((sum, inv) => sum + inv.amount, 0);

  return delay({
    totalUnpaid: unpaid.reduce((sum, inv) => sum + inv.amount, 0),
    totalOverdue: overdue.reduce((sum, inv) => sum + inv.amount, 0),
    unpaidCount: unpaid.length,
    overdueCount: overdue.length,
    paidThisMonth,
  });
}

// ---------------------------------------------------------------------------
// スタッフ管理
// ---------------------------------------------------------------------------
export interface StaffListItem extends Staff {
  customerCount: number;
  monthlySessionCount: number;
}

export async function getStaffListItems(): Promise<StaffListItem[]> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return delay(
    staff.map((s) => ({
      ...s,
      customerCount: customers.filter((c) => c.primaryStaffId === s.id && c.status === "active").length,
      monthlySessionCount: sessions.filter((sess) => sess.staffId === s.id && new Date(sess.date) >= monthStart)
        .length,
    })),
  );
}

// ---------------------------------------------------------------------------
// レポート(経営ダッシュボード)
// ---------------------------------------------------------------------------
export interface MonthlyRevenuePoint {
  month: string; // "yyyy-MM"
  label: string; // "8月"
  revenue: number;
}

export interface TrainerBreakdown {
  staffId: string;
  staffName: string;
  revenue: number;
  sessionCount: number;
}

export interface ReportMetrics {
  monthlyRevenue: number;
  newCustomerCount: number;
  activeContractCount: number;
  cancelledCount: number;
  retentionRate: number; // %
  renewalRate: number; // %
  averageRevenuePerCustomer: number;
  sessionCount: number;
  revenueTrend: MonthlyRevenuePoint[];
  trainerBreakdown: TrainerBreakdown[];
}

export async function getReportMetrics(): Promise<ReportMetrics> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyRevenue = invoices
    .filter((inv) => new Date(inv.issuedAt) >= monthStart && inv.status !== "unpaid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const newCustomerCount = customers.filter((c) => new Date(c.createdAt) >= monthStart).length;
  const activeContractCount = contracts.filter((c) => c.status === "active").length;
  const cancelledCount = contracts.filter(
    (c) => c.status === "cancelled" && c.endDate && new Date(c.endDate) >= monthStart,
  ).length;

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const retentionRate = customers.length > 0 ? (activeCustomers / customers.length) * 100 : 0;

  const everContracted = contracts.filter((c) => c.status === "active" || c.status === "cancelled").length;
  const renewalRate = everContracted > 0 ? (activeContractCount / everContracted) * 100 : 0;

  const averageRevenuePerCustomer = activeCustomers > 0 ? monthlyRevenue / activeCustomers : 0;

  const sessionCount = sessions.filter((s) => new Date(s.date) >= monthStart).length;

  const revenueTrend: MonthlyRevenuePoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const revenue = invoices
      .filter((inv) => {
        const d = new Date(inv.issuedAt);
        return d >= start && d < end && inv.status !== "unpaid";
      })
      .reduce((sum, inv) => sum + inv.amount, 0);
    revenueTrend.push({
      month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      label: `${start.getMonth() + 1}月`,
      revenue,
    });
  }

  const trainerBreakdown: TrainerBreakdown[] = staff.map((s) => {
    const staffCustomerIds = new Set(customers.filter((c) => c.primaryStaffId === s.id).map((c) => c.id));
    const revenue = invoices
      .filter(
        (inv) =>
          staffCustomerIds.has(inv.customerId) && new Date(inv.issuedAt) >= monthStart && inv.status !== "unpaid",
      )
      .reduce((sum, inv) => sum + inv.amount, 0);
    const sessionCountForStaff = sessions.filter(
      (sess) => sess.staffId === s.id && new Date(sess.date) >= monthStart,
    ).length;
    return { staffId: s.id, staffName: s.name, revenue, sessionCount: sessionCountForStaff };
  });

  return delay({
    monthlyRevenue,
    newCustomerCount,
    activeContractCount,
    cancelledCount,
    retentionRate,
    renewalRate,
    averageRevenuePerCustomer,
    sessionCount,
    revenueTrend,
    trainerBreakdown,
  });
}

export { ORG_ID };
