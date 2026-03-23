import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi! I'm your library assistant. Ask me anything about our book collection!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(
             `http://localhost:9090/api/ai/chat?message=${encodeURIComponent(inputText)}&sessionId=${sessionId.current}`
        );
      const botText = await response.text();

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting. Please try again!",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .chat-widget * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .chat-bubble-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid rgba(255,255,255,0.15);
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-bubble-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .chat-window {
          position: fixed;
          bottom: 105px;
          right: 32px;
          width: 370px;
          height: 520px;
          background: #0f0f1a;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9998;
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .chat-header {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .chat-header-info h6 {
          margin: 0;
          color: white;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .chat-header-info span {
          color: #4ade80;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .online-dot {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .chat-close {
          margin-left: auto;
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }

        .chat-close:hover { color: white; }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { 
          background: rgba(255,255,255,0.1); 
          border-radius: 2px; 
        }

        .message-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .message-row.user { flex-direction: row-reverse; }

        .message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        .bot-avatar { background: linear-gradient(135deg, #667eea, #764ba2); }
        .user-avatar { background: linear-gradient(135deg, #f093fb, #f5576c); }

        .message-bubble {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.5;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bot-bubble {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .user-bubble {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.07);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          width: fit-content;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          animation: typing 1.2s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }

        .chat-input-area {
          padding: 14px 16px;
          background: #0f0f1a;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .chat-input::placeholder { color: rgba(255,255,255,0.25); }
        .chat-input:focus { border-color: rgba(102, 126, 234, 0.6); }

        .send-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
          font-size: 15px;
        }

        .send-btn:hover { transform: scale(1.05); opacity: 0.9; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 16px 12px;
        }

        .suggestion-chip {
          background: rgba(102, 126, 234, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: rgba(255,255,255,0.7);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11.5px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .suggestion-chip:hover {
          background: rgba(102, 126, 234, 0.3);
          color: white;
        }
      `}</style>

      <div className="chat-widget">
        {/* Floating Button */}
        <button
          className="chat-bubble-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Chat with AI Assistant"
        >
          {isOpen ? "✕" : "🤖"}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-avatar">🤖</div>
              <div className="chat-header-info">
                <h6>Library AI Assistant</h6>
                <span>
                  <span className="online-dot"></span>
                  Online — powered by Gemini
                </span>
              </div>
              <button className="chat-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-row ${msg.sender}`}
                >
                  <div
                    className={`message-avatar ${
                      msg.sender === "bot" ? "bot-avatar" : "user-avatar"
                    }`}
                  >
                    {msg.sender === "bot" ? "🤖" : "👤"}
                  </div>
                  <div
                    className={`message-bubble ${
                      msg.sender === "bot" ? "bot-bubble" : "user-bubble"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row">
                  <div className="message-avatar bot-avatar">🤖</div>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length === 1 && (
              <div className="chat-suggestions">
                {[
                  "Books about Java?",
                  "Any Spring Boot books?",
                  "What's available?",
                ].map((s) => (
                  <button
                    key={s}
                    className="suggestion-chip"
                    onClick={() => {
                      setInputText(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <input
                className="chat-input"
                type="text"
                placeholder="Ask about any book..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};