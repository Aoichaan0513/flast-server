-- CreateTable
CREATE TABLE "Bookmark"
(
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId"    INTEGER  NOT NULL,
    "title"     TEXT     NOT NULL,
    "url"       TEXT     NOT NULL,
    "favicon"   TEXT,
    "isFolder"  BOOLEAN  NOT NULL,
    "parentId"  INTEGER,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
