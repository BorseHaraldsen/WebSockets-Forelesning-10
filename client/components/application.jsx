import { useEffect, useState } from "react";

export function Application() {
  const [username, setUsername] = useState();

  const [credentials, setCredentials] = useState();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ credentials }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to log in " + res.statusText);
    }
  }

  if (!username) {
    return (
      <>
        <form onSumbit={handleLogin}>
          Username:
          <input
            type="text"
            value={credentials}
            onChange={setCredentials(e.target.value)}
          />
          <button>Log In.</button>
        </form>
      </>
    );
  }

  return <ChatWindow />;
}

export function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [webSocket, setWebSocket] = useState();

  useEffect(() => {
    const webSocket = new WebSocket("ws://" + window.location.host);
    webSocket.onmessage = (event) => {
      console.log(event.data);
      setMessages((current) => [...current, event.data]);
    };
    setWebSocket(webSocket);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    webSocket.send(newMessage);

    setNewMessage("");
  }

  return (
    <>
      <header>
        <h1>Chat Application</h1>
      </header>

      <main>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </main>

      <footer>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button>Chat</button>
        </form>
      </footer>
    </>
  );
}
