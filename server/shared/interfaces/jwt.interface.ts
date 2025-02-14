export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
