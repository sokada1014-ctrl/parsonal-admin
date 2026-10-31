"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  appointments,
  contracts,
  customers,
  invoices,
  menuItems,
  messages,
  planTemplates,
  sessions,
  staff,
  tickets,
  ORG_ID,
} from "@/lib/mock/data";
import type {
  Appointment,
  AppointmentStatus,
  Contract,
  ContractStatus,
  Customer,
  CustomerStatus,
  MenuItem,
  Message,
  PlanTemplate,
  PlanType,
  Session,
  SessionExercise,
  Staff,
  StaffRole,
  Ticket,
} from "@/lib/types";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function addMonthsToDateStr(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export async function createCustomerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("氏名は必須です");
  }

  const status = ((formData.get("status") as CustomerStatus) || "trial") as CustomerStatus;

  const customer: Customer = {
    id: newId("cust"),
    organizationId: ORG_ID,
    name,
    birthDate: (formData.get("birthDate") as string) || undefined,
    gender: (formData.get("gender") as Customer["gender"]) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    primaryStaffId: String(formData.get("primaryStaffId") ?? ""),
    status,
    goal: (formData.get("goal") as string) || undefined,
    cautions: (formData.get("cautions") as string) || undefined,
    memo: (formData.get("memo") as string) || undefined,
    createdAt: new Date().toISOString(),
    joinedAt: status === "active" ? new Date().toISOString() : undefined,
  };

  customers.push(customer);
  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomerAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const customer = customers.find((c) => c.id === id);
  if (!customer) throw new Error("顧客が見つかりません");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("氏名は必須です");

  const nextStatus = (formData.get("status") as CustomerStatus) || customer.status;

  customer.name = name;
  customer.birthDate = (formData.get("birthDate") as string) || undefined;
  customer.gender = (formData.get("gender") as Customer["gender"]) || undefined;
  customer.phone = (formData.get("phone") as string) || undefined;
  customer.email = (formData.get("email") as string) || undefined;
  customer.address = (formData.get("address") as string) || undefined;
  customer.primaryStaffId = String(formData.get("primaryStaffId") ?? customer.primaryStaffId);
  // 初めて「契約中」になったタイミングを入会日として記録する(ダッシュボードの入会者数に使う)
  if (nextStatus === "active" && customer.status !== "active" && !customer.joinedAt) {
    customer.joinedAt = new Date().toISOString();
  }
  customer.status = nextStatus;
  customer.goal = (formData.get("goal") as string) || undefined;
  customer.cautions = (formData.get("cautions") as string) || undefined;
  customer.memo = (formData.get("memo") as string) || undefined;

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function updateCustomerStaffAction(customerId: string, staffId: string) {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) throw new Error("顧客が見つかりません");
  customer.primaryStaffId = staffId;
  revalidatePath("/customers");
}

// ペア参加の紐づけを設定/解除する。双方向に同期させる。
export async function updateCustomerPairAction(customerId: string, pairedCustomerId: string | null) {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) throw new Error("顧客が見つかりません");

  // 既存のペア関係があれば先に解消する
  if (customer.pairedCustomerId) {
    const prevPartner = customers.find((c) => c.id === customer.pairedCustomerId);
    if (prevPartner) prevPartner.pairedCustomerId = undefined;
  }

  if (pairedCustomerId) {
    const partner = customers.find((c) => c.id === pairedCustomerId);
    if (!partner) throw new Error("ペア相手が見つかりません");
    // 相手側の既存ペアも解消してから、新しいペアを双方向に設定する
    if (partner.pairedCustomerId) {
      const partnersPrevPartner = customers.find((c) => c.id === partner.pairedCustomerId);
      if (partnersPrevPartner) partnersPrevPartner.pairedCustomerId = undefined;
    }
    customer.pairedCustomerId = partner.id;
    partner.pairedCustomerId = customer.id;
  } else {
    customer.pairedCustomerId = undefined;
  }

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/customers");
}

