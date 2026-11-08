import type { SignOptions, Algorithm, VerifyOptions } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js"

/* MENTIONS THE INTERFACE FOR REFRESH TOKEN PAYLOAD */
interface RefreshTokenPayload {
   sub: string; 
   sid: string;
   fid: string; 
}

/* MENTIONS THE INTERFACE FOR ACCESS TOKEN PAYLOAD */
interface AccessTokenPayload {
   sub: string; 
   sid: string;
}

/* MENTIONS THE OPTIONS FOR REFRESH TOKEN */
const RefreshTokenOptions: SignOptions = {
   expiresIn: config.REFRESH_TOKEN_EXPIRATION as NonNullable<SignOptions["expiresIn"]>,
   algorithm: config.REFRESH_TOKEN_ALGORITHM as SignOptions['algorithm'] 
}

/* MENTIONS THE OPTIONS FOR ACCESS TOKEN */
const AccessTokenOptions: SignOptions = {
   expiresIn: config.ACCESS_TOKEN_EXPIRATION as NonNullable<SignOptions["expiresIn"]>,
   algorithm: config.ACCESS_TOKEN_ALGORITHM as SignOptions['algorithm'] 
}

/* MENTIONS THE OPTIONS FOR REFRESH TOKEN VERIFICATION */
const RefreshTokenVerifyOptions: VerifyOptions = {
  algorithms: [
    config.REFRESH_TOKEN_ALGORITHM as Algorithm,
  ],
};

/* MENTIONS THE OPTIONS FOR ACCESS TOKEN VERIFICATION */
const AccessTokenVerifyOptions: VerifyOptions = {
  algorithms: [
    config.ACCESS_TOKEN_ALGORITHM as Algorithm,
  ],
};


/* GENERATES A REFRESH TOKEN */
export const generateRefreshToken = (userId: string, sessionId: string, familyTokenId: string): string => {  
  const payload: RefreshTokenPayload = {
         sub: userId,
         sid: sessionId,
         fid: familyTokenId 
      }
   return jwt.sign(
      payload, 
      config.REFRESH_TOKEN_SECRET, 
      RefreshTokenOptions
   );
}



/* GENERATES AN ACCESS TOKEN */
export const generateAccessToken = (userId: string, sessionId: string) => {
   const payload: AccessTokenPayload = {
      sub: userId,
      sid: sessionId
   }
   return jwt.sign(
      payload, 
      config.ACCESS_TOKEN_SECRET, 
      AccessTokenOptions
   );
}


/* VERIFIES A REFRESH TOKEN */
export const verifyRefreshToken = (token: string) => {
   return jwt.verify(
      token,
      config.REFRESH_TOKEN_SECRET,
      RefreshTokenVerifyOptions 

   );
}


/* VERIFIES AN ACCESS TOKEN */
export const verifyAccessToken = (token: string) => {
   return jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET, 
      AccessTokenVerifyOptions
   );
} 