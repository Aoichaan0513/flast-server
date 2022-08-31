/*
  Warnings:

  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Token` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys= OFF;
CREATE TABLE "new_User"
(
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"      TEXT     NOT NULL,
    "avatar"    TEXT,
    "email"     TEXT     NOT NULL,
    "password"  TEXT     NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "email", "id", "name", "password")
SELECT "avatar", "email", "id", "name", "password"
FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User"
    RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
CREATE TABLE "new_Token"
(
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId"    INTEGER  NOT NULL,
    "token"     TEXT     NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("id", "token")
SELECT "id", "token"
FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token"
    RENAME TO "Token";
PRAGMA foreign_key_check;
PRAGMA foreign_keys= ON;
