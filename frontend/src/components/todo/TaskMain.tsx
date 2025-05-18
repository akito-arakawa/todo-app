"use client";
import { useTaskContext } from "@/context/TaskContext";
import React from "react";
import TaskForm from "./TaskForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TaskListTab from "./TaskListTab";
import TaskItem from "./TaskItem";
import { FilterTab, Task } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function TaskMain() {
  const { tasks, filter, setFilter, deleteCompleted } = useTaskContext();

  //完了をすべて削除するボタン管理
  const completedTaskCount = tasks.filter(
    (task: any) => task.status === "Complete"
  ).length;
  const comleted = completedTaskCount > 0;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          タスク管理
        </h1>
        <div className="w-full max-w-3xl space-y-6">
          <TaskForm />
          <div className="w-full max-w-3xl space-y-6">
            <Tabs
              className="w-full"
              value={filter}
              onValueChange={(value) => setFilter(value as FilterTab)}
            >
              <div className="flex justify-between">
                <TaskListTab />
                {comleted && (
                  <Button
                    type="button"
                    className="bg-red-400 hover:bg-red-500"
                    onClick={deleteCompleted}
                  >
                    完了を全て削除
                  </Button>
                )}
              </div>
              {/* タブごとの中身（例） */}
              <div className="mt-4">
                <TabsContent value={filter}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {tasks.length > 0 ? (
                      tasks.map((task: Task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TaskItem tasks={task} />
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500"
                      >
                        {filter === "all"
                          ? "タスクがありません"
                          : filter === "completed"
                          ? "完了したタスクがありません"
                          : filter === "active"
                          ? "未完了のタスクがありません"
                          : filter === "overdue"
                          ? "期限切れのタスクがありません"
                          : "近日締め切りのタスクがありません"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
