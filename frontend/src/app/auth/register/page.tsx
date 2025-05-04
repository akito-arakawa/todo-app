"use client";

import React from "react";
import { set, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// zodバリデーションスキーマを定義
const schema = z
  .object({
    username: z.string().min(1, { message: "※ユーザー名は必須です" }),
    password: z
      .string()
      .min(6, { message: "※パスワードは6文字以上である必要があります" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "※パスワードが一致しません",
    path: ["confirmPassword"],
  });

// フォームのデータ型を定義
type RegisterFormData = z.infer<typeof schema>;

export default function register() {
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
      const response = await fetch("http://localhost:8080/api/auth/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: data.username,
          password: data.password,
        }),
      });
      console.log("response", response);
      // レスポンスの確認
      if (!response.ok) {
        const errorMessage = await response.text();
        // エラーメッセージを取得
        if (errorMessage.includes("既に存在")) {
          // ユーザー名がすでに存在する場合のエラーメッセージを表示
          setError("username", {
            type: "server",
            message: "※このユーザー名はすでに使用されています",
          });
        } else {
          throw new Error(errorMessage); // その他のエラーメッセージを表示
        }
        return;
      }

      alert("登録完了が完了しました。");
      router.push("/auth/login"); // 登録完了後にログインページにリダイレクト
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗しました。");
    }
  };

  return (
    <div className="colors">
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-blod mb-2 justify">新規登録</h2>
          <p className="mb-4 text-gray-500">Todoアプリのアカウントを作成する</p>
          <label className="block mb-2 font-semibold">ユーザー名</label>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("username")}
              placeholder="ユーザー名を入力"
            />
            {errors.username && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.username.message}
              </p>
            )}
          </div>
          <label className="block mb-2 font-semibold">パスワード</label>
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border rounded"
              {...register("password")}
              placeholder="パスワードを入力"
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <label className="block mb-2 font-semibold">パスワード（確認）</label>
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border rounded"
              {...register("confirmPassword")}
              placeholder="パスワード再入力"
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-500 mt-1 text-sm ">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            アカウント新規登録
          </button>
          <p className="mt-4 text-sm text-center">
            すでにアカウントをお持ちの場合は{" "}
            <a href="/auth/login" className="text-blue-500">
              ログイン
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
