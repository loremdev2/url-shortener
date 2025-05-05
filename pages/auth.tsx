
// src/pages/Auth.tsx
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "@/components/login";
import SignUp from "@/components/signup";
import { UrlState } from "@/context/UrlContext";

const AuthPage: React.FC = () => {
  const { isAuthenticated, loading } = UrlState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const longLink = searchParams.get("createNew");

  // redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      <h3 className="mb-6 text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first.."
          : "Login / Signup"}
      </h3>

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login" className="text-center">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-center">
              Signup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex justify-center">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="flex justify-center">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;