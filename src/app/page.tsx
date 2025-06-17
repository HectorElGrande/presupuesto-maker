import CTABanner from "@/components/home/cta-banner";
import FAQ from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import Pricing from "@/components/home/pricing";

export default function Home() {
  return (
    <>
      <div className="-mt-16">
        <Hero />
      </div>
      <Pricing />
      <FAQ />
      <CTABanner />
    </>
  );
}