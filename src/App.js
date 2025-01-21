import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";

const Message = ({ text, sender, isLink }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb: 2,
        flexDirection: sender === "user" ? "row-reverse" : "row",
      }}
    >
      <Avatar
        sx={{
          bgcolor: sender === "user" ? "#1976d2" : "#bdbdbd",
          ml: sender === "user" ? 2 : 0,
          mr: sender === "user" ? 0 : 2,
        }}
      >
        {sender === "user" ? "U" : "C"}
      </Avatar>
      <Box
        sx={{
          maxWidth: "70%",
          p: 1.5,
          borderRadius: 2,
          bgcolor: sender === "user" ? "#e3f2fd" : "#f9f9f9",
          boxShadow: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        {isLink ? (
          <Button
            variant="contained"
            color="primary"
            href={text}
            target="_blank"
            download
            sx={{
              textTransform: "none",
              bgcolor: "#329bf0",
              ":hover": { bgcolor: "#42a5f5" },
            }}
          >
            Download Paper
          </Button>
        ) : (
          <Typography variant="body1" color="textPrimary">
            {text}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: userInput, sender: "user" },
    ]);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();

      const isLink =
        data.response.includes("http") &&
        (data.response.endsWith(".pdf") || data.response.endsWith(".docx"));

      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: "chatbot", isLink },
      ]);
    } catch (error) {
      console.error("Error fetching message:", error);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
      setUserInput("");
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
  }, [messages]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        bgcolor: "#f9fafb",
        borderRadius: 2,
        boxShadow: 3,
        padding: 3,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          College Resource Chatbot
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Your assistant for academic resources
        </Typography>
      </Box>

      <Paper
        elevation={3}
        ref={chatContainerRef}
        sx={{
          height: "60vh",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          p: 2,
          bgcolor: "#ffffff",
          borderRadius: 2,
          border: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Welcome to CRCBOT!!
          </Typography>
        </Box>
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={24} sx={{ color: "#1976d2" }} />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ ml: 2 }}
            >
              Chatbot is thinking...
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your query..."
          // placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          // sx={{
          //   bgcolor: "#ffffff",
          //   borderRadius: 2,
          //   border: " solid #e0e0e0",
          // }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{
            ml: 2,
            p: 1.5,
            borderRadius: 2,
            textTransform: "none",
            bgcolor: "#1976d2",
            ":hover": { bgcolor: "#1565c0" },
          }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default App;
