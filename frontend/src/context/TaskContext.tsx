import React, { useEffect } from "react";
import { createContext, useContext, ReactNode } from "react";
import { FilterTab, Task } from "@/types";
import * as TaskApi from "@/lib/api/task";
import { useState } from "react";
import { TaskRequest } from "@/types";
import { useRouter } from "next/navigation";

const TaskContext = createContext<any>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  //タスクの取得
  const loadTasks = async (type: FilterTab = "all") => {
    let data: Task[] = [];
    let result;
    switch (type) {
      case "active":
        result = await TaskApi.fetchInCompleteTasks();
        break;
      case "completed":
        result = await TaskApi.fetchCompleteTasks();
        break;
      case "overdue":
        result = await TaskApi.fetchOverdueTasks();
        break;
      case "upcoming":
        result = await TaskApi.fetchUpcomingTasks();
        break;
      default:
        result = await TaskApi.fetchAllTasks();
        break;
    }

    //トークンの有効期限切れの確認
    if (checkTokenExpired(result)) return;

    const { response } = result;
    data = await response.json();
    setTasks(data);
  };

  //タスク作成
  const createTask = async (taskRequest: TaskRequest) => {
    const result = await TaskApi.createTask(taskRequest);
    if (checkTokenExpired(result)) return;
    await loadTasks(filter); // リロード
  };

  //タスク編集
  const updateTask = async (task: Task) => {
    const result = await TaskApi.updateTask(task);
    if (checkTokenExpired(result)) return;
    await loadTasks(filter); // リロード
  };

  //タスク削除
  const deleteTask = async (taskId: string) => {
    const result = await TaskApi.deleteTask(taskId);
    if (checkTokenExpired(result)) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  //完了タスクをすべて削除
  const deleteCompleted = async () => {
    const result = await TaskApi.deleteCompletedTasks();
    if (checkTokenExpired(result)) return;
    await loadTasks(filter);
  };

  const fetchUserData = async () => {
    const result = await TaskApi.fetchUser();
    if (checkTokenExpired(result)) return;
    const { response } = result;
    const data = await response.json();
    setUserName(data.loginId);
  };

  //トークン切れの確認
  const checkTokenExpired = (result: { tokenExpired: boolean }) => {
    if (result.tokenExpired) {
      alert("セッションの有効期限が切れました。再度ログインしてください。");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/auth/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadTasks();
    fetchUserData();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filter,
        userName,
        setFilter,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        deleteCompleted,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used inside TaskProvider");
  return context;
};
