import HomeGradient from "@/components/gradients/home-gradient";
import { Header } from "@/components/home/navbar";
import HeroSection from "@/components/home/hero";
import FeaturesSection from "@/components/home/features";
import TestimonialsSection from "@/components/home/testimonials";
import CTASection from "@/components/home/cta";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HomeGradient />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
