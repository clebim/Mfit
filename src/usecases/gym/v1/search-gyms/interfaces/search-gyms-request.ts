export interface SearchGymsRequest {
  title: string
  userId: string
  page?: number
  totalItemsPerPage?: number
  order?: 'ASC' | 'DESC'
  orderBy?: string
}