export async function updateCustomerPlanAction(
  customerId: string,
  input: { planTemplateId?: string; customPlanName?: string },
) {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) throw new Error("顧客が見つかりません");

  const template = input.planTemplateId ? planTemplates.find((p) => p.id === input.planTemplateId) : undefined;
  const planName = template?.name ?? input.customPlanName?.trim();
  if (!planName) throw new Error("契約プランを指定してください");

  let contract = contracts.find((c) => c.customerId === customerId && c.status !== "cancelled");
  const today = new Date().toISOString().slice(0, 10);

  if (!contract) {
    contract = {
      id: newId("contract"),
      organizationId: ORG_ID,
      customerId,
      planName,
      planType: template?.planType ?? "monthly",
      startDate: today,
      status: "active",
      monthlyFee: template?.planType === "monthly" ? template.monthlyFee : undefined,
      monthlySessionCount: template?.planType === "monthly" ? template.monthlySessionCount : undefined,
    };
    contracts.push(contract);
  } else {
    contract.planName = planName;
    if (template) {
      contract.planType = template.planType;
      contract.monthlyFee = template.planType === "monthly" ? template.monthlyFee : undefined;
      contract.monthlySessionCount = template.planType === "monthly" ? template.monthlySessionCount : undefined;
    }
  }

  const effectivePlanType = template?.planType ?? contract.planType;
  if (effectivePlanType === "ticket") {
    const hasTicket = tickets.some((t) => t.contractId === contract!.id);
    if (!hasTicket) {
      tickets.push({
        id: newId("ticket"),
        organizationId: ORG_ID,
        customerId,
        contractId: contract.id,
        name: planName,
        purchasedCount: template?.ticketCount ?? 10,
        usedCount: 0,
        purchasedAt: today,
        expiresAt: addMonthsToDateStr(today, template?.validityMonths ?? 2),
      });
    }
  } else if (effectivePlanType === "monthly" && (template?.monthlySessionCount ?? contract.monthlySessionCount)) {
    const hasTicket = tickets.some((t) => t.contractId === contract!.id);
    if (!hasTicket) {
      tickets.push({
        id: newId("ticket"),
        organizationId: ORG_ID,
        customerId,
        contractId: contract.id,
        name: planName,
        purchasedCount: (template?.monthlySessionCount ?? contract.monthlySessionCount)!,
        usedCount: 0,
        purchasedAt: today,
        expiresAt: undefined,
      });
    }
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
}

