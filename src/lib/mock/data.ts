import type {
  AlertNotification,
  Appointment,
  AppointmentStatus,
  BodyMetric,
  Contract,
  ContractStatus,
  Customer,
  CustomerNote,
  CustomerStatus,
  GoogleBusyBlock,
  Invoice,
  MenuItem,
  Message,
  PlanTemplate,
  Session,
  SessionExercise,
  Staff,
  Ticket,
} from "@/lib/types";
import { addDays, addMonths, createRng, pick, pickWeighted, randFloat, randInt, toDateStr, toISO } from "./seed";

export const ORG_ID = "org-1";

const rng = createRng(20260809);

const today = new Date();
today.setHours(0, 0, 0, 0);

// ---------------------------------------------------------------------------
// スタッフ
// ---------------------------------------------------------------------------
export const staff: Staff[] = [
  { id: "staff-1", organizationId: ORG_ID, name: "山田 健太", email: "yamada@example.com", role: "owner" },
  { id: "staff-2", organizationId: ORG_ID, name: "中村 彩", email: "nakamura@example.com", role: "trainer" },
  { id: "staff-3", organizationId: ORG_ID, name: "佐々木 悠", email: "sasaki@example.com", role: "trainer" },
];

const staffIds = staff.map((s) => s.id);

// ---------------------------------------------------------------------------
// 練習メニュー管理(マスタ)。セッション記録・予約のメニュー欄で選択、または自由記述できる。
// ---------------------------------------------------------------------------
export const menuItems: MenuItem[] = [
  { id: "menu-1", organizationId: ORG_ID, name: "下半身トレーニング", category: "トレーニング" },
  { id: "menu-2", organizationId: ORG_ID, name: "上半身トレーニング", category: "トレーニング" },
  { id: "menu-3", organizationId: ORG_ID, name: "全身コンディショニング", category: "トレーニング" },
  { id: "menu-4", organizationId: ORG_ID, name: "有酸素+体幹", category: "トレーニング" },
  { id: "menu-5", organizationId: ORG_ID, name: "ピラティス基礎", category: "ピラティス" },
  { id: "menu-6", organizationId: ORG_ID, name: "ストレッチ+可動域改善", category: "ストレッチ" },
  { id: "menu-7", organizationId: ORG_ID, name: "キックボクシング基礎", category: "キックボクシング" },
  { id: "menu-8", organizationId: ORG_ID, name: "パーソナルトレーニング", category: "トレーニング" },
  { id: "menu-9", organizationId: ORG_ID, name: "スクワット", category: "種目" },
  { id: "menu-10", organizationId: ORG_ID, name: "デッドリフト", category: "種目" },
  { id: "menu-11", organizationId: ORG_ID, name: "ベンチプレス", category: "種目" },
  { id: "menu-12", organizationId: ORG_ID, name: "ランジ", category: "種目" },
  { id: "menu-13", organizationId: ORG_ID, name: "プランク", category: "種目" },
  { id: "menu-14", organizationId: ORG_ID, name: "ヒップスラスト", category: "種目" },
  { id: "menu-15", organizationId: ORG_ID, name: "ラットプルダウン", category: "種目" },
  { id: "menu-16", organizationId: ORG_ID, name: "ショルダープレス", category: "種目" },
];

// ---------------------------------------------------------------------------
// 契約管理(マスタ = プランのひな形)。顧客の契約作成時に選択、または自由記述できる。
// ---------------------------------------------------------------------------
export const planTemplates: PlanTemplate[] = [
  // サブスク(月謝制)。毎月自動更新し、使わなかった回数は入金確認時に翌月へ繰り越す。
  { id: "plan-1", organizationId: ORG_ID, name: "サブスク月4回", planType: "monthly", monthlyFee: 32000, monthlySessionCount: 4 },
  { id: "plan-2", organizationId: ORG_ID, name: "サブスク月6回", planType: "monthly", monthlyFee: 45000, monthlySessionCount: 6 },
  { id: "plan-3", organizationId: ORG_ID, name: "サブスク月8回", planType: "monthly", monthlyFee: 58000, monthlySessionCount: 8 },
  // 回数券。有効期間内に使い切る形で、自動更新はしない。
  { id: "plan-4", organizationId: ORG_ID, name: "単発(2ヶ月)", planType: "ticket", ticketCount: 1, validityMonths: 2 },
  { id: "plan-5", organizationId: ORG_ID, name: "5回回数券(2ヶ月)", planType: "ticket", ticketCount: 5, validityMonths: 2 },
  { id: "plan-6", organizationId: ORG_ID, name: "10回回数券(半年)", planType: "ticket", ticketCount: 10, validityMonths: 6 },
  { id: "plan-7", organizationId: ORG_ID, name: "20回回数券(1年)", planType: "ticket", ticketCount: 20, validityMonths: 12 },
];

