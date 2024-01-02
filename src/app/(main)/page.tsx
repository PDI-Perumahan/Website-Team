import FeatureCard from "@/components/feature-card";
import Hero from "@/components/hero";
import { featuresItem } from "@/config/features";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen">
        <Hero />
      </div>
      <main className="flex min-h-screen flex-col items-center justify-between px-24 py-16">
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
            Check out our unique features that make your dreams come true.
          </p>
        </section>
        <section className="container mx-auto px-6 my-16">
          {featuresItem.map((item, index) => (
            <FeatureCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              imageSrc={item.imageSrc}
            />
          ))}
        </section>
      </main>
    </>
  );
}
