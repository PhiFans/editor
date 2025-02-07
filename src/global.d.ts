/// <reference types="vite/client" />

declare global {
  interface Window {
    webkitAudioContext: AudioContext,
  }

  // Alias
  interface File {
    mozSlice: Blob.slice,
    webkitSlice: Blob.slice,
  }
}
