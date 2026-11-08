import { ApiError } from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/auth.helper.js";
// import { generateAccessTokentest } from "../../utils/jwt.helper.js";
import type { RegisterUserDTO } from "./auth.dto.js";
import { AuthMapper } from "./auth.mapper.js";
import { AuthRepository } from "./auth.repository.js";

export const AuthService = {
   registerUser: async (data: RegisterUserDTO) => {
      const { name, username, email, password } = data;
      
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



   
};
