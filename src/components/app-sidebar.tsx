"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ChevronsLeft } from "lucide-react";
import { NavChats, NavChatsSkeleton } from "./nav-chats";
import { NavUser, NavUserSkeleton } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/utils/supabase/client";

// This is sample data.
const data = {
  chats: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  const userDetails = {
    name: user?.user_metadata?.name || user?.user_metadata?.full_name || "User",
    email: user?.user_metadata?.email || user?.email,
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="pt-16">
        <Suspense fallback={<NavChatsSkeleton />}>
          <NavChats chats={data.chats} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<NavUserSkeleton />}>
          <NavUser user={userDetails} />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
