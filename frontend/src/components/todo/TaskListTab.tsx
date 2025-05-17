"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskContext } from "@/context/TaskContext";
import { FilterTab } from "@/types";

export default function TaskListTab() {
  const { loadTasks, setFilter } = useTaskContext();

  const handleTabChange = (value: FilterTab) => {
    setFilter(value);
    loadTasks(value);
  };

  return (
    <TabsList className="flex space-x-2 bg-gray-100 rounded-lg p-2">
      <TabsTrigger
        value="all"
        className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
        onClick={() =>handleTabChange("all")}
      >
        すべて
      </TabsTrigger>
      <TabsTrigger
        value="active"
        className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
        onClick={() =>handleTabChange("active")}
      >
        未完了
      </TabsTrigger>
      <TabsTrigger
        value="completed"
        className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black  mr-0 cursor-pointer"
        onClick={() =>handleTabChange("completed")}
      >
        完了
      </TabsTrigger>
      <TabsTrigger
        value="overdue"
        className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black mr-0 cursor-pointer"
        onClick={() =>handleTabChange("overdue")}
      >
        期限切れ
      </TabsTrigger>
      <TabsTrigger
        value="upcoming"
        className="text-base font-mono text-gray-500 h-8 data-[state=active]:text-black  mr-0 cursor-pointer"
        onClick={() =>handleTabChange("upcoming")}
      >
        近日締め切り
      </TabsTrigger>
    </TabsList>
  );
}
