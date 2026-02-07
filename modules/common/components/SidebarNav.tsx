"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  FileText,
  FolderKanban,
  Server,
  Settings,
  Lightbulb,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import HomeConsole from "./HomeConsole";

const navItems = [
  { name: "Thoughts", href: "/thoughts", icon: Lightbulb },
  { name: "Todos", href: "/todos", icon: CheckSquare },
  { name: "Finance", href: "/finance", icon: Banknote },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "System", href: "/system", icon: Server },
];

const settingsItem = { name: "Settings", href: "/settings", icon: Settings };

// Mobile bottom bar: items on left, Thoughts in centre, items on right
const mobileLeftItems = [
  { name: "Finance", href: "/finance", icon: Banknote },
  { name: "Todos", href: "/todos", icon: CheckSquare },
];
const mobileCentreItem = {
  name: "Thoughts",
  href: "/thoughts",
  icon: Lightbulb,
};
const mobileRightItems = [
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <HomeConsole className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Home Console</h2>
        </Link>
      </div>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background lg:hidden">
        <div className="flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {mobileLeftItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-3 text-[10px] font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Centre Thoughts button - raised circle */}
          <Link
            href={mobileCentreItem.href}
            className={cn(
              "flex flex-col items-center gap-1 -mt-4 mb-1 transition-colors",
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center h-12 w-12 rounded-full border-2 transition-colors shadow-lg",
                pathname.startsWith(mobileCentreItem.href)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted text-foreground border-border hover:bg-muted/80",
              )}
            >
              <mobileCentreItem.icon className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "text-[10px] font-medium",
                pathname.startsWith(mobileCentreItem.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {mobileCentreItem.name}
            </span>
          </Link>

          {mobileRightItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-3 text-[10px] font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar - icon only */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-16 lg:flex-col bg-sidebar border-r border-sidebar-border">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-center border-b border-sidebar-border py-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="rounded-lg p-1 transition-colors hover:bg-sidebar-accent"
                >
                  <HomeConsole className="h-6 w-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Home
              </TooltipContent>
            </Tooltip>
          </div>
          <nav className="flex-1 flex flex-col items-center gap-1 px-2 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-lg p-2.5 transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
          <div className="border-t border-sidebar-border px-2 py-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={settingsItem.href}
                  className={cn(
                    "flex items-center justify-center rounded-lg p-2.5 transition-colors",
                    pathname === settingsItem.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <settingsItem.icon className="h-5 w-5" />
                  <span className="sr-only">{settingsItem.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {settingsItem.name}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="h-14 lg:hidden" />
      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </TooltipProvider>
  );
}
