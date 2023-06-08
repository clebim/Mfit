export interface CreateGymRequest {
  userId: string
  title: string
  description?: string
  phone: string
  latitude: number
  longitude: number
}
