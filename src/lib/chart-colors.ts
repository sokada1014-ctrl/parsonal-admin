"use client";

import { useTheme } from "next-themes";

// SVGチャート(recharts)は CSS カスタムプロパティを確実に解釈できないため、
// globals.css のトークンと同じ値をライト/ダークそれぞれ複製して参照する。
const lightColors = {
  primary: "#249586",
  border: "#e1e8e3",
  textMuted: "#8d958f",
  surface: "#ffffff",
  textPrimary: "#16201c",
  tooltipShadow: "0 8px 24px -8px rgba(22,32,28,0.12)",
};

const darkColors = {
  primary: "#249586",
  border: "#212b27",
  textMuted: "#99a39d",
  surface: "#161e1b",
  textPrimary: "#eef2f0",
  tooltipShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
};

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? darkColors : lightColors;
}
