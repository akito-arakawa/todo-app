"use client" 

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Plus from "@/components/icon/plus";
import { useState } from "react";
import { TaskRequest } from "@/types";
import { useTaskContext } from "@/context/TaskContext";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDueDate, setShowDueDate] = useState(false);

  const { createTask } = useTaskContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) return;

    const taskRequest: TaskRequest = {
      title,
      dueDate: dueDate || null,
    };

    await createTask(taskRequest);
    setTitle("");
    setDueDate("");
    setShowDueDate(false);
  };
  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              className="flex h-10 w-full rounded-md whitespace-nowrap bg-white px-3 py-2 text-sm"
              placeholder="新しいタスクを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <Button
              className=" text-black inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold bg-white border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10 shrink-0"
              onClick={() => setShowDueDate(!showDueDate)}
              type="button"
            >
              <Plus />
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="bg-gray-400 hover:bg-gray-500 text-white rounded-md h-10 w-15"
            >
              追加
            </Button>
          </div>
          {showDueDate && (
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full"
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
