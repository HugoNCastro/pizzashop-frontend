import { api } from "@/lib/axios";

export interface RegisterRestaurantBody {
  restaurantName: string
  email: string
  managerName: string
  phone: string
}

export async function registerRestaurant({
  email,
  managerName,
  phone,
  restaurantName
}: RegisterRestaurantBody) {
  await api.post('/restaurants', {
    email,
    managerName,
    phone,
    restaurantName
  })
}