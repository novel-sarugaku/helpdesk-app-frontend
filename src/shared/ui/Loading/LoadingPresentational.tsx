import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

export const LoadingPresentational = () => {
  return (
    <>
      <Box minH='100vh' display='grid' placeItems='center'>
        <VStack colorPalette='teal'>
          <Spinner color='colorPalette.600' />
          <Text color='colorPalette.600'>Loading...</Text>
        </VStack>
      </Box>
    </>
  )
}
