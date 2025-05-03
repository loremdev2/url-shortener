import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LinkIcon, LogOut } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate()

    const user = false;

    return (
        <nav className="flex items-center justify-between px-4 py-3 border-b">
            <Link to={'/'}>
                <h1 className="text-xl font-semibold">URL Trimmer</h1>
            </Link>


            {
                !user ?
                    <Button
                        onClick={() => navigate("/auth")}
                        variant={'outline'}
                    >
                        Login
                    </Button> :

                    <DropdownMenu>
                        <DropdownMenuTrigger><Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Lorem Dev</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LinkIcon className='mr-2 h-4'/>    My Links
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-red-400'>
                                <LogOut className='mr-2 h-4' />  <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>


            }
        </nav>
    )
}

export default Header
