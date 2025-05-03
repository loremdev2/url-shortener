import supabase from './supabase';

export async function login({ email, password }: { email: string; password: string }): Promise<void> {
    // Example usage of email and password
    const {data, error}: any=await supabase.auth.signInWithPassword({ email, password });
    if(error) throw new Error(error.message);
    return data;
}