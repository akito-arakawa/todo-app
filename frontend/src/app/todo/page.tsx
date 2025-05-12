"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Plus from "@/components/icon/plus";
import Logout from "@/components/icon/logout";
import { useState } from "react";
import { TaskRequest, Task, FilterTab } from "@/types";
import TaskItem from "@/components/todo/task-item";
import { useRouter } from "next/navigation";

export default function page() {
  //タスク追加ステート
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDueDate, setShowDueDate] = useState(false);
  //タスク表示ステート
  const [tasks, setTasks] = useState<Task[]>([]);
  //Tabsステート
  const [filter, setFilter] = useState<FilterTab>("all");
  //タスク編集ステート
  const [complete, setComplete] = useState(false);
  //ユーザ名
  const [userName, setUserName] = useState<string>("");

    const router = useRouter();

  //初期の描画のためのデータを取得する
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンがありません");
      return;
    }
    const fetchTask = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response) {
          throw new Error("タスク取得に失敗しました。");
        }

        const data = await response.json();
        setTasks(data);
        console.log(data);
      } catch {
        throw new Error("表示に失敗しました。");
      }
      try {
        const response = await fetch("http://localhost:8080/api/tasks/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response) {
          throw new Error("usernmaeの取得に失敗しました");
        }

        const data = await response.text();
        setUserName(data);
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    fetchTask();
  }, []);

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
      if (title.length > 0) {
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
        switch (filter) {
          case "active":
            await activeTask();
            break;
          case "completed":
            await completeTask();
            break;
          case "overdue":
            await overdueTask();
            break;
          case "upcoming":
            await upcomingTask();
            break;
          default:
            await allTask();
            break;
        }
      } else {
        console.log("タスクが空です");
        return;
      }
    } catch (error) {
      console.error("エラー:", error);
    }

    return;
  };

  //タスクすべて表示
  const allTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("タスク取得に失敗しました。");
      }

      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch {
      throw new Error("表示に失敗しました。");
    }
  };
  //未完了タスク
  const activeTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/api/tasks/inComplete",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        throw new Error("タスク取得に失敗しました。");
      }

      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch {
      throw new Error("表示に失敗しました。");
    }
  };

  //完了タスク
  const completeTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/tasks/complete", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("タスク取得に失敗しました。");
      }

      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch {
      throw new Error("表示に失敗しました。");
    }
  };

  //期限切れタスク
  const overdueTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/tasks/expired", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("タスク取得に失敗しました。");
      }

      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch {
      throw new Error("表示に失敗しました。");
    }
  };

  //近日締め切りタスク
  const upcomingTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/tasks/dueSoon", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("タスク取得に失敗しました。");
      }

      const data = await response.json();
      setTasks(data);
      console.log(data);
    } catch {
      throw new Error("表示に失敗しました。");
    }
  };

  //削除機能
  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) {
        throw new Error("削除に失敗しました。");
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  //タスク編集処理
  const handleUpdate = async (updateTask: Task) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/api/tasks/update/${updateTask.id}`,
        {
          method: "Put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updateTask.title,
            status: updateTask.status,
            dueDate: updateTask.dueDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }
      switch (filter) {
        case "active":
          await activeTask();
          break;
        case "completed":
          await completeTask();
          break;
        case "overdue":
          await overdueTask();
          break;
        case "upcoming":
          await upcomingTask();
          break;
        default:
          await allTask();
          break;
      }
      //更新したデータを取得
      const data = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === updateTask.id ? data : t)));
    } catch (error) {
      console.error(error);
      alert("タスクの更新に失敗しました");
    }
  };

  //完了をすべて削除
  const handleDeleteCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await fetch("http://localhost:8080/api/tasks/complete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        throw new Error("削除に失敗しました");
      }
      switch (filter) {
        case "active":
          await activeTask();
          break;
        case "completed":
          await completeTask();
          break;
        case "overdue":
          await overdueTask();
          break;
        case "upcoming":
          await upcomingTask();
          break;
        default:
          await allTask();
          break;
      }
      setTasks((prev) => prev.filter((tasks) => tasks.status === "InComplete"));
    } catch (error) {
      return alert("削除に失敗しました。");
    }
  };
  //完了をすべて削除するボタン管理
  const completedTaskCount = tasks.filter(
    (task) => task.status === "Complete"
  ).length;
  const comleted = completedTaskCount > 0;

const handleLogout = () => {
   localStorage.removeItem("token");
   router.push("/auth/login")
}

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-blue-900">
      <header className="bg-blue-600 dark:bg-blue-900 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold">Todoアプリ</h1>
            <p className="text-sm text-blue-100 hidden md:block">
              {`こんにちは${userName}さん`}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-sm font-medium h-10 px-4 py-3"
                    onClick={handleLogout}>
              <Logout />
              ログアウト
            </Button>
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
              <Tabs
                className="w-full"
                value={filter}
                onValueChange={(value) => setFilter(value as FilterTab)}
              >
                <div className="flex justify-between">
                  <TabsList className="flex space-x-2 bg-gray-100 rounded-lg p-2">
                    <TabsTrigger
                      value="all"
                      className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
                      onClick={allTask}
                    >
                      すべて
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
                      onClick={activeTask}
                    >
                      未完了
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black  mr-0 cursor-pointer"
                      onClick={completeTask}
                    >
                      完了
                    </TabsTrigger>
                    <TabsTrigger
                      value="overdue"
                      className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
                      onClick={overdueTask}
                    >
                      期限切れ
                    </TabsTrigger>
                    <TabsTrigger
                      value="upcoming"
                      className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black  mr-0 cursor-pointer"
                      onClick={upcomingTask}
                    >
                      近日締め切り
                    </TabsTrigger>
                  </TabsList>
                  {comleted && (
                    <Button
                      type="button"
                      className="bg-red-400 hover:bg-red-500"
                      onClick={handleDeleteCompleted}
                    >
                      完了を全て削除
                    </Button>
                  )}
                </div>
                {/* タブごとの中身（例） */}
                <div className="mt-4">
                  <TabsContent value={filter}>
                    {tasks.length > 0 ? (
                      tasks.map((task: Task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onDelete={handleDelete}
                          onUpdate={handleUpdate}
                        />
                      ))
                    ) : filter === "all" ? (
                      <p>タスクがありません</p>
                    ) : (
                      <p>
                        {filter === "completed"
                          ? "完了した"
                          : filter === "active"
                          ? "未完了の"
                          : filter === "overdue"
                          ? "期限切れの"
                          : "近日締め切りの"}
                        タスクがありません
                      </p>
                    )}
                  </TabsContent>
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
