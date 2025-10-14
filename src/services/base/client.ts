import axios, { type AxiosRequestConfig } from 'axios'

// 基本となるAxiosクライアントを作る関数
export const createBaseClient = (config: AxiosRequestConfig) => {
  // axios.create(...) で、毎回同じ設定を使える専用クライアントを作成
  const client = axios.create(config)

  return client
}
