export type FindManyOptions = {
  skip?: number
  take?: number
  order?: 'ASC' | 'DESC'
  orderBy?: string
}

export type FindManyRepositoryResponse = {
  count: number
}
