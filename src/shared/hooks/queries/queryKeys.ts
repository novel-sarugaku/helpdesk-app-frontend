// sharedに他のQueryKeyが増えた場合このファイルにまとめる
// 例：
// export const userAccount = {
//   all: ['user'] as const,
//   show: ['user', 'show'] as const,
// }

export const healthcheckAuth = {
  checkAuth: ['checkAuth'] as const,
}
