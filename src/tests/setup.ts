// このファイルはテストが始まる前に一度だけ実行される
// ブラウザにはあるが、テスト用の擬似ブラウザ(jsdom)には無い機能を補うための設定などを行うファイル

import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import ResizeObserver from 'resize-observer-polyfill'

// ResizeObserver：特定の要素（divなど）の幅や高さが変わった際に教えてくれるもの
// テスト用の擬似ブラウザ(jsdom)には無いResizeObserverを、代わりのもの(ポリフィル)で埋める
global.ResizeObserver = ResizeObserver

// jsdomには無いwindow.matchMediaをテスト用のモックで用意する
Object.defineProperty(window, 'matchMedia', {
  writable: true, // テスト内でも書き換え可能にする
  // ↓matchMedia('…') が返す本物っぽい形のオブジェクトを返す
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// jsdomには無いelement.scrollTo(...) をテスト用のモックで用意する
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})
