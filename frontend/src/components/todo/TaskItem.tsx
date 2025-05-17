"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Pencil from "@/components/icon/pencil";
import Trash from "../icon/trash";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/types";

export default function TaskItem({ tasks }: { tasks: Task }) {
  const { updateTask, deleteTask } = useTaskContext();

  //タスク編集切替ステート
  const [isEditing, setIsEditing] = useState(false);
  //タスクTitleステート
  const [editTitle, setEditTitle] = useState(tasks.title);
  //タスクdueDateステート
  const [editDueDate, setEditDueDate] = useState(
    tasks.dueDate ? tasks.dueDate.slice(0, 10) : ""
  );

  //編集キャンセル処理
  const handleCancelTask = () => {
    setEditTitle(tasks.title);
    setEditDueDate(tasks.dueDate ? tasks.dueDate.slice(0, 10) : "");
    setIsEditing(false);
  };

  //タスク編集
  const handleUpdateTask = () => {
    if (editTitle.trim()) {
      updateTask({
        ...tasks,
        title: editTitle.trim(),
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
      });
      setIsEditing(false);
    }
  };

  const handleCheckedComplete = (checked: boolean) => {
    updateTask({
      ...tasks,
      status: checked ? "Complete" : "InComplete",
    });
  };

  // 期限による色クラス判定
  const dueDate = tasks.dueDate ? new Date(tasks.dueDate) : null;
  const today = new Date();
  const soon = new Date();
  soon.setDate(today.getDate() + 3);

  const isComplete = tasks.status === "Complete";

  const cardBorder = (() => {
    if (isComplete) return "border border-gray-300"; // 完了なら常に通常色
    if (!dueDate) return "border border-gray-300";
    if (dueDate < today) return "border border-red-500";
    if (dueDate <= soon) return "border border-yellow-500";
    return "border border-gray-300";
  })();
  return (
    <Card className={`p-0 mb-2 hover:shadow-md transition-all ${cardBorder}`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full"
              placeholder="タスク名を入力してください"
              autoFocus
            />
            <Input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button className="size-sm" onClick={handleUpdateTask}>
                保存
              </Button>
              <Button onClick={handleCancelTask}>キャンセル</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                checked={tasks.status === "Complete"}
                onCheckedChange={handleCheckedComplete}
                className="transition-all duration-200"
              />
              <div className="ml-2">
                <p
                  className={`flex items-center mb-0 ${
                    tasks.status === "Complete"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {tasks.title}
                </p>
              </div>
              {tasks.dueDate && (
                <p className="text-sm text-gray-500 ml-2">
                  {new Date(tasks.dueDate).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <Button
                className="bg-white hover:bg-gray-100 shadow-none"
                onClick={() => setIsEditing(true)}
              >
                <Pencil />
              </Button>
              <Button
                className="bg-white hover:bg-red-100 shadow-none "
                onClick={() => deleteTask(tasks.id)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
