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

ipcMain.handle("setUserSession", (event, username) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM lofi_zone_user WHERE username = ?", [username], (err, user) => {
      if (err) {
        reject(err);
      } else if (user) {
        db.run("UPDATE lofi_zone_user SET last_login = CURRENT_TIMESTAMP WHERE username = ?", [username], (updateErr) => {
          if (updateErr) {
            reject(updateErr);
          } else {
            resolve(user);
          }
        });
      } else {
        resolve(null);
      }
    });
  });
});
