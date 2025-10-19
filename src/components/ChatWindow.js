import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import { io } from "socket.io-client";
import axios from "axios";

// Connect to backend
const socket = io("http://localhost:3000");

export default function ChatWindow({ username }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState({}); // store messages per user

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, selectedUser]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/users");
        setUsers(res.data.filter((u) => u.username !== username));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [username]);

  // Socket listener for messages
  useEffect(() => {
    if (!username) return;

    socket.emit("set username", { username });

    const handleMessage = (msg) => {
      const isSelf = msg.from === username;  // ensure self messages are detected
      const chatUser = isSelf ? msg.to : msg.from;

      const formattedMsg = { ...msg, self: isSelf };

      setAllMessages(prev => {
        const userMsgs = prev[chatUser] || [];
        const exists = userMsgs.some(
          m => m.from === formattedMsg.from &&
            m.to === formattedMsg.to &&
            m.message === formattedMsg.message &&
            m.time === formattedMsg.time
        );
        if (exists) return prev;

        return {
          ...prev,
          [chatUser]: [...userMsgs, formattedMsg]
        };
      });
    };


    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [username]);

  // Select a user to chat
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    socket.emit("join chat", { fromUser: username, toUser: user });
  };

  // Send message
  const handleSendMessage = () => {
    if (!message || !selectedUser) return;

    const msgData = {
      fromUser: username,
      toUser: selectedUser,
      message,
      time: new Date().toLocaleTimeString()
    };

    // // Mark as self for local display
    // const selfMsg = { ...msgData, from: username, to: selectedUser, self: true };

    // // Update local chat immediately
    // setAllMessages(prev => ({
    //   ...prev,
    //   [selectedUser]: [...(prev[selectedUser] || []), selfMsg],
    // }));


    socket.emit("chat message", msgData);
    setMessage(""); // clear input
  };

  // Messages for the selected user
  const messages = selectedUser ? allMessages[selectedUser] || [] : [];

  return (
    <Flex height="100vh" direction="column">
      {/* Banner */}
      <Box bg="green.400" p={4} color="white" fontWeight="bold" fontSize="xl" textAlign="center">
        PalZone
      </Box>

      <Flex flex="1">
        {/* Left Panel */}
        <VStack w="200px" borderRight="1px solid #ccc" p={4} align="stretch" spacing={2}>
          <Text fontWeight="bold">Users</Text>
          {users.map((u) => (
            <Box
              key={u.username}
              p={2}
              bg={selectedUser === u.username ? "green.200" : "gray.100"}
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleSelectUser(u.username)}
            >
              {u.username}
            </Box>
          ))}
        </VStack>

        {/* Chat Body */}
        <Flex flex="1" direction="column" p={4}>
          <Text fontWeight="bold" mb={2}>
            Chat with: {selectedUser || "Select a user"}
          </Text>

          <Box flex="1" border="1px solid #b45151ff" borderRadius="md" p={4} overflowY="auto" backgroundColor="gray.600">
            {messages.map((msg, idx) => (
              <Flex
                key={idx}
                justify={msg.from === username ? "flex-end" : "flex-start"} // 👈 aligns right or left
                mb={3}
              >
                <Box
                  bg={msg.from === username ? "#DCF8C6" : "#FFFFFF"} // WhatsApp-style colors
                  color="black"
                  px={4}
                  py={2}
                  borderRadius={
                    msg.from === username
                      ? "20px 20px 0 20px" // right-side bubble shape
                      : "20px 20px 20px 0" // left-side bubble shape
                  }
                  maxW="60%"
                  boxShadow="0 1px 2px rgba(0,0,0,0.2)"
                >
                  <Text fontSize="md">{msg.message}</Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textAlign="right"
                    mt={1}
                  >
                    {msg.time}
                  </Text>
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <HStack mt={2}>
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
      </Flex>
    </Flex>
  );
}
