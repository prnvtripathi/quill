import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { login, signup } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignInButton from "./oauth-button";

export default function AuthForm({
  formType,
}: {
  formType: "login" | "signup";
}) {
  return (
    <Card className="mx-auto max-w-sm sm:w-96 border-neutral-800 bg-neutral-950 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {formType === "login" ? "Login" : "Create new account"}
        </CardTitle>
        <CardDescription className="text-neutral-400">
          {formType === "login"
            ? "Welcome back! Please login to your account."
            : "Enter your email below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <SignInButton method="google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-950 px-2 text-neutral-400">
                Or continue with
              </span>
            </div>
          </div>

          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                className="border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                className="border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400"
                required
              />
            </div>

            {formType === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="********"
                  className="border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-400"
                  required
                />
              </div>
            )}

            <Button
              variant="default"
              type="submit"
              className="w-full"
              formAction={formType === "login" ? login : signup}
            >
              {formType === "login" ? "Login" : "Create account"}
            </Button>

            <div className="text-center mt-2">
              <p className="text-sm text-neutral-400">
                {formType === "login" ? (
                  <>
                    New user?{" "}
                    <Link
                      href="/signup"
                      className="text-white hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-white hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
