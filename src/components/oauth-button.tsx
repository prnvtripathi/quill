"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

const SignInButton = ({ method }: { method: string }) => {
  const handleSignIn = async () => {
    const supabase = createClient(); // Ensure this is client-side
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/`, // Ensure it's NEXT_PUBLIC_
      },
    });

    if (error) {
      console.error("Google Sign-in Error:", error.message);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-neutral-800 bg-neutral-950 text-white hover:bg-neutral-900 hover:text-white w-full"
      onClick={handleSignIn}
    >
      {method === "google" ? <FcGoogle className="mr-2 h-4 w-4" /> : null}
      {method === "google" ? "Google" : null}
    </Button>
  );
};

export default SignInButton;
