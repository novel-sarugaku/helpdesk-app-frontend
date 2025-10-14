import { useEffect } from 'react'
import { postLogin } from '@/services/internal/backend/v1/auth'

export const LoginRootContainer = () => {
  // API疎通確認用
  useEffect(() => {
    postLogin({ email: 'admin@example.com', password: 'P@ssw0rd' })
      .then(() => {
        console.log('ログイン成功！')
      })
      .catch(() => {
        console.error('ログイン失敗！')
      })
  }, [])

  return <h1>社内向けヘルプデスクアプリ ログイン画面</h1>
}
