import { Box, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <>
      <Box p={4} zIndex='100px' borderBottom='1px solid' borderColor='gray.200'>
        <Link to={'/'} data-testid='home-link'>
          <Heading size='2xl' pl='100px' color='gray.500'>
            NOVEL HELPDESK
          </Heading>
        </Link>
      </Box>
    </>
  )
}
