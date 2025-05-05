// src/db/apiUrls.ts
import supabase from "./supabase";

export async function getUrls(user_id: string): Promise<Array<{
  id: string;
  title: string;
  short_url: string;
  user_id: string;
}>> {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error("getUrls error:", error.message);
    throw new Error("Unable to load URLs");
  }
  return data;
}
