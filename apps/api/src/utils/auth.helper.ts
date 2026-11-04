import argon2 from 'argon2';


/* HASHING PASSWORD - NEVER STORE PLAINTEXT PASSWORDS */
export const hashPassword = (password: string): Promise<string> => {
   return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456, // 19 MB
      timeCost: 2, // Number of iterations
      parallelism: 1, // Number of threads
   });
};


/* VERIFYING PASSWORD - NEVER STORE PLAINTEXT PASSWORDS */
export const verifyPassword = (DBPassowrd: string, hashPassowrd: string): Promise<boolean> => {
   return argon2.verify(DBPassowrd, hashPassowrd);
}