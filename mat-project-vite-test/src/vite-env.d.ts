/// <reference types="vite/client" />

interface ImportMetaEnv {
    // more env variables...
    readonly VITE_MY_BACKEND_API_URL:string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }