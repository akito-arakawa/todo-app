"use client";
import React from "react";
import { useState } from "react";

function login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="colors">
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <form className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-2">ログイン</h2>
          <p className="mb-4 text-gray-500">Todoアプリにログインする</p>

          <label className="block mb-2 font-semibold">ユーザー名</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
          />

          <label className="block mb-2 font-semibold">パスワード</label>
          <input
            type="password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            ログイン
          </button>

          <p className="mt-4 text-sm text-center">
            アカウントをお持ちでない場合は{" "}
            <a href="/register" className="text-blue-500">
              新規登録
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default login;
