import { Fragment } from 'react'
import { Container, Text, Box, HStack, VStack, Textarea } from '@chakra-ui/react'

import { Header } from '@/components/organisms/Header'
import { formatDateStringToYearMonthDaySlash } from '@/shared/logic/format/dateFormatters'
import { ticketStatusTypeLabelList } from '@/shared/constants/ticketStatusTypeLabel'
import { type GetTicketDetailResponse } from '@/models/api/internal/backend/v1/response/ticket'
import { type AccountType } from '@/models/constants/accountType'

interface TicketIdPresentationalProps {
  ticketData: GetTicketDetailResponse
  userAccountType: AccountType
}

export const TicketIdPresentational = ({
  ticketData,
  userAccountType,
}: TicketIdPresentationalProps) => {
  return (
    <>
      <Header userAccountType={userAccountType} />

      <Container my={9}>
        <Text color='gray.500' fontWeight='bold' fontSize='xl'>
          ID：{ticketData.id}
        </Text>

        <Box ml={5} mt={5}>
          <VStack align='start'>
            <HStack w='100%'>
              <Text color='gray.500' fontWeight='bold' w='100px'>
                質問日
              </Text>
              <Box
                ml={2}
                p={2}
                border='solid 1px'
                borderColor='gray.300'
                borderRadius='10px'
                bg='gray.200'
                w='19%'
              >
                <Text color='gray.500' fontSize='sm'>
                  {formatDateStringToYearMonthDaySlash(ticketData.created_at)}
                </Text>
              </Box>
            </HStack>

            <HStack>
              <Text color='gray.500' fontWeight='bold' w='100px'>
                公開設定
              </Text>
              <Box
                ml={2}
                p={2}
                border={ticketData.is_public ? 'solid 2px' : 'solid 1px'}
                borderColor={ticketData.is_public ? 'green.400' : 'gray.300'}
                borderRadius='10px'
                bg='gray.200'
                w='120px'
                textAlign='center'
                data-testid='public-box'
                data-active={ticketData.is_public}
              >
                <Text color='gray.500' fontSize='sm'>
                  公開
                </Text>
              </Box>
              <Box
                ml={2}
                p={2}
                border={!ticketData.is_public ? 'solid 2px' : 'solid 1px'}
                borderColor={!ticketData.is_public ? 'green.400' : 'gray.300'}
                borderRadius='10px'
                bg='gray.200'
                w='120px'
                textAlign='center'
                data-testid='private-box'
                data-active={!ticketData.is_public}
              >
                <Text color='gray.500' fontSize='sm'>
                  非公開
                </Text>
              </Box>
            </HStack>

            <HStack w='100%' align='start'>
              <Text color='gray.500' fontWeight='bold' w='100px'>
                タイトル
              </Text>
              <Box
                ml={2}
                p={2}
                border='solid 1px'
                borderColor='gray.300'
                borderRadius='10px'
                bg='gray.200'
                flex='1'
              >
                <Textarea
                  value={ticketData.title}
                  readOnly
                  color='gray.500'
                  fontSize='sm'
                  rows={3}
                  borderColor='gray.200'
                  _focus={{ outline: 'none' }} // フォーカス時の輪郭線を消す
                />
              </Box>
            </HStack>

            <HStack w='100%' align='start'>
              <Text color='gray.500' fontWeight='bold' w='100px'>
                詳細
              </Text>
              <Box
                ml={2}
                p={2}
                border='solid 1px'
                borderColor='gray.300'
                borderRadius='10px'
                bg='gray.200'
                flex='1'
              >
                <Textarea
                  value={ticketData.description}
                  readOnly
                  color='gray.500'
                  fontSize='sm'
                  rows={6}
                  borderColor='gray.200'
                  _focus={{ outline: 'none' }} // フォーカス時の輪郭線を消す
                />
              </Box>
            </HStack>

            <VStack mt={10} align='start'>
              <Text color='gray.500' fontWeight='bold' minW='60px'>
                ステータス
              </Text>
              <Box ml={2} py={2} px={14} borderRadius='15px' bg='gray.100'>
                <HStack w='100%' flexWrap='wrap' gap={0}>
                  {/* 配列.map((要素, インデックス) => {}) */}
                  {ticketStatusTypeLabelList.map(({ label, value }, index) => (
                    // Fragment → ステータスBox＋棒 をひとかたまりにする見えない親
                    // DOMを増やしたくないけど複数要素をグループ化したい時に使う。
                    // 他の要素だとデフォルトで余白などプロパティがついてしまうため、つけたくない時は便利（レイアウトに影響を与えない）
                    <Fragment key={value}>
                      <Box
                        p={2}
                        my={1}
                        borderRadius='10px'
                        border={ticketData.status == value ? 'solid 2px' : 'solid 1px'}
                        borderColor={ticketData.status == value ? 'green.400' : 'gray.300'}
                        bg={ticketData.status == value ? 'white' : 'gray.300'}
                        textAlign='center'
                        w='230px'
                        data-testid={`status-${value}`}
                        data-active={ticketData.status === value}
                      >
                        <Text color={'gray.500'} fontSize={'sm'}>
                          {label}
                        </Text>
                      </Box>
                      {/* 最後の要素の後ろには棒を出さない */}
                      {/* index → 今、何番目を処理しているか */}
                      {index < ticketStatusTypeLabelList.length - 1 && (
                        <Box h='2px' w='20px' bg='gray.300' />
                      )}
                    </Fragment>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </>
  )
}
