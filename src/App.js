import "./App.css";
import { useState } from "react";

import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSendMessage = async () => {
    const generatedText = await connectToChatGPT(message);
    setResponse(generatedText);
  };

  const connectToChatGPT = async (message) => {
    const apiUrl =
      "https://api.openai.com/v1/engines/davinci-codex/completions";
    const apiKey = "YOUR_API_KEY_HERE";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const data = {
      prompt: message,
      max_tokens: 50,
      n: 1,
      stop: ["\n"],
    };
    const response = await axios.post(apiUrl, data, { headers });
    return response.data.choices[0].text.trim();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
          <p>{response}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
