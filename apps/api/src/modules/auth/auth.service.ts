import { ApiError } from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import { AuthRepository } from "./auth.repository.js"
import type { registeruserDTO } from "./auth.schema.js";

export const AuthService = {
   registerUser: async (data: registeruserDTO) => {

      const {name, username, email, password} = data.body;

      const isUsernameExist = await AuthRepository.findUserByUsername(username);
      if (isUsernameExist) {
         throw new ApiError(409, "Username Already Exists")
      }

      const isEmailExists = await AuthRepository.findUserByEmail(email)
      if (isEmailExists) {
         throw new ApiError(409, "Email already Exists ")
      }

      const HashedPassword = await hashPassword(password);

      const newUser = await AuthRepository.createUser(
         {
            name,
            username,
            email,
            passwordHash: HashedPassword,
         }
      )

      return newUser;
      
   }
}