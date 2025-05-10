"use client"

import React from "react";
import { Task } from "../../types/index";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Pencil from "@/components/icon/pencil";
import Trash from "../icon/trash";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { on } from "events";

interface TodoItemProps {
  task: Task;
  onUpdate: (todo: Task) => void;
  onDelete: (id: string) => void;
}

export default function taskItem({ task, onDelete, onUpdate }: TodoItemProps) {
  //タスク編集切替ステート
  const [isEditing, setIsEditing] = useState(false);
  //タスクTitleステート
  const [editTitle, setEditTitle] = useState(task.title);
  //タスクdueDateステート
  const [editDueDate, setDueDate] = useState(task.dueDate || "");

  //編集キャンセル処理
  const handleCancelTask = () => {
    setEditTitle(task.title);
    setDueDate(task.dueDate || "");
    setIsEditing(false);
  };
  //タスク編集
  const handleUpdateTask = () => {
    if (editTitle.trim()) {
      onUpdate({
        ...task,
        title: editTitle.trim(),
        dueDate: editDueDate || null,
      });
      setIsEditing(false);
    }
  };

  return (
    <Card className="p-0 mb-2 hover:shadow-md transition-all">
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
              onChange={(e) => setDueDate(e.target.value)}
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
              <Checkbox />
              <div className="ml-2">
                <p className="flex items-center mb-0 ">{task.title}</p>
              </div>
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
                onClick={() => onDelete(task.id)}
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
