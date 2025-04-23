import AuthForm from "@/components/auth-form";
import AuthGradient from "@/components/gradients/auth-gradient";

export default function LoginPage() {
  return (
    <main className="flex flex-row-reverse bg-black justify-center items-center h-screen">
      <div className="w-1/2 hidden h-screen md:block">
        <AuthGradient />
      </div>
      <AuthForm formType="login" />
    </main>
  );
}
