import CTABanner from "@/components/home/cta-banner";
import FAQ from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import Pricing from "@/components/home/pricing";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/nav-bar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <div className="-mt-16">
        <Hero />
      </div>
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </ThemeProvider>
  );
}
