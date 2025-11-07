import { type PublicationType } from '@/models/constants/publicationType'

export const publicationLabelList = [
  { label: '公開', value: 'public' },
  { label: '非公開', value: 'private' },
] as { label: string; value: PublicationType }[]
