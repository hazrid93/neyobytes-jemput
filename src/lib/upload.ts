import { supabase } from './supabase';

// Upload a file to Supabase Storage
// path format: userId/invitationId/filename
export async function uploadImage(
  file: File,
  userId: string,
  folder: string // e.g., 'cover', 'couple', 'gallery', 'qr'
): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('invitation-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('invitation-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  // Extract path from public URL
  const match = url.match(/invitation-images\/(.+)$/);
  if (!match) return;
  await supabase.storage.from('invitation-images').remove([match[1]]);
}
