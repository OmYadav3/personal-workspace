import { prisma } from "../../lib/prsima.js";
import type { createUserDTO, createUserSessionDTO } from "./auth.dto.js";

export const AuthRepository = {
   findUserById: async (id: string) => {
      const user = await prisma.user.findUnique({
         where: { id },
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
   },
   createUserSession: async (data: createUserSessionDTO) => {
      const session = await prisma.session.create({
         data: {
            id: data.id,
            userId: data.userId,
            refreshTokenHash: data.refreshTokenHash,
            tokenFamilyId: data.tokenFamilyId,
            expiresAt: data.expiresAt,
         },
         select: {
            id: true,
            userId: true,
            refreshTokenHash: true,
            tokenFamilyId: true,
            expiresAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      return session;
   },
};
