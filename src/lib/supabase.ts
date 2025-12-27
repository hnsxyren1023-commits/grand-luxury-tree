
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://dgrfnaibrkctelagzuff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncmZuYWlicmtjdGVsYWd6dWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzc1MjIsImV4cCI6MjA4MTgxMzUyMn0.kCQGHhPR9T5g4ltM9_oxEtAwliEX-PaqgERKrec4_5A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createCapsule(photos: string[], message: string, musicId: string, isPremium: boolean = false) {
  const { data, error } = await supabase
    .from('capsules')
    .insert([
      { photos, message, music_id: musicId, is_premium: isPremium },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCapsule(id: string) {
  const { data, error } = await supabase
    .from('capsules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function uploadPhoto(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('capsule-photos')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('capsule-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}
