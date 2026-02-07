"use client";

import React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { addThoughtAction } from "../actions";

export function ThoughtInput() {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      addThoughtAction(value.trim());
      setValue("");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a thought and press Enter..."
          className="bg-background border-input"
        />
      </CardContent>
    </Card>
  );
}
