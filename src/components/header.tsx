import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LinkIcon, LogOut as LogOutIcon } from 'lucide-react'
import { UrlState } from '@/context/UrlContext'
import useFetch from '@/hooks/useFetch'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
  const navigate = useNavigate()
  const { user, fetchUser } = UrlState()
  const { loading, fn: fnLogout } = useFetch<any>(logout)

  // centralize logout logic using Promise chaining with explicit returns
  const handleLogout = () => {
    return fnLogout()
      .then(() => {
        console.log('Logged out from server')
        window.location.reload();
        return fetchUser()
      })
      .then(() => {
        console.log('User context refreshed')
        navigate('/')
      })
      .catch((err) => console.error('Logout failed', err))
  }

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 border-b">
        <Link to="/">
          <h1 className="text-xl font-semibold">URL Trimmer</h1>
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {user.user_metadata?.profile_pic ? (
                  <AvatarImage
                    src={user.user_metadata.profile_pic}
                    alt="Profile picture"
                    className="object-contain"
                  />
                ) : (
                  <AvatarFallback>CN</AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user.user_metadata?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center w-full">
                  <LinkIcon className="mr-2 h-4" />
                  My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center text-red-400"
              >
                <LogOutIcon className="mr-2 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate('/auth')} variant="outline">
            Login
          </Button>
        )}
      </nav>

      {loading && <BarLoader className="mb-4" width="100%" color="#36d7b7" />}
    </>
  )
}

export default Header