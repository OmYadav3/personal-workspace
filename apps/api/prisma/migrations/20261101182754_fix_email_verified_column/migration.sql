/*
  Warnings:

  - You are about to drop the column `email_verfied_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verfied_at",
ADD COLUMN     "email_verified_at" TIMESTAMP(3);
