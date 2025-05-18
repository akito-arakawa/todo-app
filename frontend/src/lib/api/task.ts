import { Task, TaskRequest } from "@/types";
import { apiFetch } from "@/hooks/useApiFetch";

//全てのタスクを取得
export const fetchAllTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks", {
    method: "GET",
  });
};

//未完了タスクを取得
export const fetchInCompleteTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/inComplete", { method: "GET" });
};

//完了タスクを取得
export const fetchCompleteTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/complete", { method: "GET" });
};

//期限切れタスクを取得
export const fetchOverdueTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/expired", { method: "GET" });
};

//近日締め切りタスクを取得
export const fetchUpcomingTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/dueSoon", { method: "GET" });
};

//タスクを作成
export const createTask = async (
  taskRequest: TaskRequest
): Promise<{ response: Response; tokenExpired: boolean }> => {
  return await apiFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(taskRequest),
  });
};

//タスクを編集
export const updateTask = async (
  task: Task
): Promise<{ response: Response; tokenExpired: boolean }> => {
  return await apiFetch(`/api/tasks/update/${task.id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
};

//タスクを削除
export const deleteTask = async (
  taskId: string
): Promise<{ response: Response; tokenExpired: boolean }> => {
  return await apiFetch(`/api/tasks/${taskId}`, { method: "DELETE" });
};

//完了タスクをすべて削除
export const deleteCompletedTasks = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/complete", { method: "DELETE" });
};

//usernameを取得
export const fetchUser = async (): Promise<{
  response: Response;
  tokenExpired: boolean;
}> => {
  return await apiFetch("/api/tasks/user", { method: "GET" });
};
