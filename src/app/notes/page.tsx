"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { createClient } from "@/utils/supabase/client";
import UserMetadataDialog from "@/components/dialogs/user-metadata";
import NoteInput from "@/components/note-input";
import NotesSection from "@/components/notes-section";

export default function ChatPage() {
  const [user, setUser] = useState<any | null>(null);
  const [openUserMetadataDialog, setOpenUserMetadataDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          router.push("/login");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!user || loading) return;

    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
    const email = user?.user_metadata?.email || user?.email;
    const avatar =
      user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    if (!name || !email || !avatar) {
      setOpenUserMetadataDialog(true);
    }
  }, [user, loading]);

  const userDetails = {
    id: user?.id,
    name: user?.user_metadata?.name || user?.user_metadata?.full_name || "User",
    email: user?.user_metadata?.email || user?.email,
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
  };

  return (
    <main className="relative flex flex-col justify-center items-center w-full min-h-screen py-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/30"></div>

        {/* Animated shapes */}
        <div className="absolute inset-0">
          {/* Shape 1 */}
          <motion.div
            className="absolute top-0 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Shape 2 */}
          <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Shape 3 */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#33333310_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserMetadataDialog
          open={openUserMetadataDialog}
          setOpen={setOpenUserMetadataDialog}
          userId={userDetails?.id}
        />

        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-primary/50 rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-primary/50 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary/50 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        ) : (
          <motion.div
            className="w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <NoteInput
              className="w-full"
              userId={userDetails?.id}
              onNoteCreated={() => {
                // This would trigger a refetch of notes in NotesSection
                // You may need to implement a shared state or context for this
              }}
            />
          </motion.div>
        )}

        {/* Display Notes using the new NotesSection component */}
        <div className="mt-8 w-full max-w-2xl">
          {!loading && userDetails?.id && (
            <NotesSection userId={userDetails.id} />
          )}
        </div>
      </motion.div>
    </main>
  );
}
