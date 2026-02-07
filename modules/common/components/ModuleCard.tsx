import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import type { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  module: {
    title: string;
    description: string;
    value: string;
    subtitle: string;
    href: string;
    icon: LucideIcon;
  };
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = module.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{module.title}</CardTitle>
        </div>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      {(module.value || module.subtitle) && (
        <CardContent className="flex-1">
          {module.value && (
            <p className="text-2xl font-semibold text-foreground mb-1">
              {module.value}
            </p>
          )}
          {module.subtitle && (
            <p className="text-sm text-muted-foreground">{module.subtitle}</p>
          )}
        </CardContent>
      )}
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={module.href}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