// ---------------------------------------------------------------------------
// 顧客
// ---------------------------------------------------------------------------
const familyNames = [
  "佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤",
  "吉田", "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斎藤", "清水",
  "森", "池田", "橋本", "石川",
];
const givenNamesMale = ["大輔", "翔太", "健", "拓也", "直樹", "蓮", "颯太", "陽介", "隼人", "浩二", "亮", "涼太"];
const givenNamesFemale = ["美咲", "陽菜", "愛", "彩花", "結衣", "真央", "由美", "麻衣", "さくら", "千尋", "菜々子", "美穂"];

const goals = [
  "ダイエット(-5kg)", "姿勢改善", "腰痛改善", "大会に向けた減量", "体力向上", "産後の体型戻し", "健康維持", "筋力アップ",
];
const cautionsPool = [undefined, undefined, undefined, "膝に既往歴あり", "腰痛持ち、高重量注意", "妊娠中(安定期)", "血圧やや高め"];
const addressAreas = [
  "東京都渋谷区", "東京都世田谷区", "東京都港区", "東京都新宿区", "東京都中野区", "東京都杉並区",
  "神奈川県横浜市", "神奈川県川崎市", "埼玉県さいたま市", "千葉県千葉市", "大阪府大阪市",
];

export const customers: Customer[] = [];
const customerCount = 26;

for (let i = 0; i < customerCount; i++) {
  const gender = pick(rng, ["male", "female"] as const);
  const family = familyNames[i % familyNames.length];
  const given = gender === "male" ? pick(rng, givenNamesMale) : pick(rng, givenNamesFemale);
  const status: CustomerStatus = pickWeighted(rng, [
    ["trial", 12],
    ["active", 66],
    ["paused", 12],
    ["cancelled", 10],
  ]);
  const age = randInt(rng, 22, 62);
  const birthYear = new Date().getFullYear() - age;
  // 体験中の顧客は「最近」申し込んだ想定にする(体験からしばらく経っているのに体験のまま、は不自然なため)
  const createdDaysAgo = status === "trial" ? randInt(rng, 1, 25) : randInt(rng, 20, 720);
  const createdAt = addDays(today, -createdDaysAgo);

  // 入会日(体験→入会の切り替わり日)。一部は「今月入会」になるよう直近の日付を強制する。
  const forceJoinedThisMonth = status === "active" && i % 10 === 0;
  const joinedAt =
    status === "active"
      ? forceJoinedThisMonth
        ? addDays(today, -randInt(rng, 1, 25))
        : createdAt
      : undefined;

  customers.push({
    id: `cust-${i + 1}`,
    organizationId: ORG_ID,
    name: `${family} ${given}`,
    nameKana: undefined,
    birthDate: `${birthYear}-${String(randInt(rng, 1, 12)).padStart(2, "0")}-${String(randInt(rng, 1, 28)).padStart(2, "0")}`,
    gender,
    phone: `090-${randInt(rng, 1000, 9999)}-${randInt(rng, 1000, 9999)}`,
    email: `customer${i + 1}@example.com`,
    address: `${pick(rng, addressAreas)}${randInt(rng, 1, 8)}-${randInt(rng, 1, 20)}-${randInt(rng, 1, 15)}`,
    primaryStaffId: pick(rng, staffIds),
    status,
    goal: pick(rng, goals),
    cautions: pick(rng, cautionsPool),
    memo: undefined,
    createdAt: toISO(createdAt),
    joinedAt: joinedAt ? toISO(joinedAt) : undefined,
  });
}

