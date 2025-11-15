"use client"

import { useLogout } from "@/hooks/useAuth"
import { getUserData } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image";
import logo from "@/public/logo.png"
import Link from "next/link";

export function DashboardHeader() {
  const logout = useLogout()
  const { theme, setTheme } = useTheme()
  const [userData, setUserData] = useState<ReturnType<typeof getUserData>>(null)

  useEffect(() => {
    setUserData(getUserData())
  }, [])

  const initials = userData
    ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`.toUpperCase() || "AD"
    : "AD"

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
              <Image src={logo} alt="logo" className="rounded-lg h-15 w-auto"/>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FASTXOF Admin
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Gérez votre plateforme</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

            {/* User menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full p-0 hover:scale-105 transition-all duration-300"
                    >
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/30 hover:ring-primary/50 transition-all duration-300">
                            <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground font-bold text-base sm:text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-64 sm:w-72 glass backdrop-blur-xl border-border/50 shadow-xl mt-2"
                    align="end"
                    forceMount
                >
                    <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                                <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground font-bold text-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1 flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-none truncate">
                                    {userData?.first_name} {userData?.last_name}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground truncate">
                                    {userData?.email}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <div className="p-2">
                        <DropdownMenuItem
                            asChild
                            className="rounded-lg cursor-pointer hover:bg-primary/10 focus:bg-primary/10 transition-colors p-3"
                        >
                            <Link href="/profile" className="flex items-center">
                                <div className="p-2 rounded-lg bg-primary/10 mr-3">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Profil</span>
                                    <span className="text-xs text-muted-foreground">Gérer votre compte</span>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <div className="p-2">
                        <DropdownMenuItem
                            onClick={()=>logout.mutate()}
                            className="rounded-lg cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive transition-colors p-3"
                        >
                            <div className="p-2 rounded-lg bg-destructive/10 mr-3">
                                <LogOut className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">Déconnexion</span>
                                <span className="text-xs text-muted-foreground">Se déconnecter du compte</span>
                            </div>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
