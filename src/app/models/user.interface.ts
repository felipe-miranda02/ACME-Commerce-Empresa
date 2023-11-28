// LOGIN
export interface UserForAuthenticationDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
  id?: string;
  name?: string;
  email: string;
}

// FORGOT PASSWORD
export interface ForgotPasswordDto {
  email: string;
  clientURI: string;
}

// RESET PASSWORD
export interface ResetPasswordDto {
  password: string;
  confirmPassword: string;
  email: string;
  token: string;
}

// DIRECCIONES DE EMPRESA (PICK UPS)
export interface PickUpCenterDto {
  id?: number;
  nombre: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
}
