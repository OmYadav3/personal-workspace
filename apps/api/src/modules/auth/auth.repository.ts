import { prisma } from "../../lib/prsima.js";
import type { createUserDTO } from "./auth.dto.js";

export const AuthRepository = {
   findUserById: async (userId: string) => {
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: {
            id: true,
            name: true,
            username: true,
            email: true,
            emailVerifiedAt: true,
            status: true,
            createdAt: true,
         },
      });

      return user;
   },
   findUserByUsername: async (username: string) => {
      const user = await prisma.user.findUnique({
         where: { username },
      });

      return user;
   },

   findUserByEmail: async (email: string) => {
      const user = await prisma.user.findUnique({
         where: { email },
      });

      return user;
   },

   createUser: async (data: createUserDTO) => {
      const user = await prisma.user.create({
         data: {
            name: data.name,
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
         },
         select: {
            id: true,
            name: true,
            username: true,
            email: true,
            emailVerifiedAt: true,
            status: true,
            createdAt: true,
         },
      });

      return user;
   }


};
