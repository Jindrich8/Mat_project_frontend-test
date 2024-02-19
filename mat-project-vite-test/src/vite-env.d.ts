/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SANCTUM_API_URL: string
    readonly VITE_SANCTUM_CSRF_COOKIE_ROUTE:string
    readonly VITE_SIGN_IN_ROUTE:string
    readonly VITE_SIGN_OUT_ROUTE:string
    readonly VITE_USER_OBJECT_ROUTE:string
    readonly VITE_TWO_FACTOR_CHANNLANGE_ROUTE:string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }