-- CreateTable
CREATE TABLE "User"
(
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"       TEXT     NOT NULL,
    "avatar"     TEXT,
    "email"      TEXT     NOT NULL,
    "password"   TEXT     NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Token"
(
    "id"         INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id"    INTEGER  NOT NULL,
    "token"      TEXT     NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
