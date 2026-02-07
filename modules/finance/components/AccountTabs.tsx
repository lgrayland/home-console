import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import Link from "next/link";

export function AccountTabs({
  accountId,
  tabs,
}: {
  accountId: string;
  tabs: Array<{ id: string; label: string; href: string }>;
}) {
  return (
    <Tabs value={accountId}>
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id} asChild>
            <Link href={t.href}>{t.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
