const apiFetch = async (url: string, options: RequestInit = {}) => {
  //トークンを取得
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  //トークン切れflag
  let tokenExpired = false;
  //BASE_URL
  const BASE_URL = process.env.API_BASE_URL;
  
  const fullUrl = `${BASE_URL}${url}`;
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
  let response = await fetch(fullUrl, authOptions);

  //アクセストークンが無効でリフレッシュを行う
  if (response.status === 403 || (response.status === 401 && refreshToken)) {
    const RefreshResoponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
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
      response = await fetch(fullUrl, retryOptions);
    } else {
      tokenExpired = true;
    }
  }
  return { response, tokenExpired };
};

export { apiFetch };
