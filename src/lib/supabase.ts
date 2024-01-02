import { createClient } from "@supabase/supabase-js";
import { env } from "process";

export const client = createClient(process.env.SUPABASE_URL, env.SUPABASE_KEY);

export const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;

export const MODEL_PATHS = "models";

export const ENVIRONTMENTS_PATH = "environtments";
