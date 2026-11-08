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

export interface RegisterUserSessionDTO {
   id: string
   userId: string;
   refreshTokenHash: string;
   tokenFamilyId: string;
   expiresAt: Date;
}

export interface createUserSessionDTO {
   id: string
   userId: string;
   refreshTokenHash: string;
   tokenFamilyId: string;
   expiresAt: Date;
}