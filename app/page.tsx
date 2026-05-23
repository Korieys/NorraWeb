import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SKUSection } from "@/components/SKUSection";
import { Argument } from "@/components/Argument";
import { PackComposition } from "@/components/PackComposition";
import { ConversionBlock } from "@/components/ConversionBlock";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollTracker } from "@/components/ScrollTracker";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SKUSection skuId="110" />
        <SKUSection skuId="140" />
        <SKUSection skuId="170" />
        <SKUSection skuId="200" />
        <SKUSection skuId="230" />
        <Argument />
        <PackComposition />
        <ConversionBlock />
        <FAQ />
      </main>
      <Footer />
      <ScrollTracker />
    </>
  );
}
