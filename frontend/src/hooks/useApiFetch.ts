import React from "react";
import { useRouter } from "next/navigation";

export const useApiFetch = () => {
  const router = useRouter();
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    //トークンを取得
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    //headerとbodyを作成
    const authOptions: RequestInit = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //サーバにリクエスト
    let response = await fetch(url, authOptions);

    //アクセストークンが無効でリフレッシュを行う
    if (response.status === 403 || (response.status === 401 && refreshToken)) {
      const RefreshResoponse = await fetch(
        "http://localhost:8080/api/auth/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );
      //リトライ再度リクエスト
      if (RefreshResoponse.ok) {
        const data = await RefreshResoponse.json();
        localStorage.setItem("accessToken", data.accessToken);

        const retryOptions: RequestInit = {
          ...options,
          headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
          },
        };
        response = await fetch(url, retryOptions);
      } else {
        //リフレッシュトークンが有効期限切れ
        //localStoregeのトークンを削除
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        //ログイン画面に遷移
        router.push("/auth/login");
      }
    }
    return response;
  };
  return { apiFetch };
}
