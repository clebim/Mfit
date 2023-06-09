export interface FetchUserCheckInsHistoryRequest {
  userId: string
  startDate?: Date
  endDate?: Date
  page?: number
  totalItemsPerPage?: number
  order?: 'ASC' | 'DESC'
  orderBy?: string
}
