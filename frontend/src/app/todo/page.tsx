"use client";

import React from "react";
import TaskHeader from "@/components/todo/TaskHeader";
import TaskFooter from "@/components/todo/TaskFooter";
import TaskMain from "@/components/todo/TaskMain";
import { TaskProvider } from "@/context/TaskContext";

export default function page() {
  return (
    <TaskProvider>
      <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-blue-900">
        <TaskHeader />
        <TaskMain />
        <TaskFooter />
      </div>
    </TaskProvider>
  );
}
