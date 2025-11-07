import {
  Button,
  Dialog,
  Field,
  Portal,
  Stack,
  Box,
  Text,
  Icon,
  HStack,
  Textarea,
  RadioGroup,
} from '@chakra-ui/react'
import { FaCirclePlus } from 'react-icons/fa6'
import { publicationCollection } from '@/shared/constants/publicationOptions'
import { type CreateTicketRequest } from '@/models/api/internal/backend/v1/request/ticket'

interface TicketCreateDialogCardProps {
  handleCreateTicket: (request: CreateTicketRequest) => Promise<void>
  isDialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
}

export const TicketCreateDialogCard = ({
  handleCreateTicket,
  isDialogOpen,
  onDialogOpenChange,
}: TicketCreateDialogCardProps) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // デフォルトのフォーム送信を防止

    const formData = new FormData(event.target as HTMLFormElement)
    const titleData = formData.get('title') as string
    const isPublicStringData = formData.get('is_public') as string // .get()の戻り値は FormDataEntryValue | null。FormDataEntryValue は string か File のどちらか
    const descriptionData = formData.get('description') as string
    const isPublicData = isPublicStringData === 'true' // isPublicStringData が 'true'なら isPublicData は true、そうでなければ false

    void handleCreateTicket({
      title: titleData,
      is_public: isPublicData,
      description: descriptionData,
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
            <Text color='gray.500'>ADD</Text>
          </Button>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner placeItems='center'>
            <Dialog.Content borderRadius='4xl' maxW='60%'>
              <Dialog.Header color='gray.600'>
                <Dialog.Title>Ticket 新規登録</Dialog.Title>
              </Dialog.Header>

              <form onSubmit={handleSubmit}>
                <Dialog.Body px={12} pb={10}>
                  <Stack gap={5}>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='60px'>
                          公開設定
                        </Field.Label>
                        <RadioGroup.Root defaultValue='true' name='is_public'>
                          <HStack gap='6'>
                            {publicationCollection.map((item) => (
                              <RadioGroup.Item
                                key={item.value}
                                value={item.value}
                                justifyContent='center'
                                minH={9}
                                minW='100px'
                                borderWidth='1px'
                                borderColor='gray.400'
                                borderRadius='xl'
                                // 選ばれているときだけ枠線を緑にする
                                // css={{ ... }} → ChakraUI v3 で見た目の指定をする場所
                                // & → このコンポーネント自身を示す（例：&:hover なら「この要素がホバーされたとき」）。[data-state=checked] → ラジオが選択された状態を表す属性
                                css={{
                                  '&[data-state=checked]': {
                                    borderColor: 'green.500',
                                  },
                                }}
                              >
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                              </RadioGroup.Item>
                            ))}
                          </HStack>
                        </RadioGroup.Root>
                      </HStack>
                    </Field.Root>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='60px'>
                          タイトル
                        </Field.Label>
                        <Textarea
                          required
                          borderColor='gray.400'
                          rows={1}
                          borderRadius='xl'
                          name='title'
                          maxLength={255}
                          placeholder='最大255文字まで入力可能です'
                        />
                      </HStack>
                    </Field.Root>
                    <Field.Root>
                      <HStack w='full'>
                        <Field.Label color='gray.600' fontWeight='bold' minW='60px'>
                          詳細
                        </Field.Label>
                        <Textarea
                          required
                          borderColor='gray.400'
                          rows={3}
                          borderRadius='xl'
                          name='description'
                        />
                      </HStack>
                    </Field.Root>
                  </Stack>

                  <Box pt={7} display='flex' justifyContent='center'>
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
                      送信
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
