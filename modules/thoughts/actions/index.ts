"use server";

import { revalidatePath } from "next/cache";
import {
  createThought,
  updateThoughtStatus,
  deleteThought,
} from "@/lib/db/thoughts/mutations";

export async function addThoughtAction(content: string) {
  await createThought(content);

  revalidatePath("/thoughts");
  revalidatePath("/thoughts/capture");
}

export async function archiveThoughtAction(id: string) {
  await updateThoughtStatus(id, "archived");
  revalidatePath("/thoughts");
}

export async function discardThoughtAction(id: string) {
  await updateThoughtStatus(id, "discarded");
  revalidatePath("/thoughts");
}

export async function deleteThoughtAction(id: string) {
  await deleteThought(id);
  revalidatePath("/thoughts");
}
