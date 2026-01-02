import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from '../assets/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  bilde_url: string;
};

// Database types (Norwegian column names)
export type NyheterDB = {
  id: string;
  overskrift: string;
  beskrivelse: string;
  created_at: string;
  bilde_url: string;
};

// Convert database format to app format
export const mapNyhetFromDB = (
  dbItem: NyheterDB,
): NewsItem => ({
  id: dbItem.id,
  title: dbItem.overskrift,
  content: dbItem.beskrivelse,
  created_at: dbItem.created_at,
  image: dbItem.bilde_url,
});

// Convert app format to database format
export const mapNyhetToDB = (
  item: Partial<NewsItem>,
): Partial<NyheterDB> => ({
  overskrift: item.title,
  beskrivelse: item.content,
  bilde_url: item.image,
});