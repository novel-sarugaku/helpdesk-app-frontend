export const userAccountTypes = ['staff', 'supporter', 'admin'] as const
// userAccountTypes に書いた要素を型の候補にする
export type AccountType = (typeof userAccountTypes)[number] // [number]→ 'staff' | 'supporter' | 'admin'すべて。[0]→ 'staff'のみ
