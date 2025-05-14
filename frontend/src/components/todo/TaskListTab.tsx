import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskListTabProps {
  allTask: (e?: React.FormEvent) => void;
  activeTask: (e?: React.FormEvent) => void;
  completeTask: (e?: React.FormEvent) => void;
  overdueTask: (e?: React.FormEvent) => void;
  upcomingTask: (e?: React.FormEvent) => void;
}

export default function TaskListTab({
  allTask,
  activeTask,
  completeTask,
  overdueTask,
  upcomingTask,
}: TaskListTabProps) {
  return (
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
  );
}
