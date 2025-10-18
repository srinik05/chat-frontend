import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Input, VStack, Heading, Text, Center } from "@chakra-ui/react";

export default function LoginForm({ onLoginSuccess }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { loginId, password });
      //const res = await axios.post("https://chat-backend-e2y1.onrender.com/api/auth/login", { loginId, password });
      setMessage(res.data.message);
      onLoginSuccess(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Center bg="green.500" color="white" py={6} fontSize="2xl" fontWeight="bold">
        PalZone
      </Center>

      <Center mt={10}>
        <Box bg="white" p={10} rounded="lg" shadow="lg" w={["90%", "400px"]}>
          <Heading mb={6} textAlign="center" size="lg">
            Login
          </Heading>

          {message && (
            <Text mb={4} color={message.includes("failed") ? "red.500" : "green.500"} textAlign="center">
              {message}
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input type="text" placeholder="Username / Email / Phone" value={loginId} onChange={(e) => setLoginId(e.target.value)} isRequired />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} isRequired />
              <Button type="submit" colorScheme="green" w="full">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </Box>
  );
}
