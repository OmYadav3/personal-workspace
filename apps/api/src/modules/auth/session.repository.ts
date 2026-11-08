import { prisma } from "../../lib/prsima.js";
import type { createSessionDTO } from "./auth.dto.js";

export const SessionRepository = {
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
   }

};
