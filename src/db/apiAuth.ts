// src/db/apiAuth.ts
import supabase from "./supabase";
import { supabaseUrl } from "./supabase";
import type { User } from "@supabase/supabase-js";
export async function login({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    console.log(data);
    if (error) throw new Error(error.message);
    return data;
}

export async function getCurrentUser(): Promise<User | null> {
    // getSession returns { data: { session }, error }
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Session error:", error.message);
        throw new Error(error.message);
    }

    // No active session
    if (!data.session) {
        return null;
    }

    return data.session?.user;
}


export async function signUp({username, email, password, profile_pic}: any){
    const fileName= `dp-${username.split(" ").join("-")}-${Math.random()}`;
    const {error: storageError}= await supabase
                                         .storage
                                         .from("profile-pic").upload(fileName, profile_pic);
    if(storageError) throw new Error(storageError.message);
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            data: {
                username,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/profile-pic/${fileName}`
            }
        }
    })
    if(error) throw new Error(error.message);
    return data;
}