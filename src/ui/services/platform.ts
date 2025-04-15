/**
 * Platform detection utility
 * Determines if the application is running in a desktop (Electron) or web environment
 */
export const isElectron = (): boolean => {
  return window.electronAPI !== undefined;
};

export const getPlatformName = (): 'desktop' | 'web' => {
  return isElectron() ? 'desktop' : 'web';
};
