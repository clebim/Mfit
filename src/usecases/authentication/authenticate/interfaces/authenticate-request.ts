export interface AuthenticateRequest {
  email: string
  password: string
  clientId: 'MOBILE' | 'WEB'
}
