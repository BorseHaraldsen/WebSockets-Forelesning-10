import { useState } from "react";

export function Application() {
  const [messages, setMessages] = useState(["hello", "Everybody! : )"]);

  return (
    <>
      <header>
        <h1>Chat Application</h1>
      </header>

      <main>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </main>

      <footer>
        <input autoFocus />
        <button>Chat</button>
      </footer>
    </>
  );
}
