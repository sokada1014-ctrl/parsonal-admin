// 全社共通のホバーエフェクト定義。
// 使えるエフェクトは以下の4種類のみ:
//   1. CARD_LIFT       — 一覧/グリッド表示されるカード
//   2. (Buttonコンポーネント内蔵) — ボタン全般。Glow + :active scale
//   3. LINK_UNDERLINE  — 本文中のテキストリンク
//   4. SPOTLIGHT       — 特別に強調する1〜2箇所のみ(過剰使用禁止)
// アニメーションさせるCSSプロパティは transform / opacity / box-shadow に限定する。

// カード(一覧・グリッド表示されるもの)。Lift効果のみ。Scale/Tiltは併用しない。
// shadow-lgの代わりにPrimaryカラーのグローで浮遊感を出す(ライト/ダーク両テーマで自動追従)。
export const CARD_LIFT =
  "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 " +
  "hover:shadow-[0_16px_40px_-14px_rgb(from_var(--primary)_r_g_b_/_0.35)]";

// テキストリンク。Underline reveal のみ(左から伸びる下線)。
// widthではなく scaleX(transform) で実装し、GPUに乗る軽量なアニメーションにする。
// 使い方: 親要素(Linkなど)に "group" を付け、対象テキストに LINK_UNDERLINE を付ける。
export const LINK_UNDERLINE =
  "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left " +
  "after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out " +
  "group-hover:after:scale-x-100";
