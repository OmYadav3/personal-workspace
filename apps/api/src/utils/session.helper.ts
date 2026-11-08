import { randomUUID } from "node:crypto"

/* GENERATE SESSION-ID */
export const generateSessionId = ():string => {
   return randomUUID();
}


/* GENERATE TOKEN-FAMILY-ID */
export const generateTokenFamilyId = ():string => {
   return randomUUID();
}

/* SESSION EXPIREY - 30DAYS */
export const getSessionExpiry = (): Date => {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 30);

  return expiresAt;
};