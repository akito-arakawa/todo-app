import React from "react";
import { Button } from "@/components/ui/button";
import Logout from "@/components/icon/logout";

interface TaskHeaderPorps {
  userName: string;
  handleLogout: () => void;
}

export default function TaskHeader({
  userName,
  handleLogout,
}: TaskHeaderPorps) {
  return (
    <header className="bg-blue-600 dark:bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl md:text-2xl font-bold">Todoアプリ</h1>
          <p className="text-sm text-blue-100 hidden md:block">
            {`こんにちは${userName}さん`}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-sm font-medium h-10 px-4 py-3"
            onClick={handleLogout}
          >
            <Logout />
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
}
