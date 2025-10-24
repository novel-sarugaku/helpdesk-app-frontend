import { Container, Text, Table } from '@chakra-ui/react'

import { accountTypeToJa } from '@/shared/utils/format/labelFormatters'
import { type GetAccountResponse } from '@/models/api/internal/backend/v1/response/account'

interface AccountTableCardProps {
  userAccountData: GetAccountResponse[]
}

export const AccountTableCard = ({ userAccountData }: AccountTableCardProps) => {
  return (
    <>
      <Container my={9}>
        <Text mb={5} color='gray.600' fontSize='lg' fontWeight='bold'>
          Account 一覧
        </Text>

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
            {userAccountData
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
