import { Box, Heading, HStack, Spacer, Container, Show } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { useLogoutHandler } from '@/shared/hooks/handlers/useLogoutHandler'
import { type AccountType } from '@/models/constants/accountType'

interface HeaderProps {
  userAccountType: AccountType
}

export const Header = ({ userAccountType }: HeaderProps) => {
  const { logout } = useLogoutHandler()

  return (
    <>
      <Box p={4} zIndex='100px' borderBottom='1px solid' borderColor='gray.200'>
        <Container>
          <HStack>
            <Link to={'/'}>
              <Heading size='2xl' color='gray.500'>
                NOVEL HELPDESK
              </Heading>
            </Link>

            <Spacer />

            <Show when={userAccountType === 'admin'}>
              <Link to={'/admin/account'}>
                <Heading size='2xl' color='gray.500'>
                  Account
                </Heading>
              </Link>

              <Heading color='gray.500' mx={3}>
                |
              </Heading>
            </Show>

            <Link to={'/'}>
              <Heading size='2xl' color='gray.500'>
                Ticket
              </Heading>
            </Link>

            <Heading
              ml={9}
              size='2xl'
              color='gray.500'
              onClick={() => {
                void logout()
              }}
            >
              Logout
            </Heading>
          </HStack>
        </Container>
      </Box>
    </>
  )
}
