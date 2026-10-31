import type { Customer } from "@/lib/types";
import type { Square } from "square";

// Square顧客 → このアプリのCustomer型への変換。
// id/organizationId/primaryStaffId/status など、Square側に存在しない必須項目は呼び出し側で補う。
export function mapSquareCustomerToName(sc: Square.Customer): string {
  const name = [sc.familyName, sc.givenName].filter(Boolean).join(" ").trim();
  return name || sc.companyName || sc.nickname || sc.emailAddress || "Square顧客";
}

export function mapSquareCustomerToAddress(sc: Square.Customer): string | undefined {
  const a = sc.address;
  if (!a) return undefined;
  const parts = [a.administrativeDistrictLevel1, a.locality, a.addressLine1, a.addressLine2].filter(Boolean);
  return parts.length > 0 ? parts.join("") : undefined;
}

export function buildCustomerFromSquare(
  sc: Square.Customer,
  defaults: Pick<Customer, "id" | "organizationId" | "primaryStaffId">,
): Customer {
  return {
    ...defaults,
    name: mapSquareCustomerToName(sc),
    birthDate: sc.birthday ?? undefined,
    phone: sc.phoneNumber ?? undefined,
    email: sc.emailAddress ?? undefined,
    address: mapSquareCustomerToAddress(sc),
    status: "trial",
    memo: sc.note ?? undefined,
    squareCustomerId: sc.id,
    createdAt: sc.createdAt ?? new Date().toISOString(),
  };
}
