import axios from "axios";
import React, { useEffect, useState } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    setShowResponse(false);
    setShowQuestionResponse(false);
    setShowLoader(false);
    setShowQuestionLoader(false);
    setMessage("");
    setChatMessages([]);
    setResponse("");
    setQuestionResponse("");
    setQuestion("");
  }, []);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [questionResponse, setQuestionResponse] = useState("");
  const [showResponse, setShowResponse] = useState();
  const [showQuestionResponse, setShowQuestionResponse] = useState();
  const [showLoader, setShowLoader] = useState();
  const [showQuestionLoader, setShowQuestionLoader] = useState();
  const [question, setQuestion] = useState("");

  var parse = require("html-react-parser");

  const connectToChatGPT = async (chatMessage) => {
    setChatMessages([...chatMessages, chatMessage]);
    const tempChatMessages = [...chatMessages, chatMessage];
    console.log("chat messages: " + tempChatMessages);

    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = "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";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: tempChatMessages,
    };
    const response = await axios.post(apiUrl, data, { headers });
    return response.data.choices[0].message.content;
  };

  const analyzeTransactions = async () => {
    setShowResponse(false);
    setShowLoader(true);
    setChatMessages([]);
    setResponse("");
    setQuestion("");

    var chatMessage = {
      role: "user",
      content: "What can I ask about this data? " + message,
    };

    const generatedText = await connectToChatGPT(chatMessage);
    var updatedText = generatedText.replaceAll("\n", "<br/>");
    setShowLoader(false);
    setShowResponse(true);
    setResponse(parse(updatedText));
  };

  const handleQuestionResponse = async () => {
    setShowQuestionResponse(false);
    setQuestionResponse("");
    setShowQuestionLoader(true);

    var chatMessage = {
      role: "user",
      content: question,
    };

    const generatedText = await connectToChatGPT(chatMessage);
    var updatedText = generatedText.replaceAll("\n", "<br/>");
    setShowQuestionLoader(false);
    setShowQuestionResponse(true);
    setQuestionResponse(parse(updatedText));
  };

  return (
    <div class="transaction-form">
      <div class="container overflow-hidden h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-10 col-md-9 col-lg-9">
            <div class="card">
              <div class="card-header">
                <label htmlFor="transactionTextArea" className="form-label">
                  Enter your transaction data:
                </label>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <textarea
                    class="form-control"
                    id="transactionTextArea"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    class="btn btn-primary"
                    type="button"
                    onClick={analyzeTransactions}
                  >
                    Analyze transactions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row d-grid .p-3">&nbsp;</div>
        {showLoader && (
          <div class="row h-100 justify-content-center align-items-center">
            <div class="col-10 col-md-9 col-lg-9">
              <div class="d-flex align-items-center">
                <strong>Analyzing the transactions...</strong>
                <div
                  class="spinner-border ms-auto"
                  role="status"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
        )}
        {showResponse && (
          <div class="row h-100 justify-content-center align-items-center">
            <div class="col-7">
              <input
                type="text"
                class="form-control form-control-lg"
                id="question"
                placeholder="Enter a question from suggestions or enter your own question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div class="col-auto mt-3">
              <button
                type="submit"
                class="btn btn-primary mb-3 btn-lg"
                onClick={handleQuestionResponse}
              >
                Submit Query
              </button>
            </div>
          </div>
        )}
        {showQuestionLoader && (
          <div class="row h-100 justify-content-center align-items-center">
            <div class="col-10 col-md-9 col-lg-9">
              <div class="d-flex align-items-center">
                <strong>Processing your query...</strong>
                <div
                  class="spinner-border ms-auto"
                  role="status"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
        )}
        <div class="row d-grid .p-3">&nbsp;</div>
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-10 col-md-9 col-lg-9">
            {showQuestionResponse && (
              <div class="card">
                <div class="card-body">{questionResponse}</div>
              </div>
            )}
          </div>
        </div>
        <div class="row d-grid .p-3">&nbsp;</div>
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-10 col-md-9 col-lg-9">
            {showResponse && (
              <div class="card">
                <div class="card-header">
                  Here's what you can ask about this data:
                </div>
                <div class="card-body">{response}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
