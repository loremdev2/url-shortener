import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { BeatLoader } from "react-spinners";

import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Error from "./error";
import useFetch from "@/hooks/useFetch";        // <— ensure this path matches your file
import { login } from "@/db/apiAuth";
import { UrlState } from "@/context/UrlContext";

interface FormData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const createNew = searchParams.get("createNew");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // ← Use the generic signature so TS knows `fn` exists
  const {
    data: loginData,
    loading,
    error: loginError,
    fn: fnLogin,
  } = useFetch<any>(login);

  const { fetchUser } = UrlState();

  // Mirror server (supabase) errors into our state
  useEffect(() => {
    if (loginError) {
      const msg =
        typeof loginError === "string"
          ? loginError
          : (loginError as Error).message;
      setServerError(msg);
    }
  }, [loginError]);

  // On successful login, refetch user & redirect
  useEffect(() => {
    if (loginData) {
      fetchUser();
      const q = createNew ? `?createNew=${encodeURIComponent(createNew)}` : "";
      navigate(`/dashboard${q}`, { replace: true });
    }
  }, [loginData, createNew, fetchUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setServerError(null);

    try {
      // validate fields
      await schema.validate(formData, { abortEarly: false });

      // attempt login; on failure this throws and we go to catch
      await fnLogin(formData);

      // <-- no navigate here; success-redirect is in the useEffect above
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Yup validation errors
        const errs: Partial<FormData> = {};
        err.inner.forEach((vi: any) => {
          errs[vi.path as keyof FormData] = vi.message;
        });
        setValidationErrors(errs);
      } else {
        // server or unexpected error
        setServerError(err.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <Error message={validationErrors.email} />
                )}
              </div>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                {validationErrors.password && (
                  <Error message={validationErrors.password} />
                )}
              </div>
              {serverError && <Error message={serverError} />}
            </div>
            <CardFooter className="flex justify-end mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <BeatLoader size={10} /> : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
