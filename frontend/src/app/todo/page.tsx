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
import { useApiFetch } from "@/hooks/useApiFetch";
import TaskForm from "@/components/todo/TaskForm";
import TaskListTab from "@/components/todo/TaskListTab";
import TaskHeader from "@/components/todo/TaskHeader";

export default function page() {
  //カスタムフック関数を呼び出し
  const { apiFetch } = useApiFetch();

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
  //ユーザ名ステート
  const [userName, setUserName] = useState<string>("");
  //ルーティング設定
  const router = useRouter();

  //初期の描画のためのデータを取得する
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("トークンがありません");
      return;
    }
    const fetchTask = async () => {
      try {
        const response = await apiFetch("http://localhost:8080/api/tasks", {
          method: "GET",
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
        const response = await apiFetch(
          "http://localhost:8080/api/tasks/user",
          {
            method: "GET",
          }
        );

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
    const token = localStorage.getItem("accessToken");
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

        const response = await apiFetch("http://localhost:8080/api/tasks", {
          method: "POST",
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
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await apiFetch("http://localhost:8080/api/tasks", {
        method: "GET",
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
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await apiFetch(
        "http://localhost:8080/api/tasks/inComplete",
        {
          method: "GET",
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
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await apiFetch(
        "http://localhost:8080/api/tasks/complete",
        {
          method: "GET",
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

  //期限切れタスク
  const overdueTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await apiFetch(
        "http://localhost:8080/api/tasks/expired",
        {
          method: "GET",
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

  //近日締め切りタスク
  const upcomingTask = async (e?: React.FormEvent) => {
    //画面の更新を防ぐ
    e?.preventDefault();
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("トークンがありません");
      return;
    }
    try {
      const response = await apiFetch(
        "http://localhost:8080/api/tasks/dueSoon",
        {
          method: "GET",
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

  //削除機能
  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await apiFetch(
        `http://localhost:8080/api/tasks/${taskId}`,
        {
          method: "DELETE",
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
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await apiFetch(
        `http://localhost:8080/api/tasks/update/${updateTask.id}`,
        {
          method: "PUT",
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
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (!token) {
        alert("トークンがありません");
        return;
      }
      const response = await apiFetch(
        "http://localhost:8080/api/tasks/complete",
        {
          method: "DELETE",
        }
      );

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

  //ログアウト
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-blue-900">
      <TaskHeader userName={userName} handleLogout={handleLogout}/>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            タスク管理
          </h1>
          <div className="w-full max-w-3xl space-y-6">
            <TaskForm
              title={title}
              createTask={createTask}
              setTitle={setTitle}
              setShowDueDate={setShowDueDate}
              showDueDate={showDueDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />
            <div className="w-full max-w-3xl space-y-6">
              <Tabs
                className="w-full"
                value={filter}
                onValueChange={(value) => setFilter(value as FilterTab)}
              >
                <div className="flex justify-between">
                  <TaskListTab
                    allTask={allTask}
                    activeTask={activeTask}
                    completeTask={completeTask}
                    overdueTask={overdueTask}
                    upcomingTask={upcomingTask}
                  />
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
