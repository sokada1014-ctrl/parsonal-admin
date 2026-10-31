// ドメイン型定義。DB設計(docs/database-schema.md)のテーブル構造にほぼ1:1で対応する。
// 将来 Supabase 接続に切り替える際も、この型をそのまま Row 型として流用できるようにしている。

export type UUID = string;

export type StaffRole = "owner" | "manager" | "trainer";

export interface Staff {
  id: UUID;
  organizationId: UUID;
  name: string;
  avatarUrl?: string;
  email: string;
  role: StaffRole;
}

// 練習メニュー管理(マスタデータ)。セッション記録・予約のメニュー欄で選択、または自由記述できる。
export interface MenuItem {
  id: UUID;
  organizationId: UUID;
  name: string;
  category?: string;
}

// 契約管理(マスタデータ = プランのひな形)。顧客の契約作成時に選択、または自由記述できる。
export interface PlanTemplate {
  id: UUID;
  organizationId: UUID;
  name: string;
  planType: PlanType;
  monthlyFee?: number;
  ticketCount?: number; // planType が ticket の場合の購入回数の初期値
  validityMonths?: number; // planType が ticket の場合の有効期間(月数)
  monthlySessionCount?: number; // planType が monthly(サブスク)の場合の月間基本回数
}

export type ContractStatus = "active" | "paused" | "cancelled" | "expired";

// trial = 体験(入会前)。active = 契約中(入会済み)。
export type CustomerStatus = "trial" | "active" | "paused" | "cancelled";

export interface Customer {
  id: UUID;
  organizationId: UUID;
  name: string;
  nameKana?: string;
  avatarUrl?: string;
  birthDate?: string; // YYYY-MM-DD
  gender?: "male" | "female" | "other";
  phone?: string;
  email?: string;
  address?: string;
  primaryStaffId: UUID;
  status: CustomerStatus;
  goal?: string;
  cautions?: string; // 注意事項(既往歴・怪我など)
  memo?: string;
  pairedCustomerId?: UUID; // ペア参加の相手(双方向で設定する)
  squareCustomerId?: string; // Square Customers APIから同期した場合の連携元ID(重複取り込み防止用)
  createdAt: string;
  joinedAt?: string; // 体験 → 入会(active)に切り替わった日。入会者数の集計に使う
}

export interface CustomerNote {
  id: UUID;
  customerId: UUID;
  staffId: UUID;
  body: string;
  createdAt: string;
}

export interface BodyMetric {
  id: UUID;
  customerId: UUID;
  measuredAt: string; // YYYY-MM-DD
  weightKg?: number;
  bodyFatPct?: number;
  bmi?: number;
  waistCm?: number;
}

export type PlanType = "monthly" | "ticket";

export interface Contract {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  planName: string;
  planType: PlanType;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  monthlyFee?: number;
  monthlySessionCount?: number; // サブスク(monthly)の月間基本回数。設定されていれば自動更新+繰越の対象
  status: ContractStatus;
}

export interface Ticket {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  contractId?: UUID;
  name: string;
  purchasedCount: number;
  usedCount: number;
  purchasedAt: string;
  expiresAt?: string;
}

export interface TicketUsage {
  id: UUID;
  ticketId: UUID;
  sessionId: UUID;
  usedAt: string;
}

export type AppointmentStatus = "confirmed" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  staffId: UUID;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  menu?: string;
  status: AppointmentStatus;
  note?: string;
  pairedAppointmentId?: UUID; // ペアで同時予約した場合、もう片方の予約を指す
}

export interface SessionExercise {
  id: UUID;
  sessionId: UUID;
  name: string;
  weightKg?: number;
  reps?: number;
  sets?: number;
  order: number;
}

export interface Session {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  staffId: UUID;
  appointmentId?: UUID;
  date: string; // YYYY-MM-DD
  condition?: string;
  nutritionGuidance?: string;
  customerFeedback?: string;
  cautions?: string;
  nextPlan?: string;
  trainerMemo?: string;
  exercises: SessionExercise[];
  recordedAt: string;
}

export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export interface Invoice {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  amount: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  status: InvoiceStatus;
}

export interface Payment {
  id: UUID;
  invoiceId: UUID;
  amount: number;
  paidAt: string;
  method?: string;
}

export type MessageType = "follow_up" | "reminder" | "campaign" | "manual";
export type MessageStatus = "sent" | "scheduled" | "failed";

export interface Message {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  type: MessageType;
  status: MessageStatus;
  body: string;
  sentAt?: string;
}

// Googleカレンダー連携(シミュレーション)。外部カレンダーの予定を表す。
export interface GoogleBusyBlock {
  id: UUID;
  staffId: UUID;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  title: string;
}

export type NotificationType =
  | "ticket_low"
  | "renewal_due"
  | "no_next_appointment"
  | "inactive"
  | "unpaid"
  | "overdue"
  | "session_not_recorded";

export interface AlertNotification {
  id: UUID;
  organizationId: UUID;
  customerId: UUID;
  type: NotificationType;
  message: string;
  severity: "info" | "warning" | "danger";
  createdAt: string;
}
