import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

interface PaymentRecord {
  amount_paid: number;
  paid_on: string;
  tokens_purchased: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  tokens_balance: number;
  free_generations_used: number;
  tokens_expire_on: string;
  payments: PaymentRecord[] | null;
}

interface TokenPurchase {
  user_id: string;
  tokens_purchased: number;
  amount_paid: number;
  purchase_date: string;
}

export async function getFreshUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        avatar_url,
        tokens_balance,
        free_generations_used,
        tokens_expire_on,
        payments
      `)
      .eq('id', userId)
      .single();
    console.log(error)
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching fresh user profile:', error);
    return null;
  }
}

export async function incrementGenerationCount(user: User) {
  try {
    // First get fresh data
    const freshProfile = await getFreshUserProfile(user.id);
    if (!freshProfile) throw new Error('Could not fetch fresh user profile');

    // Then increment using the fresh count
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        free_generations_used: (freshProfile.free_generations_used || 0) + 1
      })
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

export async function getUserGenerationInfo(user: User) {
  try {
    const freshProfile = await getFreshUserProfile(user.id);
    if (!freshProfile) throw new Error('Could not fetch fresh user profile');

    return {
      free_generations_used: freshProfile.free_generations_used || 0,
      tokens_balance: freshProfile.tokens_balance || 0,
      tokens_expire_on: freshProfile.tokens_expire_on
    };
  } catch (error) {
    console.error('Error fetching user generation info:', error);
    throw error;
  }
}

export async function decrementTokenBalance(userId: string) {
  try {
    const freshProfile = await getFreshUserProfile(userId);
    if (!freshProfile) throw new Error('Could not fetch user profile');

    if (freshProfile.free_generations_used < 5) {
      // Use free generation first
      return await incrementGenerationCount({ id: userId } as User);
    } else if (freshProfile.tokens_balance > 0) {
      // Use paid token
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          tokens_balance: freshProfile.tokens_balance - 1 
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    
    throw new Error('No available tokens');
  } catch (error) {
    console.error('Error decrementing token balance:', error);
    throw error;
  }
}