// ペア参加の紐づけ(デモ用に数組だけ設定)。双方向に設定する。
const pairableCandidates = customers.filter((c) => c.status === "active" || c.status === "trial");
for (let p = 0; p + 1 < pairableCandidates.length && p < 6; p += 7) {
  const a = pairableCandidates[p];
  const b = pairableCandidates[p + 1];
  if (a && b && !a.pairedCustomerId && !b.pairedCustomerId) {
    a.pairedCustomerId = b.id;
    b.pairedCustomerId = a.id;
  }
}

// ---------------------------------------------------------------------------
// 契約
// ---------------------------------------------------------------------------
export const contracts: Contract[] = [];
export const tickets: Ticket[] = [];

customers.forEach((customer, i) => {
  // 体験中の顧客はまだ契約していない
  if (customer.status === "trial") return;

  const plan = pick(rng, planTemplates);
  const startedDaysAgo = randInt(rng, 30, 500);
  const startDate = addDays(today, -startedDaysAgo);
  let contractStatus: ContractStatus;
  if (customer.status === "cancelled") contractStatus = "cancelled";
  else if (customer.status === "paused") contractStatus = "paused";
  else contractStatus = "active";

  // 更新30日前アラートを確実に何件か発生させる(サブスクは自動更新だが、次回請求日の目安として表示する)
  const forceRenewalSoon = i % 6 === 0 && contractStatus === "active";
  const renewalDate =
    plan.planType === "monthly"
      ? forceRenewalSoon
        ? addDays(today, randInt(rng, 3, 28))
        : addDays(today, randInt(rng, 5, 30))
      : undefined;

  const contract: Contract = {
    id: `contract-${i + 1}`,
    organizationId: ORG_ID,
    customerId: customer.id,
    planName: plan.name,
    planType: plan.planType,
    startDate: toDateStr(startDate),
    endDate: contractStatus === "cancelled" ? toDateStr(addDays(today, -randInt(rng, 1, 60))) : undefined,
    renewalDate: renewalDate ? toDateStr(renewalDate) : undefined,
    monthlyFee: plan.planType === "monthly" ? plan.monthlyFee : undefined,
    monthlySessionCount: plan.planType === "monthly" ? plan.monthlySessionCount : undefined,
    status: contractStatus,
  };
  contracts.push(contract);

  if (plan.planType === "ticket" && contractStatus !== "cancelled") {
    // 実際の使用回数はこの時点では未確定(セッション生成後に確定させる)。
    // ここでは購入枚数・購入日・有効期限(プランの有効期間から自動計算)だけ決めておく。
    tickets.push({
      id: `ticket-${i + 1}`,
      organizationId: ORG_ID,
      customerId: customer.id,
      contractId: contract.id,
      name: plan.name,
      purchasedCount: plan.ticketCount ?? 10,
      usedCount: 0,
      purchasedAt: toDateStr(startDate),
      expiresAt: toDateStr(addMonths(startDate, plan.validityMonths ?? 2)),
    });
  }

  if (plan.planType === "monthly" && plan.monthlySessionCount && contractStatus !== "cancelled") {
    // サブスクは「残り回数」を回数券と同じ仕組みで管理する(自動更新のたびに monthlySessionCount が
    // 繰り越し分に加算されるイメージ)。seed時点では軽い繰越(1〜2ヶ月分)だけ積んでおき、
    // 残りは後続のセッション生成(月間回数に応じた実績)で自然に消化させる。
    const carryoverMonths = randInt(rng, 1, 2);
    tickets.push({
      id: `ticket-${i + 1}`,
      organizationId: ORG_ID,
      customerId: customer.id,
      contractId: contract.id,
      name: plan.name,
      purchasedCount: plan.monthlySessionCount * carryoverMonths,
      usedCount: 0,
      purchasedAt: toDateStr(startDate),
      expiresAt: undefined,
    });
  }
});

// ---------------------------------------------------------------------------
// 予約・セッション
// ---------------------------------------------------------------------------
export const appointments: Appointment[] = [];
export const sessions: Session[] = [];

const menus = menuItems.filter((m) => m.category !== "種目").map((m) => m.name);
const exerciseNames = menuItems.filter((m) => m.category === "種目").map((m) => m.name);

let appointmentSeq = 1;
let sessionSeq = 1;

