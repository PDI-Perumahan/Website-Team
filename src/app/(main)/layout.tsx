import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import { navbarItem } from "@/config/navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Navbar items={navbarItem} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
