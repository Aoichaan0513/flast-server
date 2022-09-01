-- RedefineTables
PRAGMA
foreign_keys=OFF;
CREATE TABLE "new_Bookmark"
(
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId"    INTEGER  NOT NULL,
    "title"     TEXT     NOT NULL,
    "url"       TEXT,
    "favicon"   TEXT,
    "folder"    BOOLEAN  NOT NULL DEFAULT false,
    "parentId"  INTEGER,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("createdAt", "favicon", "folder", "id", "parentId", "title", "updatedAt", "url", "userId")
SELECT "createdAt",
       "favicon",
       "folder",
       "id",
       "parentId",
       "title",
       "updatedAt",
       "url",
       "userId"
FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
PRAGMA
foreign_key_check;
PRAGMA
foreign_keys=ON;
