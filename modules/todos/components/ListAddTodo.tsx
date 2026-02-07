"use client";

import { Plus } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useState } from "react";
import { createTodo } from "@/lib/db/todos/mutations";

export default function ListAddTodo() {
  const [todoTitle, setTodoTitle] = useState("");

  const handleAddTodo = () => {
    if (todoTitle.trim()) {
      createTodo({ title: todoTitle.trim() });
      setTodoTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <>
      <Input
        placeholder="Add a new todo..."
        value={todoTitle}
        onChange={(e) => setTodoTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-9"
      />
      <Button size="sm" onClick={handleAddTodo} disabled={!todoTitle.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </>
  );
}
