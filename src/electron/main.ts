/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, BrowserWindow, ipcMain } from "electron";
import db, { setupDatabase } from "./db/database.js";
import { getPreloadPath } from "./pathResolver.js";

app.on('ready', () => {
  console.log("🛠 Setting up database...");
  setupDatabase(); // ✅ Call the function to initialize the DB
  console.log("✅ Database is ready.");



  const preloadPath = app.getAppPath() + "/dist-electron/preload.cjs";
  console.log(preloadPath);
    const mainWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: false, // ✅ Security best practice
        contextIsolation: true, // ✅ Required for `contextBridge`
        preload: preloadPath,
      },
   
      });

      mainWindow.loadFile(app.getAppPath() + '/dist-react/index.html');
});

// ✅ IPC Handlers for User Session
ipcMain.handle("getUserSession", (event) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM lofi_zone_user LIMIT 1", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle("setUserSession", (event, sessionData) => {
  try {
    // Parse the session data
    const sessionInfo = JSON.parse(sessionData);
    
    if (!sessionInfo || !sessionInfo.user) {
      return Promise.resolve(null);
    }
    
    const { user } = sessionInfo;
    
    return new Promise((resolve, reject) => {
      // Check if user exists
      db.get(
        "SELECT * FROM lofi_zone_user WHERE user_credential_id = ? OR user_uuid = ?", 
        [user.user_credential_id, user.user_uuid], 
        (err, existingUser: any) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (existingUser) {
            // Update existing user
            db.run(
              "UPDATE lofi_zone_user SET user_name = ?, user_profile_pic = ?, last_login = CURRENT_TIMESTAMP WHERE lofi_zone_user_id = ?",
              [user.user_name, user.user_profile_pic || null, existingUser.lofi_zone_user_id],
              (updateErr) => {
                if (updateErr) {
                  reject(updateErr);
                } else {
                  resolve(existingUser);
                }
              }
            );
          } else {
            // Insert new user
            db.run(
              "INSERT INTO lofi_zone_user (user_name, user_credential_id, user_credential_code, user_uuid, user_profile_pic) VALUES (?, ?, ?, ?, ?)",
              [
                user.user_name,
                user.user_credential_id || null,
                user.user_credential_code || null,
                user.user_uuid,
                user.user_profile_pic || null
              ],
              function(insertErr) {
                if (insertErr) {
                  reject(insertErr);
                } else {
                  resolve({
                    id: this.lastID,
                    ...user
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    console.error("Error parsing session data:", error);
    return Promise.reject(error);
  }
});

ipcMain.handle("clearUserSession", (event) => {
  // This doesn't actually delete the user, just clears the session
  console.log("Clearing user session");
  return Promise.resolve(true);
});
