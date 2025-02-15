import { api } from "@/lib/axios";

export interface GetMonthRevenuetResponse {
  receipt: number;
  diffFromLastMonth: number;
}

export async function getMonthRevenue() {
  const response = await api.get<GetMonthRevenuetResponse>('/metrics/month-receipt');

  return response.data
}