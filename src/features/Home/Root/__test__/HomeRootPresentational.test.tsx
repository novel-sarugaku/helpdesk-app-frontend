import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { HomeRootPresentational } from '@/features/Home/Root/HomeRootPresentational'

describe('HomeRootPresentational', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<HomeRootPresentational />)

      expect(screen.getByText('社内向けヘルプデスクアプリ作成')).toBeInTheDocument()
    })
  })
})
