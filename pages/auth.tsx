
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "react-router-dom"
import Login from "@/components/login";
import Signup from "@/components/signup"

const Auth = () => {

  const [searchParams] = useSearchParams()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:py-16 md:py-20">
      <h3 className="mb-6 text-xl font-semibold text-center">
        {searchParams.get("createNew") ? "Hold up! Let's Login First" : "Login / Signup"}
      </h3>


      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth
