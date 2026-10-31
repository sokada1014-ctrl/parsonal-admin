import { SquareClient, SquareEnvironment } from "square";

// SQUARE_ACCESS_TOKEN が未設定の間は null を返す(連携UI側で「未設定」状態として表示する)。
export function getSquareClient(): SquareClient | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;

  const environment =
    process.env.SQUARE_ENVIRONMENT === "production" ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

  return new SquareClient({ token, environment });
}

export function isSquareConfigured(): boolean {
  return Boolean(process.env.SQUARE_ACCESS_TOKEN);
}
