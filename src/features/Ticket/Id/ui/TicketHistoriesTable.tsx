import { Container, Table, Text } from '@chakra-ui/react'

import { formatDateStringToYearMonthDayAndTime } from '@/shared/logic/format/dateFormatters'
import { type GetTicketHistoryResponseItem } from '@/models/api/internal/backend/v1/response/ticket'

interface TicketHistoriesTableProps {
  ticketHistories: GetTicketHistoryResponseItem[]
}

export const TicketHistoriesTable = ({ ticketHistories }: TicketHistoriesTableProps) => {
  return (
    <>
      <Container my={10}>
        <Table.Root borderTop='solid 1px' borderColor='gray.200'>
          <Table.Body>
            {ticketHistories.length === 0 ? (
              <Table.Row>
                <Table.Cell>
                  <Text color='gray.500'>対応履歴はありません</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              ticketHistories.map((item) => (
                <Table.Row key={item.id}>
                  {/* whiteSpace='pre-line' → \n は改行として反映 */}
                  <Table.Cell w='120px' whiteSpace='pre-line' textAlign={'center'}>
                    <Text color='gray.500'>
                      {formatDateStringToYearMonthDayAndTime(item.created_at)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell w='200px' textAlign={'center'}>
                    <Text color='gray.500'>{item.action_user}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign={'start'}>
                    <Text color='gray.500'>{item.action_description}</Text>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Container>
    </>
  )
}
