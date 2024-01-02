declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      NEXT_PUBLIC_BUCKET_URL: string;
      NEXT_PUBLIC_BUCKET_NAME: string;
    }
  }
}

export {};
