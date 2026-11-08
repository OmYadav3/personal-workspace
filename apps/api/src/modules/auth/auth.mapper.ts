import type { UserLoginResponseDTO, UserResponseDTO } from "./auth.dto.js"

export const AuthMapper = { 

   toUserResponse: (user: UserResponseDTO): UserResponseDTO => {
      return {
         id: user.id,
         name: user.name,
         username: user.username,
         email: user.email,
         status: user.status,
         createdAt: user.createdAt,
      }
   },

 }