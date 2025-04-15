/* eslint-disable @typescript-eslint/no-explicit-any */
// YouTube IFrame API types
declare namespace YT {
  class Player {
    constructor(
      elementId: string | HTMLElement,
      options: {
        videoId?: string
        width?: number | string
        height?: number | string
        playerVars?: {
          autoplay?: 0 | 1
          controls?: 0 | 1
          showinfo?: 0 | 1
          rel?: 0 | 1
          iv_load_policy?: 1 | 3
          [key: string]: any
        }
        events?: {
          onReady?: (event: { target: Player }) => void
          onStateChange?: (event: { data: number }) => void
          onError?: (event: { data: number }) => void
          [key: string]: any
        }
      },
    )

    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead?: boolean): void
    setVolume(volume: number): void
    getVolume(): number
    mute(): void
    unMute(): void
    isMuted(): boolean
    destroy(): void
    getPlayerState(): number
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

interface Window {
  YT: typeof YT
  onYouTubeIframeAPIReady: () => void
  electronAPI: {
    getUserSession: () => Promise<any>;
    setUserSession: (sessionData: string) => Promise<any>;
    clearUserSession: () => Promise<boolean>;
    getPlatformInfo: () => {
      isElectron: boolean;
      platform: string;
      version: string;
    };
  }
}
