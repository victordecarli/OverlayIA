import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export const FREE_GENERATIONS_LIMIT = 2;

interface UserProfile {
  id: string;
  email: string;
  avatar_url: string;
  expires_at: string | null;
  free_generations_used: number;
  generations_count: number;
}

export async function getFreshUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, avatar_url, expires_at, free_generations_used, generations_count')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function checkProAccess(userId: string): Promise<boolean> {
  try {
    const profile = await getFreshUserProfile(userId);
    if (!profile?.expires_at) return false;

    const expiryDate = new Date(profile.expires_at);
    const currentDate = new Date();
    
    return currentDate <= expiryDate;
  } catch (error) {
    console.error('Error checking pro access:', error);
    return false;
  }
}

// Keep track of free generations for non-pro users
export async function incrementGenerationCount(user: User) {
  try {
    const profile = await getFreshUserProfile(user.id);
    if (!profile) throw new Error('Could not fetch user profile');

    const isPro = await checkProAccess(user.id);
    
    // If not pro, check free limit
    if (!isPro && profile.free_generations_used >= FREE_GENERATIONS_LIMIT) {
      throw new Error('Free generations limit reached');
    }

    const updateData = isPro
      ? { generations_count: (profile.generations_count || 0) + 1 }
      : {
          generations_count: (profile.generations_count || 0) + 1,
          free_generations_used: (profile.free_generations_used || 0) + 1
        };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    throw error;
  }
}
