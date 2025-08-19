// import SearchInput from '@/components/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LogOut, Search, Settings } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex h-5 items-center">
          <SidebarTrigger variant="outline" className="h-9 w-9" />

          <Separator orientation="vertical" className="mx-3 hidden sm:block" />

          <div className="hidden sm:block">
            {/* <SearchInput /> */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="block sm:hidden">
              <Button variant="outline" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://play-lh.googleusercontent.com/7Ak4Ye7wNUtheIvSKnVgGL_OIZWjGPZNV6TP_3XLxHC-sDHLSE45aDg41dFNmL5COA"
                    alt="Admin"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">Admin</p>
                  <p className="text-muted-foreground text-xs leading-none">admin@sakyi.health</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;