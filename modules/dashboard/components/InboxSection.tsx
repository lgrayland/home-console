import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Inbox, ArrowRight, AlertCircle } from "lucide-react";
import type { ThoughtObject } from "@/lib/db/types";

interface InboxSectionProps {
  thoughtsCount: number;
  latestThoughts: ThoughtObject[];
  oldestInboxDays: number | null;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function InboxSection({
  thoughtsCount,
  latestThoughts,
  oldestInboxDays,
}: InboxSectionProps) {
  const hasStaleItems = oldestInboxDays !== null && oldestInboxDays > 7;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">Inbox</CardTitle>
            <p className="text-sm text-muted-foreground">
              {thoughtsCount} {thoughtsCount === 1 ? "thought" : "thoughts"} to
              process
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/thoughts">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {latestThoughts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Your inbox is clear</p>
          </div>
        ) : (
          <div className="space-y-2">
            {latestThoughts.map((thought) => (
              <div
                key={String(thought.id)}
                className="flex items-start justify-between gap-4 rounded-lg border px-4 py-3"
              >
                <p className="text-sm text-foreground line-clamp-2">
                  {thought.content}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(
                    new Date(thought.created_at as unknown as string),
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {hasStaleItems && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm text-orange-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Oldest item is {oldestInboxDays} days old</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
