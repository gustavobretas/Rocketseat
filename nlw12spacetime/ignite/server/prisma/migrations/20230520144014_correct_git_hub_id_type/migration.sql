/*
  Warnings:

  - You are about to alter the column `gitHubId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gitHubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL
);
INSERT INTO "new_User" ("avatarUrl", "gitHubId", "id", "login", "name") SELECT "avatarUrl", "gitHubId", "id", "login", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_gitHubId_key" ON "User"("gitHubId");
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
