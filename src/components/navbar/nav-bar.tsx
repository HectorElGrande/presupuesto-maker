import { AppNavigationMenu } from "@/components/navbar/app-navigation-menu";
import { ThemeToggle } from "@/components/navbar/sidebar/theme-toggle";
import { NavigationSheet } from "@/components/navbar/navigation-sheet";
import Image from "next/image";

const logo = {
  url: "/",
  src: "/logo-dark.svg",
  alt: "logo",
  title: "QuoteFlow",
}

export const Navbar = () => {
  return (
    <nav className="px-6 lg:px-0 pt-4">
      <div className="relative z-20 max-w-screen-lg mx-auto bg-background px-2 rounded-full text-foreground border">
        <div className="h-12 flex items-center justify-between">
          {/* Logo */}
          <a href={logo.url} className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo-light.svg"
                alt="QuoteFlow Logo Claro"
                fill
                className="block dark:hidden object-contain"
              />
              <Image
                src="/logo-dark.svg"
                alt="QuoteFlow Logo Oscuro"
                fill
                className="hidden dark:block object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
          </a>

          <div className="ml-2 hidden sm:block">
            <AppNavigationMenu />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="block sm:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
