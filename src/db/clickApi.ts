// src/db/clickApi.ts
import supabase from "./supabase";

export async function getClicksForUrls(
  urlIds: string[]
): Promise<Array<{
  id: string;
  url_id: string;
  timestamp: string;
}>> {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("getClicksForUrls error:", error.message);
    throw new Error("Unable to load clicks");
  }
  return data;
}
