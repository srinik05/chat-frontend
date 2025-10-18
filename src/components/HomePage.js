import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

export default function Home({ onSelect }) {
  return (
    <Box
      textAlign="center"
      mt="100px"
      px="4"
    >
      <Heading mb="4" fontSize="4xl">
        Welcome to PalZone 💬
      </Heading>
      <Text mb="8" fontSize="lg">
        Select an option to continue:
      </Text>

      <VStack spacing={4}>
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => onSelect("login")}
          width={{ base: "100%", sm: "200px" }}
        >
          Login
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => onSelect("register")}
          width={{ base: "100%", sm: "200px" }}
        >
          Register
        </Button>
      </VStack>
    </Box>
  );
}
