import { cn } from "@/lib/utils";
import type { AppointmentStatus, ContractStatus, CustomerStatus, InvoiceStatus } from "@/lib/types";

type Tone = "primary" | "muted" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-light text-primary",
  muted: "bg-muted text-text-secondary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
};

function Dot({ tone }: { tone: Tone }) {
  const dotColor: Record<Tone, string> = {
    primary: "bg-primary",
    muted: "bg-text-muted",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return <span className={cn("size-1.5 rounded-full", dotColor[tone])} />;
}

function BaseBadge({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
      )}
    >
      <Dot tone={tone} />
      {label}
    </span>
  );
}

const customerStatusMap: Record<CustomerStatus, { label: string; tone: Tone }> = {
  trial: { label: "体験中", tone: "warning" },
  active: { label: "契約中", tone: "primary" },
  paused: { label: "休会", tone: "warning" },
  cancelled: { label: "解約", tone: "muted" },
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const s = customerStatusMap[status];
  return <BaseBadge tone={s.tone} label={s.label} />;
}

const contractStatusMap: Record<ContractStatus, { label: string; tone: Tone }> = {
  active: { label: "契約中", tone: "primary" },
  paused: { label: "休会", tone: "warning" },
  cancelled: { label: "解約", tone: "muted" },
  expired: { label: "期限切れ", tone: "muted" },
};

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  const s = contractStatusMap[status];
  return <BaseBadge tone={s.tone} label={s.label} />;
}

const invoiceStatusMap: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  paid: { label: "入金済", tone: "success" },
  unpaid: { label: "未入金", tone: "warning" },
  overdue: { label: "期限超過", tone: "danger" },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const s = invoiceStatusMap[status];
  return <BaseBadge tone={s.tone} label={s.label} />;
}

const appointmentStatusMap: Record<AppointmentStatus, { label: string; tone: Tone }> = {
  confirmed: { label: "予約確定", tone: "primary" },
  completed: { label: "完了", tone: "muted" },
  cancelled: { label: "キャンセル", tone: "danger" },
  no_show: { label: "無断キャンセル", tone: "danger" },
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const s = appointmentStatusMap[status];
  return <BaseBadge tone={s.tone} label={s.label} />;
}

export function SeverityBadge({ severity, label }: { severity: "info" | "warning" | "danger"; label: string }) {
  const tone: Tone = severity === "danger" ? "danger" : severity === "warning" ? "warning" : "muted";
  return <BaseBadge tone={tone} label={label} />;
}
