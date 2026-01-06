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
  image?: string;
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

// Product types
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  hasMultipleTypes?: boolean;
  types?: string[]; // Array of type names from the typer table
  created_at: string;
};

// Database types for products (Norwegian column names)
export type ProdukterDB = {
  id: string;
  navn: string;
  beskrivelse: string;
  pris: number;
  bilde_url: string;
  kategori: string;
  forskjellige_typer: boolean;
  created_at: string;
};

// Database type for product types
export type TyperDB = {
  id: string;
  produkt_id: string;
  navn: string;
};

// Convert database format to app format for products
export const mapProductFromDB = (
  dbItem: ProdukterDB,
  types?: TyperDB[]
): Product => ({
  id: dbItem.id,
  name: dbItem.navn,
  description: dbItem.beskrivelse,
  price: dbItem.pris,
  image: dbItem.bilde_url,
  category: dbItem.kategori,
  hasMultipleTypes: dbItem.forskjellige_typer,
  types: types?.map(t => t.navn) || [],
  created_at: dbItem.created_at,
});

// Convert app format to database format for products
export const mapProductToDB = (
  item: Partial<Product>,
): Partial<ProdukterDB> => ({
  navn: item.name,
  beskrivelse: item.description,
  pris: item.price,
  bilde_url: item.image,
  kategori: item.category,
  forskjellige_typer: item.hasMultipleTypes || false,
});