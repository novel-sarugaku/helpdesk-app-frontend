import { Box, Button, Field, Fieldset, HStack, Input, Alert } from '@chakra-ui/react'
import { type LoginRequest } from '@/models/api/internal/backend/v1/request/auth'

interface LoginRootPresentationalProps {
  login: (request: LoginRequest) => Promise<void>
  isError: boolean
}

export const LoginRootPresentational = ({ login, isError }: LoginRootPresentationalProps) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // ブラウザの自動送信（ページ遷移）を止める

    const form_data = new FormData(event.target as HTMLFormElement)
    const email_data = form_data.get('email') as string
    const password_data = form_data.get('password') as string

    void login({ email: email_data, password: password_data })
  }

  return (
    <>
      <Box minH='100vh' bg='gray.200' display='flex' alignItems='center' justifyContent='center'>
        <Fieldset.Root size='lg' maxW='sm' color='gray.600' bg='gray.100' borderRadius='20px' p={8}>
          <Fieldset.Content alignItems='center'>
            <Fieldset.Legend fontWeight='bold' color='gray.600' fontSize='xl'>
              NOVEL HELPDESK
            </Fieldset.Legend>
          </Fieldset.Content>

          <form onSubmit={handleSubmit}>
            <Fieldset.Content bg='white' borderRadius='20px' mt={3} p={6}>
              {isError && (
                <Alert.Root status='error'>
                  <Alert.Title>
                    ログインに失敗しました。
                    <br />
                    正しいIDとPassを入力してください。
                  </Alert.Title>
                </Alert.Root>
              )}
              <Field.Root alignItems='center'>
                <HStack>
                  <Field.Label minW='50px'>ID</Field.Label>
                  <Input
                    name='email'
                    type='email'
                    placeholder='user@example.com'
                    borderRadius='10px'
                  />
                </HStack>
              </Field.Root>

              <Field.Root alignItems='center'>
                <HStack>
                  <Field.Label minW='50px'>Pass</Field.Label>
                  <Input
                    name='password'
                    type='password'
                    placeholder='examplePassword123'
                    borderRadius='10px'
                  />
                </HStack>
              </Field.Root>

              <Field.Root alignItems='center'>
                <Button type='submit' bg='gray.500' borderRadius='10px' minW='100%'>
                  Login
                </Button>
              </Field.Root>
            </Fieldset.Content>
          </form>
        </Fieldset.Root>
      </Box>
    </>
  )
}
