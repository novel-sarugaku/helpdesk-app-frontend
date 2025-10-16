import { Box, Heading, HStack, Spacer, Container } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  logout: () => Promise<void>
}

export const Header = ({ logout }: HeaderProps) => {
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
