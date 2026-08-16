import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerStatusBadge } from "@/components/status-badge";
import { OverviewTab } from "@/components/customers/overview-tab";
import { SessionsTab } from "@/components/customers/sessions-tab";
import { BodyMetricsTab } from "@/components/customers/body-metrics-tab";
import { ContractsTab } from "@/components/customers/contracts-tab";
import { BillingTab } from "@/components/customers/billing-tab";
import { MessagesTab } from "@/components/customers/messages-tab";
import { getCustomerFullProfile, getPlanTemplates, getTicketRemaining } from "@/lib/data-access";
import { calcAge, formatDateTime } from "@/lib/format";
import { LINK_UNDERLINE } from "@/lib/motion";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const [profile, planTemplates] = await Promise.all([getCustomerFullProfile(id), getPlanTemplates()]);
  if (!profile) notFound();

  const { customer, staffName, tickets, contracts, nextAppointment } = profile;
  const activeContract = contracts.find((c) => c.status === "active") ?? contracts[0];
  const ticketRemaining = tickets.length
    ? tickets.reduce((sum, t) => sum + getTicketRemaining(t), 0)
    : undefined;
  const age = calcAge(customer.birthDate);

  const validTabs = ["overview", "sessions", "body-metrics", "contracts", "billing", "messages"];
  const initialTab = tab && validTabs.includes(tab) ? tab : "overview";

  return (
    <div>
      <Link
        href="/customers"
        className="group mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft className="size-4" />
        <span className={LINK_UNDERLINE}>顧客一覧に戻る</span>
      </Link>

      <div className="mb-6 flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 shrink-0">
            <AvatarFallback className="bg-primary-light text-lg font-medium text-primary">
              {customer.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">{customer.name}</h1>
              {age !== undefined && <span className="text-sm text-text-secondary">{age}歳</span>}
              <CustomerStatusBadge status={customer.status} />
            </div>
            <p className="mt-1 text-sm text-text-secondary">担当: {staffName ?? "未設定"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-t border-border pt-4 text-sm sm:grid-cols-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <div>
            <p className="text-text-secondary">契約プラン</p>
            <p className="font-medium text-text-primary">{activeContract?.planName ?? "-"}</p>
          </div>
          <div>
            <p className="text-text-secondary">回数券残数</p>
            <p className="font-medium text-text-primary">{ticketRemaining !== undefined ? `残り${ticketRemaining}回` : "-"}</p>
          </div>
          <div>
            <p className="text-text-secondary">次回予約</p>
            <p className="font-medium text-text-primary">{nextAppointment ? formatDateTime(nextAppointment.startAt) : "未予約"}</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Pencil className="size-4" />
              編集
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/sessions/new?customerId=${customer.id}`}>
              <Plus className="size-4" />
              セッションを記録
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="mb-6 h-auto! flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="sessions">セッション</TabsTrigger>
          <TabsTrigger value="body-metrics">身体データ</TabsTrigger>
          <TabsTrigger value="contracts">契約</TabsTrigger>
          <TabsTrigger value="billing">支払い</TabsTrigger>
          <TabsTrigger value="messages">メッセージ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab profile={profile} />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsTab profile={profile} />
        </TabsContent>
        <TabsContent value="body-metrics">
          <BodyMetricsTab profile={profile} />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractsTab profile={profile} planTemplates={planTemplates} />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab profile={profile} />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesTab customerName={customer.name} messages={profile.messages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
