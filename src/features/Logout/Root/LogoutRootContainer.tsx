import { useEffect } from 'react'
import { postLogout } from '@/services/internal/backend/v1/auth'

export const LogoutRootContainer = () => {
  // API疎通確認用

  useEffect(() => {
    postLogout()
      .then(() => {
        console.log('ログアウト成功！')
      })
      .catch(() => {
        console.error('ログアウト失敗！:')
      })
  }, [])

  return <h1>社内向けヘルプデスクアプリ ログイン画面</h1>
}
