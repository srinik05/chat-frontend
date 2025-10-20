import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Image,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { io } from "socket.io-client";
import axios from "axios";

//const socket = io("http://localhost:3000");
const socket = io("https://chat-backend-e2y1.onrender.com");

export default function ChatWindow({ username }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState({});
  //const [isOnline, setIsOnline] = useState(true); // dummy status for now
  const [isOnline] = useState(true); // dummy status for now

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Detect screen type
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //const res = await axios.get("http://localhost:3000/api/auth/users");
        const res = await axios.get("https://chat-backend-e2y1.onrender.com/api/auth/users");
        setUsers(res.data.filter((u) => u.username !== username));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [username]);

  useEffect(() => {
    if (!username) return;

    socket.emit("set username", { username });

    const handleMessage = (msg) => {
      const isSelf = msg.from === username;
      const chatUser = isSelf ? msg.to : msg.from;
      const formattedMsg = { ...msg, self: isSelf };

      setAllMessages((prev) => {
        const userMsgs = prev[chatUser] || [];
        const exists = userMsgs.some(
          (m) =>
            m.from === formattedMsg.from &&
            m.to === formattedMsg.to &&
            m.message === formattedMsg.message &&
            m.time === formattedMsg.time
        );
        if (exists) return prev;

        return {
          ...prev,
          [chatUser]: [...userMsgs, formattedMsg],
        };
      });
    };

    socket.on("chat message", handleMessage);
    return () => socket.off("chat message", handleMessage);
  }, [username]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    socket.emit("join chat", { fromUser: username, toUser: user });
  };

  const handleSendMessage = () => {
    if (!message || !selectedUser) return;
    const msgData = {
      fromUser: username,
      toUser: selectedUser,
      message,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("chat message", msgData);
    setMessage("");
  };

  const messages = selectedUser ? allMessages[selectedUser] || [] : [];

  return (
    <Flex height="100vh" direction="column">
      {/* Header */}
      <Box bg="green.400" p={4} color="white" fontWeight="bold" fontSize="xl" textAlign="center">
        PalZone
      </Box>

      <Flex flex="1" overflow="hidden">
        {/* User List (hide on mobile when chatting) */}
        {(!isMobile || !selectedUser) && (
          <VStack
            w={isMobile ? "100%" : "250px"}
            borderRight={isMobile ? "none" : "1px solid #ccc"}
            p={4}
            align="stretch"
            spacing={3}
            bg="gray.50"
          >
            <Text fontWeight="bold" fontSize="lg">
              Users
            </Text>
            {users.map((u) => (
              <HStack
                key={u.username}
                p={2}
                bg={selectedUser === u.username ? "green.600" : "white"}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "green.100" }}
                onClick={() => handleSelectUser(u.username)}
              >
                <Image
                  src={`https://ui-avatars.com/api/?name=${u.username}&background=random&size=32`}
                  alt={u.username}
                  boxSize="32px"
                  borderRadius="full"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{u.username}</Text>
                  {/* <Text fontSize="xs" color={isOnline ? "green.900" : "gray.600"}>
                    {isOnline ? "Online" : "Offline"}
                  </Text> */}
                </VStack>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Chat Window */}
        {(!isMobile || selectedUser) && (
          <Flex flex="1" direction="column" p={4} bg="gray.100">
            {/* Chat Header */}
            <HStack
              spacing={3}
              align="center"
              borderBottom="1px solid #ccc"
              pb={2}
              mb={2}
              justify="space-between"
            >
              <HStack spacing={3} align="center">
                {isMobile && (
                  <IconButton
                    icon={<ArrowBackIcon />}
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    aria-label="Back"
                  />
                )}
                <Image
                  src={`https://ui-avatars.com/api/?name=${selectedUser}&background=random&size=32`}
                  alt="avatar"
                  boxSize="40px"
                  borderRadius="full"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{selectedUser || "Select a user"}</Text>
                  <Text fontSize="xs" color={isOnline ? "green.500" : "gray.400"}>
                    {isOnline ? "Online" : "Offline"}
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* Messages */}
            <Box
              flex="1"
              border="1px solid #b45151ff"
              borderRadius="md"
              p={4}
              overflowY="auto"
              bg="gray.600"
            >
              {messages.map((msg, idx) => (
                <Flex
                  key={idx}
                  justify={msg.from === username ? "flex-end" : "flex-start"}
                  mb={3}
                >
                  <Box
                    bg={msg.from === username ? "#DCF8C6" : "#FFFFFF"}
                    color="black"
                    px={4}
                    py={2}
                    borderRadius={
                      msg.from === username
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0"
                    }
                    maxW="70%"
                    boxShadow="0 1px 2px rgba(0,0,0,0.2)"
                  >
                    <Text fontSize="md">{msg.message}</Text>
                    <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                      {msg.time}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <HStack mt={3}>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedUser}
              />
              <Button colorScheme="green" onClick={handleSendMessage} disabled={!selectedUser}>
                Send
              </Button>
            </HStack>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
