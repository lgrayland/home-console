import { ThoughtInput } from "@/modules/thoughts/components/ThoughtInput";
import { ThoughtList } from "@/modules/thoughts/components/ThoughtList";
import { listThoughtsByStatus } from "@/lib/db/thoughts/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Thought = {
  id: string;
  content: string;
  createdAt: Date;
  status: "inbox" | "archived" | "converted";
};

export default async function ThoughtsPage() {
  const thoughts = await listThoughtsByStatus("inbox");

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-1">
          Thoughts
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture now, organise later
        </p>
      </div>

      <ThoughtInput />

      <div className="mt-8">
        <ThoughtList thoughts={thoughts} />
      </div>
    </div>
  );
}
