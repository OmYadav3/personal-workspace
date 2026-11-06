import { prisma } from "../../lib/prsima.js"

interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

export const AuthRepository = {
   findUserByUsername: async (username: string) => {
      const user = await prisma.user.findUnique(
         {
            where: { username }
         }
      )

      return user;
   },


   findUserByEmail: async (email: string) => {
      const user = await prisma.user.findUnique(
         {
            where: { email }
         }
      )

      return user;
   },


   createUser: async (data:CreateUserInput) => {
      const user = await prisma.user.create(
         {
            data: {
               name: data.name,
               username: data.username,
               email: data.email,
               passwordHash: data.passwordHash 
            }
         }
      )

      return user;
   },


}

