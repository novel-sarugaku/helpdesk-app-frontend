import { Container, Text, Table, HStack } from '@chakra-ui/react'

import { accountTypeToJa } from '@/shared/logic/format/labelFormatters'
import { CreateAccountDialogCard } from '@/features/Admin/Account/ui/AccountCreateDialogCard/CreateAccountDialogCard'
import { type GetAccountResponseItem } from '@/models/api/internal/backend/v1/response/account'
import { type CreateAccountRequest } from '@/models/api/internal/backend/v1/request/account'

interface AccountTableCardProps {
  allAccountsList: GetAccountResponseItem[]
  handleCreateAccount: (request: CreateAccountRequest) => Promise<void>
  isDialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
  formError: string | null
  setFormError: React.Dispatch<React.SetStateAction<string | null>>
}

export const AccountTableCard = ({
  allAccountsList,
  handleCreateAccount,
  isDialogOpen,
  onDialogOpenChange,
  formError,
  setFormError,
}: AccountTableCardProps) => {
  return (
    <>
      <Container my={9}>
        <HStack mb={5}>
          <Text color='gray.600' fontSize='lg' fontWeight='bold'>
            Account 一覧
          </Text>
          <CreateAccountDialogCard
            handleCreateAccount={handleCreateAccount}
            isDialogOpen={isDialogOpen}
            onDialogOpenChange={onDialogOpenChange}
            formError={formError}
            setFormError={setFormError}
          />
        </HStack>

        <Table.Root>
          <Table.Header>
            <Table.Row bg={'gray.100'}>
              <Table.ColumnHeader fontWeight={'bold'} color={'gray.600'}>
                表示名
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight={'bold'} color={'gray.600'}>
                メールアドレス
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight={'bold'} color={'gray.600'}>
                アカウント種別
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allAccountsList
              .filter((account) => account.account_type !== 'admin')
              .map((account) => (
                <Table.Row key={account.id}>
                  <Table.Cell>{account.name}</Table.Cell>
                  <Table.Cell>{account.email}</Table.Cell>
                  <Table.Cell>{accountTypeToJa(account.account_type)}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Container>
    </>
  )
}
