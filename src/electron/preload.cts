import electron, { ipcRenderer } from "electron";

electron.contextBridge.exposeInMainWorld("electronAPI", {
  // User session methods
  getUserSession: () => ipcRenderer.invoke("getUserSession"),
  setUserSession: (sessionData: string) => ipcRenderer.invoke("setUserSession", sessionData),
  clearUserSession: () => ipcRenderer.invoke("clearUserSession"),
  
  // Platform detection
  getPlatformInfo: () => ({
    isElectron: true,
    platform: process.platform,
    version: process.versions.electron
  })
});
