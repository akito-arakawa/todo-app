"use client";
import React from "react";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// zodバリデーションスキーマを定義
const schema = z.object({
  username: z.string(),
  password: z.string(),
});

// フォームのデータ型を定義
type RegisterFormData = z.infer<typeof schema>;

export default function login() {
  const router = useRouter();
  const {
    register, // フォームの入力値を管理するための関数
    handleSubmit, // フォームの送信を処理するための関数
    setError, // フォームのエラーを設定するための関数
    formState: { errors }, //バリデーションエラーを管理するためのオブジェクト
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit", // フォームのバリデーションをsubmit時に行う
    reValidateMode: "onSubmit", // submit時に再バリデーションを行う
  });

  // フォームの送信処理
  const onSubmit = async (data: RegisterFormData) => {
    //APIにデータを送信
    try {
      const response = await fetch("https://spring-backend-czdm.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        // エラーメッセージを取得
        if (
          errorMessage.includes("ログイン失敗")
        ) {
          //ユーザー名またはパスワードが間違っている場合のエラーメッセージを表示
          setError("username", {
            type: "server",
            message: "※ユーザー名またはパスワードが間違っています",
          });

        } else {
          throw new Error(errorMessage); // その他のエラーメッセージを表示
        }
        return;
      } else {
        const result = await response.json();
        const access_token = result.accessToken; // アクセストークンを取得
        const refresh_token = result.refreshToken; // リフレッシュトークンを取得
        localStorage.setItem("accessToken", access_token); // アクセストークンをローカルストレージに保存
        localStorage.setItem("refreshToken", refresh_token); // リフレッシュトークンをローカルストレージに保存
        
      }
      // ログイン成功時の処理
      router.push("https://spring-backend-czdm.onrender.com/todo"); // ログイン成功後に遷移するページ
    } catch (error) {
      console.error("Error:", error);
      // エラーハンドリング
      alert("ログインに失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="colors">
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-2">ログイン</h2>
          <p className="mb-4 text-gray-500">Todoアプリにログインする</p>

          <label className="block mb-2 font-semibold">ユーザー名</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            {...register("username")}
            placeholder="ユーザー名を入力"
          />

          <label className="block mb-2 font-semibold">パスワード</label>
          <input
            type="password"
            className="w-full p-2 mb-4 border rounded"
            {...register("password")}
            placeholder="パスワードを入力"
          />
          {errors.username && (
            <p className="text-red-500 mb-2 text-sm">
              {errors.username.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            ログイン
          </button>

          <p className="mt-4 text-sm text-center">
            アカウントをお持ちでない場合は{" "}
            <a href="/auth/register" className="text-blue-500">
              新規登録
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
