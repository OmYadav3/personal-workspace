// DTO - Data Transfer Object

/* Controller → Service */
export interface RegisterUserDTO {
   name: string;
   username: string;
   email: string;
   password: string;
}

/* Service → Repository */
export interface createUserDTO {
   name: string;
   username: string;
   email: string;
   passwordHash: string;
}

/* Mapper → Controller/API response */
export interface UserResponseDTO {
   id: string;
   name: string;
   username: string;
   email: string;
   status: string;
   createdAt: Date;
}

/* Service → Repository */
export interface loginUserDTO {
   username: string;
   password: string;
   deviceInfo?: string;
}

export interface UserLoginResponseDTO {
   id: string;
   name: string;
   username: string;
   email: string;
   status: string;
   refreshToken: string;
   accessToken: string;
   createdAt: Date;
}

export interface createSessionDTO {
   id: string;
   userId: string;
   refreshTokenHash: string;
   tokenFamilyId: string;
   deviceInfo?: string | undefined;
   expiresAt: Date;
}

export interface UserLoggedOutDTO {
   refreshToken: string;
   sessionId: string;
   userId: string;
}

/* Service → Repository */
export interface UserLoggedOutSesionDTO {
   sessionId: string;
   userId: string;
   tokenFamilyId: string;
}

/* Service → Repository */
export interface UserLoggedOutAllSesionDTO {
   userId: string;
}