customers.forEach((customer, i) => {
  if (customer.status === "cancelled") return;

  const staffId = customer.primaryStaffId;
  const customerContract = contracts.find((c) => c.customerId === customer.id);
  const isSubscriber = customerContract?.planType === "monthly" && customerContract.monthlySessionCount;

  // 過去の来店履歴(完了済み予約 + セッション記録)。体験中は体験セッション1回のみ。
  // サブスクは月間基本回数に応じて、ちゃんと通っている実績に見合う件数を生成する(残り回数が不自然に
  // 積み上がらないようにするため)。
  const pastCount =
    customer.status === "trial"
      ? 1
      : customer.status === "paused"
        ? randInt(rng, 1, 3)
        : isSubscriber
          ? Math.max(1, customerContract.monthlySessionCount! + randInt(rng, -2, 3))
          : randInt(rng, 2, 9);
  // 最終来店30日以上アラートを何件か確実に発生させる(体験中の顧客は対象外)
  const forceInactive = customer.status !== "trial" && i % 7 === 0;
  const customerCreatedDaysAgo = Math.round((today.getTime() - new Date(customer.createdAt).getTime()) / 86400000);
  const lastVisitDaysAgo =
    customer.status === "trial"
      ? randInt(rng, 0, Math.max(0, Math.min(7, customerCreatedDaysAgo)))
      : forceInactive
        ? randInt(rng, 32, 90)
        : randInt(rng, 1, 20);

  const visitOffsets: number[] = [lastVisitDaysAgo];
  for (let v = 1; v < pastCount; v++) {
    visitOffsets.push(lastVisitDaysAgo + v * (isSubscriber ? randInt(rng, 2, 5) : randInt(rng, 5, 14)));
  }

  // セッション記録未入力アラートを何件か確実に発生させる
  const forceMissingRecord = i % 8 === 3;

  visitOffsets.forEach((offset, idx) => {
    const start = addDays(today, -offset);
    start.setHours(randInt(rng, 9, 19), pick(rng, [0, 30]), 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const appt: Appointment = {
      id: `appt-${appointmentSeq++}`,
      organizationId: ORG_ID,
      customerId: customer.id,
      staffId,
      startAt: toISO(start),
      endAt: toISO(end),
      menu: pick(rng, menus),
      status: "completed",
    };
    appointments.push(appt);

    const skipRecord = forceMissingRecord && idx === 0;
    if (!skipRecord) {
      const exCount = randInt(rng, 2, 4);
      const exercises: SessionExercise[] = Array.from({ length: exCount }).map((_, exIdx) => ({
        id: `sessex-${sessionSeq}-${exIdx}`,
        sessionId: `session-${sessionSeq}`,
        name: pick(rng, exerciseNames),
        weightKg: randInt(rng, 20, 90),
        reps: randInt(rng, 6, 15),
        sets: randInt(rng, 2, 4),
        order: exIdx,
      }));
      sessions.push({
        id: `session-${sessionSeq}`,
        organizationId: ORG_ID,
        customerId: customer.id,
        staffId,
        appointmentId: appt.id,
        date: toDateStr(start),
        condition: pick(rng, ["良好", "やや疲労気味", "腰に違和感あり(軽度)", "絶好調", "睡眠不足気味"]),
        nutritionGuidance: pick(rng, [undefined, "タンパク質摂取を意識", "間食を控えるよう指導", "水分摂取を増やすよう指導"]),
        customerFeedback: pick(rng, ["フォームが安定してきた", "少しきつそうだったが最後までやり切った", "前回より軽く感じると発言", "楽しんで取り組めていた"]),
        cautions: pick(rng, [undefined, undefined, "膝に負担をかけすぎないよう注意"]),
        nextPlan: pick(rng, ["重量を少し上げる", "デッドリフトを追加", "有酸素の時間を増やす", "同メニューを継続"]),
        trainerMemo: pick(rng, [undefined, "モチベーション高め、継続で結果出そう", "次回体組成測定予定"]),
        exercises,
        recordedAt: toISO(addDays(start, 0)),
      });
      sessionSeq++;
    } else {
      sessionSeq++;
    }
  });

  if (customer.status !== "active") return;

  // 今後の予約(次回予約なしアラートを何件か確実に発生させる)
  const forceNoNext = i % 6 === 2;
  if (!forceNoNext) {
    const futureCount = randInt(rng, 1, 3);
    for (let f = 0; f < futureCount; f++) {
      const offset = f === 0 ? randInt(rng, 0, 6) : randInt(rng, 7, 21);
      const start = addDays(today, offset);
      start.setHours(randInt(rng, 9, 19), pick(rng, [0, 30]), 0, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const status: AppointmentStatus = "confirmed";
      appointments.push({
        id: `appt-${appointmentSeq++}`,
        organizationId: ORG_ID,
        customerId: customer.id,
        staffId,
        startAt: toISO(start),
        endAt: toISO(end),
        menu: pick(rng, menus),
        status,
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Googleカレンダー連携(シミュレーション用の外部予定)
// ---------------------------------------------------------------------------
export const googleBusyBlocks: GoogleBusyBlock[] = [];
const externalTitles = ["私用", "通院", "他業務の打ち合わせ", "研修", "セミナー参加"];
let gcalSeq = 1;
for (let d = -2; d <= 13; d++) {
  if (d % 3 !== 0) continue;
  const staffId = pick(rng, staffIds);
  const start = addDays(today, d);
  start.setHours(pick(rng, [9, 12, 14, 17]), pick(rng, [0, 30]), 0, 0);
  const durationMin = pick(rng, [30, 60, 90]);
  const end = new Date(start.getTime() + durationMin * 60000);
  googleBusyBlocks.push({
    id: `gcal-${gcalSeq++}`,
    staffId,
    startAt: toISO(start),
    endAt: toISO(end),
    title: pick(rng, externalTitles),
  });
}

// 回数券の消化数はセッション記録の実績から機械的に算出する(実運用と同じロジック)。
// これにより「セッション数」と「回数券の残り」が必ず整合する。
for (const ticket of tickets) {
  const recordedSessionCount = sessions.filter(
    (s) => s.customerId === ticket.customerId && new Date(s.date) >= new Date(ticket.purchasedAt),
  ).length;
  ticket.usedCount = Math.min(recordedSessionCount, ticket.purchasedCount);
}

// ---------------------------------------------------------------------------
// 身体データ
// ---------------------------------------------------------------------------
export const bodyMetrics: BodyMetric[] = [];
let bmSeq = 1;
customers.forEach((customer) => {
  if (customer.status === "cancelled") return;
  const points = randInt(rng, 4, 7);
  const baseWeight = randFloat(rng, 52, 88, 1);
  const baseFat = randFloat(rng, 15, 30, 1);
  for (let p = points - 1; p >= 0; p--) {
    const measuredAt = addDays(today, -p * 21);
    const trend = (points - 1 - p) * randFloat(rng, 0.2, 0.6, 2);
    const weight = Math.max(40, baseWeight - trend);
    const fat = Math.max(8, baseFat - trend * 0.8);
    bodyMetrics.push({
      id: `bm-${bmSeq++}`,
      customerId: customer.id,
      measuredAt: toDateStr(measuredAt),
      weightKg: Math.round(weight * 10) / 10,
      bodyFatPct: Math.round(fat * 10) / 10,
      bmi: Math.round((weight / 1.65 / 1.65) * 10) / 10,
      waistCm: randFloat(rng, 65, 95, 1),
    });
  }
});

// ---------------------------------------------------------------------------
// 請求・入金
// ---------------------------------------------------------------------------
export const invoices: Invoice[] = [];
let invSeq = 1;
customers.forEach((customer, i) => {
  const contract = contracts.find((c) => c.customerId === customer.id);
  if (!contract || contract.planType !== "monthly" || contract.status === "cancelled") return;

  for (let m = 5; m >= 0; m--) {
    const issuedAt = addDays(today, -m * 30 - 3);
    if (issuedAt < new Date(contract.startDate)) continue;
    const dueAt = addDays(issuedAt, 14);
    let status: Invoice["status"] = "paid";
    let paidAt: string | undefined = toDateStr(addDays(issuedAt, randInt(rng, 1, 10)));

    if (m === 0 && i % 9 === 0) {
      status = "overdue";
      paidAt = undefined;
    } else if (m === 0 && i % 11 === 5) {
      status = "unpaid";
      paidAt = undefined;
    }

    invoices.push({
      id: `invoice-${invSeq++}`,
      organizationId: ORG_ID,
      customerId: customer.id,
      amount: contract.monthlyFee ?? 30000,
      issuedAt: toDateStr(issuedAt),
      dueAt: toDateStr(dueAt),
      paidAt,
      status,
    });
  }
});

// ---------------------------------------------------------------------------
// メッセージ
// ---------------------------------------------------------------------------
export const messages: Message[] = [];
let msgSeq = 1;
customers.forEach((customer, i) => {
  if (i % 3 !== 0) return;
  messages.push({
    id: `msg-${msgSeq++}`,
    organizationId: ORG_ID,
    customerId: customer.id,
    type: pick(rng, ["follow_up", "reminder", "manual"] as const),
    status: "sent",
    body: pick(rng, [
      "本日はありがとうございました!次回もよろしくお願いします。",
      "ご予約の確認のご連絡です。",
      "次回のご予約はいかがでしょうか?お気軽にご連絡ください。",
    ]),
    sentAt: toISO(addDays(today, -randInt(rng, 1, 40))),
  });
});

// ---------------------------------------------------------------------------
// 顧客メモ
// ---------------------------------------------------------------------------
export const customerNotes: CustomerNote[] = [];

// ---------------------------------------------------------------------------
// アラート(要対応)の動的算出
// ---------------------------------------------------------------------------
export function computeAlerts(): AlertNotification[] {
  const alerts: AlertNotification[] = [];
  let seq = 1;

  const activeCustomers = customers.filter((c) => c.status === "active");

  for (const customer of activeCustomers) {
    const customerTickets = tickets.filter((t) => t.customerId === customer.id);
    for (const ticket of customerTickets) {
      const remaining = ticket.purchasedCount - ticket.usedCount;
      const isSubscriptionBalance = contracts.find((c) => c.id === ticket.contractId)?.planType === "monthly";
      if (remaining <= 2 && remaining >= 0) {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "ticket_low",
          message: isSubscriptionBalance
            ? `今月の残りセッション数が${remaining}回です`
            : `回数券の残りが${remaining}回です`,
          severity: remaining === 0 ? "danger" : "warning",
          createdAt: toISO(today),
        });
      }
    }

    const contract = contracts.find((c) => c.customerId === customer.id && c.status === "active");
    if (contract?.renewalDate) {
      const days = Math.round((new Date(contract.renewalDate).getTime() - today.getTime()) / 86400000);
      if (days >= 0 && days <= 30) {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "renewal_due",
          message: `契約更新まで残り${days}日です`,
          severity: days <= 7 ? "danger" : "warning",
          createdAt: toISO(today),
        });
      }
    }

    const future = appointments.filter(
      (a) => a.customerId === customer.id && a.status === "confirmed" && new Date(a.startAt) >= today,
    );
    if (future.length === 0) {
      alerts.push({
        id: `alert-${seq++}`,
        organizationId: ORG_ID,
        customerId: customer.id,
        type: "no_next_appointment",
        message: "次回予約が入っていません",
        severity: "warning",
        createdAt: toISO(today),
      });
    }

    const past = appointments
      .filter((a) => a.customerId === customer.id && a.status === "completed")
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
    if (past.length > 0) {
      const lastVisitDays = Math.round((today.getTime() - new Date(past[0].startAt).getTime()) / 86400000);
      if (lastVisitDays >= 30) {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "inactive",
          message: `最終来店から${lastVisitDays}日経過しています`,
          severity: "danger",
          createdAt: toISO(today),
        });
      }

      const missingRecord = past.find((a) => !sessions.some((s) => s.appointmentId === a.id));
      if (missingRecord) {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "session_not_recorded",
          message: `${toDateStr(new Date(missingRecord.startAt))}のセッション記録が未入力です`,
          severity: "warning",
          createdAt: toISO(today),
        });
      }
    }

    const customerInvoices = invoices.filter((inv) => inv.customerId === customer.id);
    for (const inv of customerInvoices) {
      if (inv.status === "unpaid") {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "unpaid",
          message: `${inv.amount.toLocaleString()}円が未入金です`,
          severity: "warning",
          createdAt: toISO(today),
        });
      } else if (inv.status === "overdue") {
        alerts.push({
          id: `alert-${seq++}`,
          organizationId: ORG_ID,
          customerId: customer.id,
          type: "overdue",
          message: `支払期限を超過しています(${inv.amount.toLocaleString()}円)`,
          severity: "danger",
          createdAt: toISO(today),
        });
      }
    }
  }

  return alerts;
}
