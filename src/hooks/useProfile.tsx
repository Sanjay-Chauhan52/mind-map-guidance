import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  current_class: string;
  language_preference: string;
  city: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useProfile useEffect triggered");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        console.log("No user session, setting loading to false");
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      console.log("Profile fetch result:", { data, error });

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        console.log("Setting profile data:", data);
        setProfile(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setProfile(null);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    profile,
    loading,
    signOut,
    hasProfile: !!profile,
    isAuthenticated: !!user,
  };
};