export async function createSessionAction(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "");
  const staffId = String(formData.get("staffId") ?? "");
  const date = String(formData.get("date") ?? "");
  if (!customerId || !staffId || !date) {
    throw new Error("必須項目が未入力です");
  }

  const exerciseNames = formData.getAll("exerciseName") as string[];
  const exerciseWeights = formData.getAll("exerciseWeight") as string[];
  const exerciseReps = formData.getAll("exerciseReps") as string[];
  const exerciseSets = formData.getAll("exerciseSets") as string[];

  const sessionId = newId("session");
  const exercises: SessionExercise[] = exerciseNames
    .map((name, idx) => ({
      id: `${sessionId}-ex-${idx}`,
      sessionId,
      name: name?.trim(),
      weightKg: exerciseWeights[idx] ? Number(exerciseWeights[idx]) : undefined,
      reps: exerciseReps[idx] ? Number(exerciseReps[idx]) : undefined,
      sets: exerciseSets[idx] ? Number(exerciseSets[idx]) : undefined,
      order: idx,
    }))
    .filter((e) => e.name);

  const session: Session = {
    id: sessionId,
    organizationId: ORG_ID,
    customerId,
    staffId,
    date,
    condition: (formData.get("condition") as string) || undefined,
    nutritionGuidance: (formData.get("nutritionGuidance") as string) || undefined,
    customerFeedback: (formData.get("customerFeedback") as string) || undefined,
    cautions: (formData.get("cautions") as string) || undefined,
    nextPlan: (formData.get("nextPlan") as string) || undefined,
    trainerMemo: (formData.get("trainerMemo") as string) || undefined,
    exercises,
    recordedAt: new Date().toISOString(),
  };

  sessions.push(session);

  // 回数券を保有している場合は1回消化する
  const ticket = tickets.find((t) => t.customerId === customerId && t.purchasedCount > t.usedCount);
  if (ticket) {
    ticket.usedCount += 1;
  }

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}?tab=sessions`);
}

export async function loginAction() {
  // 現段階ではモックデータ運用のため実際の認証は行わず、ダッシュボードへ遷移する。
  // 将来 Supabase Auth 接続時にここでメール/パスワード認証を実装する。
  redirect("/");
}

export async function createAppointmentAction(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "");
  const staffId = String(formData.get("staffId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const durationMin = Number(formData.get("durationMin") ?? 60);
  const pairCustomerId = String(formData.get("pairCustomerId") ?? "");
  if (!customerId || !staffId || !date || !startTime) {
    throw new Error("必須項目が未入力です");
  }

  const start = new Date(`${date}T${startTime}:00`);
  const end = new Date(start.getTime() + durationMin * 60000);
  const menu = (formData.get("menu") as string) || undefined;
  const note = (formData.get("note") as string) || undefined;

  const appointment: Appointment = {
    id: newId("appt"),
    organizationId: ORG_ID,
    customerId,
    staffId,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    menu,
    status: "confirmed" as AppointmentStatus,
    note,
  };
  appointments.push(appointment);

  // ペア参加: もう一方の顧客も同時刻で同時予約する
  if (pairCustomerId && pairCustomerId !== customerId) {
    const pairAppointment: Appointment = {
      id: newId("appt"),
      organizationId: ORG_ID,
      customerId: pairCustomerId,
      staffId,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      menu,
      status: "confirmed" as AppointmentStatus,
      note,
      pairedAppointmentId: appointment.id,
    };
    appointments.push(pairAppointment);
    appointment.pairedAppointmentId = pairAppointment.id;
  }

  revalidatePath("/schedule");
  revalidatePath("/");
}

export async function createContractAction(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "");
  const planTemplateId = String(formData.get("planTemplateId") ?? "");
  const customPlanName = String(formData.get("customPlanName") ?? "").trim();
  const template = planTemplates.find((p) => p.id === planTemplateId);
  const planName = template?.name ?? customPlanName;
  const planType = (template?.planType ?? (formData.get("planType") as PlanType)) || "monthly";
  if (!customerId || !planName) throw new Error("必須項目が未入力です");

  const startDate = String(formData.get("startDate") ?? new Date().toISOString().slice(0, 10));
  const monthlyFeeRaw = formData.get("monthlyFee");
  const monthlyFee = template?.monthlyFee ?? (monthlyFeeRaw ? Number(monthlyFeeRaw) : undefined);
  const monthlySessionCountRaw = formData.get("monthlySessionCount");
  const monthlySessionCount =
    template?.monthlySessionCount ?? (monthlySessionCountRaw ? Number(monthlySessionCountRaw) : undefined);

  const contract: Contract = {
    id: newId("contract"),
    organizationId: ORG_ID,
    customerId,
    planName,
    planType,
    startDate,
    endDate: (formData.get("endDate") as string) || undefined,
    renewalDate: (formData.get("renewalDate") as string) || undefined,
    monthlyFee: planType === "monthly" ? monthlyFee : undefined,
    monthlySessionCount: planType === "monthly" ? monthlySessionCount : undefined,
    status: ((formData.get("status") as ContractStatus) || "active") as ContractStatus,
  };
  contracts.push(contract);

  if (planType === "ticket") {
    const ticketCountRaw = formData.get("ticketCount");
    const purchasedCount = template?.ticketCount ?? (ticketCountRaw ? Number(ticketCountRaw) : 10);
    const validityMonthsRaw = formData.get("validityMonths");
    const validityMonths = template?.validityMonths ?? (validityMonthsRaw ? Number(validityMonthsRaw) : 2);
    const ticket: Ticket = {
      id: newId("ticket"),
      organizationId: ORG_ID,
      customerId,
      contractId: contract.id,
      name: planName,
      purchasedCount,
      usedCount: 0,
      purchasedAt: startDate,
      expiresAt: addMonthsToDateStr(startDate, validityMonths),
    };
    tickets.push(ticket);
  } else if (planType === "monthly" && monthlySessionCount) {
    // サブスクの「残り回数」を回数券と同じ仕組みで管理する(自動更新のたびに繰越加算される)
    const ticket: Ticket = {
      id: newId("ticket"),
      organizationId: ORG_ID,
      customerId,
      contractId: contract.id,
      name: planName,
      purchasedCount: monthlySessionCount,
      usedCount: 0,
      purchasedAt: startDate,
      expiresAt: undefined,
    };
    tickets.push(ticket);
  }

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/contracts");
}

export async function createMenuItemAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("メニュー名は必須です");

  const item: MenuItem = {
    id: newId("menu"),
    organizationId: ORG_ID,
    name,
    category: (formData.get("category") as string) || undefined,
  };
  menuItems.push(item);
  revalidatePath("/menus");
}

export async function deleteMenuItemAction(id: string) {
  const index = menuItems.findIndex((m) => m.id === id);
  if (index !== -1) menuItems.splice(index, 1);
  revalidatePath("/menus");
}

export async function createPlanTemplateAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const planType = (formData.get("planType") as PlanType) || "monthly";
  if (!name) throw new Error("プラン名は必須です");

  const monthlyFeeRaw = formData.get("monthlyFee");
  const ticketCountRaw = formData.get("ticketCount");
  const validityMonthsRaw = formData.get("validityMonths");
  const monthlySessionCountRaw = formData.get("monthlySessionCount");

  const template: PlanTemplate = {
    id: newId("plan"),
    organizationId: ORG_ID,
    name,
    planType,
    monthlyFee: planType === "monthly" && monthlyFeeRaw ? Number(monthlyFeeRaw) : undefined,
    monthlySessionCount: planType === "monthly" && monthlySessionCountRaw ? Number(monthlySessionCountRaw) : undefined,
    ticketCount: planType === "ticket" && ticketCountRaw ? Number(ticketCountRaw) : undefined,
    validityMonths: planType === "ticket" && validityMonthsRaw ? Number(validityMonthsRaw) : undefined,
  };
  planTemplates.push(template);
  revalidatePath("/plans");
}

export async function deletePlanTemplateAction(id: string) {
  const index = planTemplates.findIndex((p) => p.id === id);
  if (index !== -1) planTemplates.splice(index, 1);
  revalidatePath("/plans");
}

export async function sendCandidateSlotsMessageAction(customerId: string, slotLabels: string[]) {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) throw new Error("顧客が見つかりません");

  const body = `${customer.name}さん、いつもありがとうございます!\n以下の日程で空きがございます。ご都合の良い日時があればお知らせください。\n\n${slotLabels.map((s) => `・${s}`).join("\n")}`;

  const message: Message = {
    id: newId("msg"),
    organizationId: ORG_ID,
    customerId,
    type: "manual",
    status: "sent",
    body,
    sentAt: new Date().toISOString(),
  };
  messages.push(message);

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/schedule");
}

export async function markInvoicePaidAction(invoiceId: string) {
  const invoice = invoices.find((inv) => inv.id === invoiceId);
  if (!invoice) throw new Error("請求が見つかりません");

  invoice.status = "paid";
  invoice.paidAt = new Date().toISOString().slice(0, 10);

  // サブスクプランの繰越: 入金が確認できた時点で、余っている回数に当月分の基本回数を加算する。
  const contract = contracts.find(
    (c) => c.customerId === invoice.customerId && c.status === "active" && c.planType === "monthly" && c.monthlySessionCount,
  );
  if (contract?.monthlySessionCount) {
    const balanceTicket = tickets.find((t) => t.contractId === contract.id);
    if (balanceTicket) {
      balanceTicket.purchasedCount += contract.monthlySessionCount;
    }
  }

  revalidatePath("/billing");
  revalidatePath(`/customers/${invoice.customerId}`);
  revalidatePath("/");
}

export async function createStaffAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = (formData.get("role") as StaffRole) || "trainer";
  if (!name || !email) throw new Error("必須項目が未入力です");

  const member: Staff = {
    id: newId("staff"),
    organizationId: ORG_ID,
    name,
    email,
    role,
  };
  staff.push(member);

  revalidatePath("/staff");
}

export async function updateStaffRoleAction(staffId: string, role: StaffRole) {
  const member = staff.find((s) => s.id === staffId);
  if (!member) throw new Error("スタッフが見つかりません");
  member.role = role;
  revalidatePath("/staff");
}

export async function deleteStaffAction(staffId: string) {
  const index = staff.findIndex((s) => s.id === staffId);
  if (index === -1) return;
  if (staff.length <= 1) throw new Error("最後の1名は削除できません");
  staff.splice(index, 1);
  revalidatePath("/staff");
}
