import { Container, Text, Box, Button, Textarea, Stack } from '@chakra-ui/react'

import { type CreateTicketCommentRequest } from '@/models/api/internal/backend/v1/request/ticket'

interface CreateTicketCommentFormCardProps {
  handleCreateTicketComment: (comment: CreateTicketCommentRequest) => Promise<void>
}

export const CreateTicketCommentFormCard = ({
  handleCreateTicketComment,
}: CreateTicketCommentFormCardProps) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // デフォルトのフォーム送信を防止

    const form = event.currentTarget // 今送信されたフォームを取り出す

    const formData = new FormData(event.target as HTMLFormElement)
    const commentData = formData.get('comment') as string

    try {
      await handleCreateTicketComment({
        comment: commentData,
      })
      form.reset() // 成功したらコメント欄をクリア
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Container my={10}>
        <Text color='gray.500' fontWeight='bold' mb={2}>
          質疑応答
        </Text>
        <form
          // フォームが送信されたら、React が event を渡してこの関数を呼ぶ
          onSubmit={(event) => {
            void handleSubmit(event)
          }}
        >
          <Box borderWidth='1px' borderColor='gray.300' borderRadius='xl' ml={8}>
            <Stack gap={0}>
              <Textarea
                required
                rows={3}
                border='none'
                _focus={{ outline: 'none' }} // フォーカス時の輪郭線を消す
                color='gray.500'
                name='comment'
              />

              <Box textAlign='end' borderTop={'solid 1px'} borderColor='gray.300' py={2} pr={9}>
                <Button
                  type='submit'
                  fontWeight='bold'
                  bgColor='green.400'
                  w='15%'
                  borderRadius='xl'
                >
                  送信
                </Button>
              </Box>
            </Stack>
          </Box>
        </form>
      </Container>
    </>
  )
}
