"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { logout } from "@/lib/actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NavUser() {
  const [user, setUser] = useState<any | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };

    fetchUser();

    // Set up subscription for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const userDetails = {
    name: user?.user_metadata?.name || user?.user_metadata?.full_name || "User",
    email: user?.user_metadata?.email || user?.email,
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
  };

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className={cn(
              "flex items-center gap-2 rounded-full shadow",
              "backdrop-blur-md px-2 py-1",
              "dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700/90",
              "light:bg-white/90 light:text-slate-900 light:hover:bg-slate-100/90",
              "transition-all duration-300"
            )}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.2 }}
          >
            <Avatar className="h-8 w-8 ring-1 ring-offset-1 dark:ring-slate-600 dark:ring-offset-slate-800 light:ring-slate-200 light:ring-offset-white">
              <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {getFirstLetter(userDetails.name)}
              </AvatarFallback>
            </Avatar>

            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={{
                width: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col text-left leading-tight pr-2 whitespace-nowrap">
                <span className="font-medium text-sm">{userDetails.name}</span>
                <span className="text-xs opacity-70">{userDetails.email}</span>
              </div>
            </motion.div>
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-56 rounded-lg p-1 dark:bg-slate-800 dark:border-slate-700"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {getFirstLetter(userDetails.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm leading-tight">
                <p className="font-semibold mb-0.5">{userDetails.name}</p>
                <p className="text-xs opacity-70">{userDetails.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="dark:bg-slate-700" />

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : theme === "light" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Monitor className="mr-2 h-4 w-4" />
                  )}
                  Theme
                </div>
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent className="min-w-32 p-1 dark:bg-slate-800 dark:border-slate-700">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                  {theme === "light" && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-500" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                  {theme === "dark" && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-500" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                  {theme === "system" && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="dark:bg-slate-700" />

          <DropdownMenuItem
            onClick={logout}
            className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
