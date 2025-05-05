import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import ClipLoader from "react-spinners/ClipLoader"
import Error from "./error"
import * as Yup from "yup"
import useFetch from "@/hooks/useFetch"
import { signUp as signUpApi } from "../db/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"

interface SignUpFormValues {
  username: string
  email: string
  password: string
  profile_pic: File | null
}

type FieldErrors = Partial<Record<keyof SignUpFormValues, string>>

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  profile_pic: Yup.mixed().required("Profile picture is required"),
})

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectParam = searchParams.get("createNew")

  const [formValues, setFormValues] = useState<SignUpFormValues>({
    username: "",
    email: "",
    password: "",
    profile_pic: null
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [showSnack, setShowSnack] = useState(false)

  const {
    data: signUpData,
    loading: isSigningUp,
    error: signUpError,
    fn: executeSignUp
  } = useFetch(signUpApi)

  // Mirror server errors
  useEffect(() => {
    if (signUpError) {
      const msg = typeof signUpError === "string"
        ? signUpError
        : (signUpError as Error).message
      setServerError(msg)
    }
  }, [signUpError])

  // On successful signup, show snackbar then redirect
  useEffect(() => {
    if (signUpData) {
      setShowSnack(true)
      const timeout = setTimeout(() => {
        let path = "/dashboard"
        if (redirectParam) {
          path += `?createNew=${encodeURIComponent(redirectParam)}`
        }
        navigate(path, { replace: true })
      }, 2500)

      return () => clearTimeout(timeout)
    }
  }, [signUpData, redirectParam, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: files && files.length ? files[0] : value
    } as SignUpFormValues))
    setServerError(null)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setServerError(null)

    try {
      await schema.validate(formValues, { abortEarly: false })
      await executeSignUp(formValues)
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const errs: FieldErrors = {}
        err.inner.forEach((vi: any) => {
          errs[vi.path as keyof SignUpFormValues] = vi.message
        })
        setFieldErrors(errs)
      }
    }
  }

  return (
    <>
      {/* Snackbar */}
      {showSnack && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Account created successfully!
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} noValidate>
              <div className="grid w-full items-center gap-4">
                {/* Username */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Please Enter First name and Last name"
                    value={formValues.username}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.username && (
                    <Error message={fieldErrors.username!} />
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={formValues.email}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.email && (
                    <Error message={fieldErrors.email!} />
                  )}
                </div>
                {/* Password */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formValues.password}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.password && (
                    <Error message={fieldErrors.password!} />
                  )}
                </div>
                {/* Profile Picture */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="profile_pic">Profile Picture</Label>
                  <Input
                    id="profile_pic"
                    name="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {fieldErrors.profile_pic && (
                    <Error message={fieldErrors.profile_pic!} />
                  )}
                </div>
              </div>

              {serverError && (
                <div className="mt-4">
                  <Error message={serverError} />
                </div>
              )}

              <CardFooter className="flex justify-end mt-4">
                <Button type="submit" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <ClipLoader size={15} color="#fff" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default SignUp
