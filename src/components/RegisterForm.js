import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Center,
} from "@chakra-ui/react";

export default function RegisterForm({ onRegistered }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user" // ✅ default role for normal users
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccessMsg("Successfully registered! Please proceed to Login.");
      setErrorMsg("");
      setIsRegistered(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
      setSuccessMsg("");
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
            Register
          </Heading>

          {successMsg && (
            <Text mb={4} color="green.500" textAlign="center">
              {successMsg}{" "}
              <Text
                as="span"
                color="blue.500"
                cursor="pointer"
                onClick={onRegistered}
                textDecoration="underline"
              >
                Login
              </Text>
            </Text>
          )}

          {errorMsg && (
            <Text mb={4} color="red.500" textAlign="center">
              {errorMsg}
            </Text>
          )}

          {!isRegistered && (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} isRequired />
                <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} isRequired />
                <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} isRequired />
                <Input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} isRequired />
                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} isRequired />
                <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} isRequired />
                <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} isRequired />

                <Button type="submit" colorScheme="green" w="full">
                  Register
                </Button>
              </VStack>
            </form>
          )}
        </Box>
      </Center>
    </Box>
  );
}
