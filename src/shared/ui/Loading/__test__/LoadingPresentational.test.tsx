import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { customRender } from '@/tests/helpers/customRender'
import { LoadingPresentational } from '@/shared/ui/Loading/LoadingPresentational'

describe('LoadingPresentational', () => {
  describe('正常系', () => {
    it('表示されるべきテキストが表示される', () => {
      customRender(<LoadingPresentational />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })
})
