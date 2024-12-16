"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { CreateBoard } from "./boardComponent/add-board";
import { MenuIcon } from "lucide-react";
import Account from "./account";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Boards",
    href: "/boards",
    description:
      "View and manage all your boards for organizing tasks and projects.",
  },
  {
    title: "Tasks",
    href: "/boards",
    description: "Track and manage all your tasks across different boards.",
  },
  {
    title: "Teams",
    href: "/boards",
    description: "Collaborate with team members and manage team settings.",
  },
  {
    title: "Notifications",
    href: "/boards",
    description:
      "Stay updated with the latest notifications about your tasks and projects.",
  },
  {
    title: "Settings",
    href: "/boards",
    description:
      "Adjust your preferences, account settings, and notifications.",
  },
  {
    title: "Help",
    href: "/boards",
    description: "Find guides, FAQs, and contact support for assistance.",
  },
];

export function NavigationMenuDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <NavigationMenu className="text-white hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>WorkSpaces</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] z-50">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/boards"
                    >
                      <Image
                        src="/logo.jpg"
                        alt="UI Logo"
                        width={48}
                        height={48}
                        className="h-6 w-6"
                      />
                      {/* <Icons.logo className="h-6 w-6" /> */}
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Rails Trello
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Effortlessly organize your projects with beautifully
                        crafted boards. Collaborative. Scalable. Open Source.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/boards" title="Boards Overview">
                  Create, customize, and manage boards effortlessly for all your
                  projects.
                </ListItem>
                <ListItem href="/boards" title="Getting Started">
                  Step-by-step guide to set up and organize your workspace.
                </ListItem>
                <ListItem href="/boards" title="Collaboration">
                  Seamless tools for team collaboration and task management.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Recent</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Stared
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList></NavigationMenuList>
      </NavigationMenu>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="flex md:hidden relative">
          <MenuIcon className="text-white size-7 cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] slide-in">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex flex-col items-center nav-link w-fit"
              onClick={() => setOpen(false)}
            >
              <SheetHeader className="mx-auto">
                <Image
                  src="/logo.jpg"
                  alt="Rails Trello Logo"
                  width={48}
                  height={48}
                  className="h-24 w-24 mx-auto rounded-full"
                />
                <SheetTitle className="text-center">Rails Trello</SheetTitle>
                <SheetDescription className="text-sm">
                  Streamline Your Workflow, One Board at a Time 🚀
                </SheetDescription>
              </SheetHeader>
            </Link>
            <Link
              href="#workspaces"
              onClick={() => setOpen(false)}
              className="nav-lin w-full"
            >
              Workspaces
            </Link>
            <Link
              href="#recent"
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              Recent
            </Link>
            <Link
              href="#starred"
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              Starred
            </Link>
            {components.slice(0, 1).map((component) => (
              <Link
                key={component.title}
                href={component.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {component.title}
              </Link>
            ))}
          </nav>
          <footer className="flex flex-col justify-items-start mt-2 gap-3 absolute bottom-5 w-full">
            <Account />
            {/* <button className="btn btn-primary">Create New Board</button> */}
          </footer>
        </SheetContent>
      </Sheet>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
