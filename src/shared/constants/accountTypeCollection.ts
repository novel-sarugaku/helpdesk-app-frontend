import { createListCollection } from '@chakra-ui/react'

export const accountTypeCollection = createListCollection({
  items: [
    { label: '社員', value: 'staff' },
    { label: 'サポート担当者', value: 'supporter' },
    { label: '管理者', value: 'admin' },
  ],
})
