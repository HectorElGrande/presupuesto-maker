import CTABanner from "@/components/home/cta-banner";
import FAQ from "@/components/home/faq";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing";

export default function Home() {
  return (
    <>
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
    </>
  );
}