import electron, { ipcRenderer } from "electron";


electron.contextBridge.exposeInMainWorld("electronAPI", {
  getUserSession: () => ipcRenderer.invoke("getUserSession"),
  setUserSession: (username: string) => ipcRenderer.invoke("setUserSession", username),
});
