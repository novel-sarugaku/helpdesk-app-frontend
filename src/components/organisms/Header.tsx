import { Box, Heading, HStack, Spacer, Container } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Header = () => {
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
              <Heading size='2xl' pr='300px' color='gray.500'>
                Ticket
              </Heading>
            </Link>
          </HStack>
        </Container>
      </Box>
    </>
  )
}
