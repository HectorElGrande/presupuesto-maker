import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
  {
    title: "Testimonials",
    href: "#testimonials",
  },
  {
    title: "Privacy",
    href: "#privacy",
  },
];

const logo = {
        url: "/",
        src: "/logo-dark.svg",
        alt: "logo",
        title: "QuoteFlow",
    }

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
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
          </div>

          {/* Subscribe Newsletter */}
          <div className="max-w-xs w-full">
            <h6 className="font-semibold">Stay up to date</h6>
            <form className="mt-6 flex items-center gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank">
              QuoteFlow
            </Link>
            . All rights reserved.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="#" target="_blank">
              <TwitterIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <DribbbleIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <TwitchIcon className="h-5 w-5" />
            </Link>
            <Link href="#" target="_blank">
              <GithubIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;