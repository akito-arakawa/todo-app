"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Plus from "@/components/icon/plus";
import Logout from "@/components/icon/logout";
import { useState } from "react";
import { TaskRequest } from "@/types";

export default function page() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDueDate, setShowDueDate] = useState(false);

  //タスク追加処理
  const createTask = async (e: React.FormEvent) => {
    //画面の更新を防ぐ
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }

    try {
      const taskRequest: TaskRequest = {
        title,
        dueDate: dueDate || null,
      };
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskRequest),
      });

      if (!response.ok) {
        throw new Error("タスク追加に失敗しました");
      }
      const data = await response.json();
      console.log("追加されたタスク:", data);

      setTitle("");
      setDueDate("");
      setShowDueDate(false);
    } catch (error) {
      console.error("エラー:", error);
    }

    return;
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-blue-900">
      <header className="bg-blue-600 dark:bg-blue-900 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold">Todoアプリ</h1>
            <p className="text-sm text-blue-100 hidden md:block">
              こんにちはloginId
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Logout />
            <button className="inline-flex items-center justify-center text-sm font-medium h-10 px-4 py-3">
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            タスク管理
          </h1>
          <div className="w-full max-w-3xl space-y-6">
            <Card>
              <CardContent>
                <form onSubmit={createTask} className="space-y-3">
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
            <div className="w-full max-w-3xl space-y-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex space-x-2 bg-gray-100 rounded-lg p-2">
                  <TabsTrigger
                    value="all"
                    className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black"
                  >
                    すべて
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black"
                  >
                    未完了
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black"
                  >
                    完了
                  </TabsTrigger>
                  <TabsTrigger
                    value="overdue"
                    className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black"
                  >
                    期限切れ
                  </TabsTrigger>
                  <TabsTrigger
                    value="upcoming"
                    className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black"
                  >
                    近日締め切り
                  </TabsTrigger>
                </TabsList>
                {/* タブごとの中身（例） */}
                <div className="mt-4">
                  <TabsContent value="all">全タスク一覧</TabsContent>
                  <TabsContent value="active">未完了のタスク</TabsContent>
                  <TabsContent value="completed">完了したタスク</TabsContent>
                  <TabsContent value="overdue">期限切れのタスク</TabsContent>
                  <TabsContent value="upcoming">近日締め切りタスク</TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
        <div>
          <p>© 2025 Todoアプリ</p>
        </div>
      </footer>
    </div>
  );
}
