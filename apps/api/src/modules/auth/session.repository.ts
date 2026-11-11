import { prisma } from "../../lib/prsima.js";
import type { createSessionDTO, refreshTokenSessionDTO, UserLoggedOutAllSesionDTO, UserLoggedOutSesionDTO } from "./auth.dto.js";

export const SessionRepository = {
   findSession: async (sessionId: string, userId: string) => {
      const session = await prisma.session.findUnique({
         where: { id: sessionId, userId },
         select: {
            id: true,
            userId: true,
            refreshTokenHash: true,
            tokenFamilyId: true,
            deviceInfo: true,
            expiresAt: true,
            revokedAt: true 
         }
      });

      return session;
   },
   findSessionById: async (sessionId: string) => {
      const session = await prisma.session.findUnique({
         where: { id: sessionId },
         select: {
            id: true,
            userId: true,
            refreshTokenHash: true,
            tokenFamilyId: true,
            deviceInfo: true,
            expiresAt: true,
            revokedAt: true 
         }
      });

      return session;
   },

   createSession: async (data: createSessionDTO) => {
      const session = await prisma.session.create({
         data: {
            id: data.id,
            userId: data.userId,
            refreshTokenHash: data.refreshTokenHash,
            tokenFamilyId: data.tokenFamilyId,
            deviceInfo: data.deviceInfo || null,
            expiresAt: data.expiresAt,
         }
      })

      return session;
   },

   revokeSession: async (data: UserLoggedOutSesionDTO) => {
      return prisma.session.updateMany(
         {
            where: {
               id: data.sessionId,
               userId: data.userId,
               tokenFamilyId: data.tokenFamilyId,
               revokedAt: null
            },
            data: {
               revokedAt: new Date(),
            }
         }
      )
   },

   revokeAllSession: async (data: UserLoggedOutAllSesionDTO) => {
      return prisma.session.updateMany(
         {
            where: {
               userId: data.userId,
               revokedAt: null
            },
            data: {
               revokedAt: new Date(),
            }
         }
      )
   },

   SessionUpdate: async (data: refreshTokenSessionDTO) => {
      const result =  await prisma.session.updateMany({
         where: {
            id: data.sessionId,
            userId: data.userId,
            refreshTokenHash: data.oldRefreshTokenHash,
            revokedAt: null,
         },
         data: {
            refreshTokenHash: data.refreshTokenHash
         }
      });

      return result.count === 1; // that means session succesfully updated 
   }
};
