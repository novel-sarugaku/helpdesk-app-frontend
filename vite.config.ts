// 'vite'のdefineConfig：Vite用の設定を定義するための関数  mergeConfig：設定をマージ（くっつける）するための関数
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
// 'vitest/config'のdefineConfig：Vitest用の設定を定義する関数
import { defineConfig as defineVitestConfig } from 'vitest/config'
// ViteでReactを動かすためのプラグイン
import react from '@vitejs/plugin-react-swc'
// TypeScriptのpaths設定をViteが理解できるようにするプラグイン
import tsconfigPaths from 'vite-tsconfig-paths'

// Vite の設定を作成
const viteConfig = defineViteConfig({
  plugins: [react(), tsconfigPaths()], // プラグインとして react() と tsconfigPaths() を有効化
})

// Vitest の設定を作成
const vitestConfig = defineVitestConfig({
  test: {
    globals: true, // describe, it, expectなどを毎回importせずに使えるようにする。
    environment: 'jsdom', // ブラウザのような環境を提供する
    setupFiles: './src/tests/setup.ts', // テストが始まる前に読み込む初期設定ファイルを指定）
  },
})

// Viteの設定とVitestの設定を合体させて、ひとつの設定ファイルとしてエクスポート。これにより、ViteとVitestの両方がこの設定ファイルを参照できるようになる。
export default mergeConfig(viteConfig, vitestConfig)
