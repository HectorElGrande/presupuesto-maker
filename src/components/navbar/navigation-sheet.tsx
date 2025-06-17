"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import Image from "next/image";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const logo = {
  url: "/",
  src: "/logo-dark.svg",
  alt: "logo",
  title: "QuoteFlow",
}

const menu = [
  { title: "Home", url: "#" },
  {
    title: "Products",
    url: "#",
    items: [
      {
        title: "Blog",
        description: "The latest industry news, updates, and info",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Company",
        description: "Our mission is to innovate and empower the world",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Careers",
        description: "Browse job listing and discover our workspace",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Support",
        description:
          "Get in touch with our support team or visit our community forums",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Help Center",
        description: "Get all the answers you need right here",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Contact Us",
        description: "We are here to help you with any questions you have",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Status",
        description: "Check the current status of our services and APIs",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Terms of Service",
        description: "Our terms and conditions for using our services",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Pricing",
    url: "#",
  },
  {
    title: "Blog",
    url: "#",
  },
]
const auth = {
  login: { title: "Login", url: "#" },
  signup: { title: "Sign up", url: "#" },
}

export function NavigationSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto [&>[data-dismiss]]:cursor-pointer">
        <SheetHeader>
          <SheetTitle>
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
            </a>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-4"
          >
            {menu.map((item) => renderMobileMenuItem(item))}
          </Accordion>

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline">
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button>
            <Button asChild>
              <a href={auth.signup.url}>{auth.signup.title}</a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};
