import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import useFetch from "@/hooks/useFetch";
import { getCurrentUser } from "@/db/apiAuth";
import type { User } from "@supabase/supabase-js";

export interface UrlContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => void;
}

export const UrlContext = createContext<UrlContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  fetchUser: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const fetchCurrentUser = useCallback(async () => {
    const result = await getCurrentUser();
    if (!result) throw new Error("User not authenticated");
    return result;
  }, []);
  // Trigger initial load
  useEffect(() => {
    fetchUser();
  }, []);
  const { data: user, loading, fn: fetchUser } = useFetch<User>(
    fetchCurrentUser
  );



  const isAuthenticated = user?.role === "authenticated";

  return (
    <UrlContext.Provider value={{ user, loading, isAuthenticated, fetchUser }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => useContext(UrlContext);
