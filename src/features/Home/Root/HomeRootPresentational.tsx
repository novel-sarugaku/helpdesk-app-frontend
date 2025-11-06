import { Container, Table, Text } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'

import { Header } from '@/components/organisms/Header'
import { formatDateStringToYearMonthDay } from '@/shared/logic/format/dateFormatters'
import { publicationTypeToJa, ticketStatusToJa } from '@/shared/logic/format/labelFormatters'
import { type AccountType } from '@/models/constants/accountType'
import { type GetTicketResponseItem } from '@/models/api/internal/backend/v1/response/ticket'

interface HomeRootPresentationalProps {
  userAccountType: AccountType
  allTicketsList: GetTicketResponseItem[]
}

const headerTitles = ['質問日', 'タイトル', '公開状況', 'ステータス', '質問者', 'サポート担当']

export const HomeRootPresentational = ({
  userAccountType,
  allTicketsList,
}: HomeRootPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />

      <Container my={9}>
        <Text mb={3} color='gray.500' fontSize='2xl' fontWeight='bold'>
          Ticket
        </Text>

        <Table.Root>
          <Table.Header>
            <Table.Row bg={'gray.100'}>
              {headerTitles.map((title) => (
                <Table.ColumnHeader key={title} fontWeight={'bold'} color={'gray.600'}>
                  {title}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allTicketsList.map((ticket) => (
              <Table.Row key={ticket.id}>
                <Table.Cell>{formatDateStringToYearMonthDay(ticket.created_at)}</Table.Cell>
                <Table.Cell>
                  <Link
                    variant='underline'
                    href={`/ticket/${String(ticket.id)}`}
                    colorPalette='teal'
                    data-testid='ticket-id-link'
                  >
                    {ticket.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{publicationTypeToJa(ticket.is_public)}</Table.Cell>
                <Table.Cell>{ticketStatusToJa(ticket.status)}</Table.Cell>
                <Table.Cell>{ticket.staff}</Table.Cell>
                <Table.Cell>{ticket.supporter}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Container>
    </>
  )
}
