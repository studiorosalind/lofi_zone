import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";

console.log("📂 `database.ts` is being executed...");

// ✅ Define Database Path
const dbPath = path.join(app.getPath("userData"), "lofi_zone.db");
console.log("📂 Database will be stored at:", dbPath);

// ✅ Open SQLite Database (Using `sqlite3`)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to open database:", err.message);
  } else {
    console.log("✅ Database connection established.");
  }
});

// ✅ Define Type for User Data
interface UserRow {
  count: number;
}

// ✅ Function to Initialize the Database
export function setupDatabase() {
  console.log("🛠 Setting up the database...");

  // ✅ Create `lofi_zone_user` Table
  db.run(
    `CREATE TABLE IF NOT EXISTS lofi_zone_user (
      lofi_zone_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      user_profile_pic TEXT,
      user_credential_id TEXT,
      user_credential_code TEXT,
      user_uuid TEXT UNIQUE,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("❌ Failed to create table:", err.message);
      } else {
        console.log("✅ Table `lofi_zone_user` checked/created.");
      }
    }
  );

  // ✅ Check if Dummy User Exists
  db.get<UserRow>("SELECT COUNT(*) as count FROM lofi_zone_user", [], (err, row) => {
    if (err) {
      console.error("❌ Failed to check user count:", err.message);
    } else if (row && row.count === 0) {
      // ✅ Insert Dummy User if None Exist
      const dummyUuid = 'dummy-uuid-' + Math.random().toString(36).substring(2, 15);
      db.run(
        "INSERT INTO lofi_zone_user (user_name, user_credential_id, user_uuid) VALUES (?, ?, ?)",
        ["dummy_user", "dummy@email.com", dummyUuid],
        (insertErr) => {
          if (insertErr) {
            console.error("❌ Failed to insert dummy user:", insertErr.message);
          } else {
            console.log("✅ Dummy user created!");
          }
        }
      );
    } else {
      console.log("✅ User table already populated.");
    }
  });
}

// ✅ Export Database for Access
export default db;
