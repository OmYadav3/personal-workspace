import type { loginUserDTO, RegisterUserDTO } from "./auth.dto.js";

import { AuthRepository } from "./auth.repository.js";
import { hashPassword, verifyPassword } from "../../utils/auth.helper.js";
import { AuthMapper } from "./auth.mapper.js";

import { ApiError } from "../../utils/ApiError.js";
import { SessionRepository } from "./session.repository.js";
import {
   generateSessionId,
   generateTokenFamilyId,
   getSessionExpiry,
} from "../../utils/session.helper.js";
import { generateAccessToken, generateRefreshToken, HashToken } from "../../utils/jwt.helper.js";

export const AuthService = {
   registerUser: async (data: RegisterUserDTO) => {
      const { name, username, email, password } = data;
      console.log(username);
      const isUsernameExist = await AuthRepository.findUserByUsername(username);
      if (isUsernameExist) {
         throw new ApiError(409, "Username Already Exists");
      }

      const isEmailExists = await AuthRepository.findUserByEmail(email);
      if (isEmailExists) {
         throw new ApiError(409, "Email already Exists ");
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await AuthRepository.createUser({
         name,
         username,
         email,
         passwordHash: hashedPassword,
      });

      return AuthMapper.toUserResponse(newUser);
   },

   loginUser: async (data: loginUserDTO, deviceInfo?: string) => {
      const { username, password } = data;

      const user = await AuthRepository.findUserByUsername(username);
      if (!user) {
         throw new ApiError(401, "InValid Credentials");
      }

      const matchPassword = await verifyPassword(user.passwordHash, password);
      if (!matchPassword) {
         throw new ApiError(401, "InValid Credentials");
      }

      if (user.status !== "ACTIVE") {
         throw new ApiError(403, "Account is not active");
      }

      // if (user.emailVerifiedAt === null || undefined ) {
      //    throw new ApiError(403, "You Email is not Verified!")
      // }

      const userId = user.id;
      const sessionId = generateSessionId();
      const tokenFamilyId = generateTokenFamilyId();
      const expiresAt = getSessionExpiry();

      const accessToken = generateAccessToken(userId, sessionId);
      const refreshToken = generateRefreshToken(userId, sessionId, tokenFamilyId);

      const refreshTokenHash = HashToken(refreshToken);

      const session = await SessionRepository.createSession({
         id: sessionId,
         userId,
         refreshTokenHash,
         tokenFamilyId,
         deviceInfo,
         expiresAt,
      });

      if (session) {
         return {
            user: AuthMapper.toUserResponse(user),
            accessToken,
            refreshToken: refreshTokenHash,
         };
      } else {
         console.log("Session not Created yet! Please Try Again ");
      }
   },
};
