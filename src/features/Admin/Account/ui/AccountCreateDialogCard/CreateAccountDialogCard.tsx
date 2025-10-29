import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Box,
  Text,
  Icon,
  HStack,
  Select,
} from '@chakra-ui/react'
import { FaCirclePlus } from 'react-icons/fa6'
import { accountTypeCollection } from '@/shared/constants/accountTypeCollection'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'
import { type AccountType } from '@/models/constants/accountType'

interface CreateAccountDialogCardProps {
  handleCreateAccount: (request: CreateAccountRequest) => Promise<void>
  isDialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
  formError: string | null
  setFormError: React.Dispatch<React.SetStateAction<string | null>>
}

export const CreateAccountDialogCard = ({
  handleCreateAccount,
  isDialogOpen,
  onDialogOpenChange,
  formError,
  setFormError,
}: CreateAccountDialogCardProps) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // デフォルトのフォーム送信を防止

    const formData = new FormData(event.target as HTMLFormElement)
    const nameData = formData.get('name') as string
    const emailData = formData.get('email') as string
    const passwordData = formData.get('password') as string
    const accountTypeData = formData.get('account_type') as AccountType

    void handleCreateAccount({
      name: nameData,
      email: emailData,
      password: passwordData,
      account_type: accountTypeData,
    })
  }

  return (
    <>
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={({ open }) => {
          onDialogOpenChange(open)
        }}
      >
        <Dialog.Trigger asChild p={0} ml={3}>
          <Button bgColor='white' fontWeight='bold' gap='3px'>
            <Icon as={FaCirclePlus} color='green.400' data-testid='add-icon' />
            <Text color='gray.600'>ADD</Text>
          </Button>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner placeItems='center'>
            <Dialog.Content borderRadius='4xl'>
              <Dialog.Header color='gray.600'>
                <Dialog.Title>Account 新規登録</Dialog.Title>
                {formError && (
                  <Text mt={1} ml={3} fontSize={'sm'} color='red.500' role='alert'>
                    {formError}
                  </Text>
                )}
              </Dialog.Header>

              <form onSubmit={handleSubmit}>
                <Dialog.Body px={12} pb={10}>
                  <Stack gap={5}>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='50px'>
                          表示名
                        </Field.Label>
                        <Input
                          required //値を入力しない限りフォームを送信できない
                          type='string'
                          borderColor='gray.400'
                          borderRadius='xl'
                          name='name'
                        />
                      </HStack>
                    </Field.Root>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='50px'>
                          Email
                        </Field.Label>
                        <Input
                          required
                          type='email'
                          borderColor='gray.400'
                          borderRadius='xl'
                          name='email'
                          onChange={() => {
                            setFormError(null)
                          }}
                        />
                      </HStack>
                    </Field.Root>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='50px'>
                          Pass
                        </Field.Label>
                        <Input
                          required
                          type='string'
                          borderColor='gray.400'
                          borderRadius='xl'
                          pattern='(?=.*[A-Z])(?=.*\d).{8,}'
                          title='8文字以上・大文字と数字を各1文字以上含めてください'
                          name='password'
                        />
                      </HStack>
                    </Field.Root>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='50px'>
                          種別
                        </Field.Label>
                        <Select.Root
                          required
                          collection={accountTypeCollection}
                          name='account_type'
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger borderColor='gray.400' borderRadius='xl'>
                              <Select.ValueText placeholder='アカウントタイプを選択' />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>

                          <Select.Positioner>
                            <Select.Content>
                              {accountTypeCollection.items
                                .filter((account) => account.value !== 'admin')
                                .map((account) => (
                                  <Select.Item key={account.value} item={account}>
                                    <Select.ItemText>{account.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </HStack>
                    </Field.Root>
                  </Stack>

                  <Box pt={4} display='flex' justifyContent='center'>
                    <Dialog.ActionTrigger asChild>
                      <Button
                        color='gray.500'
                        fontWeight='bold'
                        bgColor='gray.200'
                        borderRadius='xl'
                        w='30%'
                        mr={7}
                      >
                        Cancel
                      </Button>
                    </Dialog.ActionTrigger>

                    <Button
                      type='submit'
                      fontWeight='bold'
                      bgColor='green.400'
                      w='30%'
                      borderRadius='xl'
                    >
                      登録
                    </Button>
                  </Box>
                </Dialog.Body>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
