import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Box, Button, Input, VStack, HStack, Text, Heading, Flex, Spacer, Center } from "@chakra-ui/react";

const socket = io("http://localhost:3000");
//const socket = io("https://chat-backend-e2y1.onrender.com");

export default function ChatWindow({ username }) {
  const [currentRoom, setCurrentRoom] = useState("room1");
  const [rooms] = useState(["room1"]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!username) return;

    socket.emit("set username", { username, room: currentRoom });

    socket.on("chat message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("user joined", (msg) =>
      setMessages((prev) => [...prev, { systemMessage: msg.systemMessage, username: msg.username, time: msg.time }])
    );
    socket.on("user left", (msg) =>
      setMessages((prev) => [...prev, { systemMessage: msg.systemMessage, username: msg.username, time: msg.time }])
    );

    return () => {
      socket.off("chat message");
      socket.off("user joined");
      socket.off("user left");
    };
  }, [username, currentRoom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", { username, room: currentRoom, message });
      setMessage("");
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      <Center bg="green.500" color="white" py={4} fontSize="2xl" fontWeight="bold">
        PalZone
      </Center>

      <Flex flex={1} mt={4}>
        {/* Rooms Panel */}
        <Box w="200px" p={4} borderRight="1px solid gray">
          <Heading size="md" mb={4}>
            Rooms
          </Heading>
          <VStack align="stretch" spacing={2}>
            {rooms.map((room) => (
              <Box
                key={room}
                p={2}
                bg={currentRoom === room ? "green.100" : "gray.100"}
                borderRadius="md"
                cursor="pointer"
                onClick={() => setCurrentRoom(room)}
              >
                {room}
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Chat Body */}
        <Flex direction="column" flex={1} p={4}>
          <Heading size="md" mb={2}>
            Room: {currentRoom}
          </Heading>

          <Box flex={1} overflowY="auto" p={4} bg="gray.50" borderRadius="md" mb={2}>
            {messages.map((msg, i) => {
              const isCurrentUser = msg.username === username;
              if (msg.systemMessage) {
                return (
                  <Text key={i} color="gray.500" textAlign="center" mb={2}>
                    [{msg.time}] {msg.username} {msg.systemMessage}
                  </Text>
                );
              }
              return (
                <Flex key={i} justify={isCurrentUser ? "flex-end" : "flex-start"} mb={2}>
                  <Box
                    bg={isCurrentUser ? "green.500" : "gray.300"}
                    color={isCurrentUser ? "white" : "black"}
                    p={2}
                    borderRadius="md"
                    maxW="60%"
                    wordBreak="break-word"
                  >
                    {!isCurrentUser && (
                      <Text fontSize="xs" fontWeight="bold">
                        {msg.username}
                      </Text>
                    )}
                    {msg.message}
                    <Text fontSize="xs" textAlign="right" opacity={0.7}>
                      {msg.time}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          <form onSubmit={handleSendMessage}>
            <HStack spacing={2}>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button colorScheme="green" type="submit">
                Send
              </Button>
            </HStack>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}
