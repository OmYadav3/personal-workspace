import z from "zod";

export const registerUserSchema = z
   .object({
      body: z.object({
         name: z
            .string()
            .trim()
            .min(3, "name must contain at least 6 characters")
            .max(25, "name cannot exceed 25 characters"),
         username: z
            .string()
            .trim()
            .min(3, "Username must contain at least 6 characters")
            .max(25, "Username cannot exceed 25 characters"),
            // .transform((value:String) => (value.toLowerCase)),

         email: z.email("Please provide a valid email address").trim(),
         password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(15, "Password cannot exceed 15 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
            .regex(/^\S+$/, "Password cannot contain spaces"),
      }),
      params: z.object({}),
      query: z.object({}),
   })
   .strict();

   
export const loginUserSchema = z
   .object({
      body: z.object({
         username: z
            .string()
            .trim()
            .min(3, "Username must contain at least 6 characters")
            .max(25, "Username cannot exceed 25 characters"),
            // .transform((value:string) => value.toLowerCase()),

         password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(15, "Password cannot exceed 15 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
            .regex(/^\S+$/, "Password cannot contain spaces"),
      }),
      params: z.object({}),
      query: z.object({}),
   })
   .strict();

export const logOutUserSchema = z
   .object({
      body: z.object({
         refreshToken: z
            .string()
            .trim()
      }),
      params: z.object({}),
      query: z.object({}),
   })
   .strict();
