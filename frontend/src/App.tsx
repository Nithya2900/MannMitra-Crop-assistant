import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bot, 
  Mic, 
  Sun, 
  Moon, 
  Send, 
  MessageCircle,
  Sparkles,
  MicOff
} from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: string;
}

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("darkMode") === "true"
  );
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg: Message = {
      type: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();

      const botMsg: Message = {
        type: "bot",
        text: data.response,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChat((prev) => [...prev, botMsg]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          type: "bot",
          text: "⚠️ Server error. Please try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🎙️ Voice Input Setup
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Try Chrome or Edge for the best experience.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => (prev ? prev + " " + transcript : transcript));
      inputRef.current?.focus();
    };

    recognition.start();
  };

  const clearChat = () => {
    setChat([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50'
    }`}>
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col max-w-4xl">
        {/* Header */}
        <div className={`rounded-2xl shadow-lg mb-6 backdrop-blur-sm border transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/90 border-white/50 shadow-green-100/50'
        }`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                darkMode ? 'bg-emerald-600' : 'bg-emerald-500'
              } shadow-lg`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  🤖 MannMitra
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Your crop assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="Clear chat"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? 'text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={`flex-1 rounded-2xl shadow-lg backdrop-blur-sm border overflow-hidden transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700 shadow-gray-900/20' 
            : 'bg-white/90 border-white/50 shadow-green-100/50'
        }`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${
                    msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    msg.type === 'user'
                      ? darkMode ? 'bg-blue-600' : 'bg-blue-500'
                      : darkMode ? 'bg-emerald-600' : 'bg-emerald-500'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${msg.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      msg.type === 'user'
                        ? darkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-100 border border-gray-600' 
                          : 'bg-gray-50 text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-2 opacity-70 ${
                        msg.type === 'user' ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    darkMode ? 'bg-emerald-600' : 'bg-emerald-500'
                  }`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className={`border-t p-4 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-end space-x-3">
                <button
                  onClick={startListening}
                  disabled={loading}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    listening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                  title={listening ? 'Listening...' : 'Click to speak'}
                  aria-label="Voice Input"
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || loading}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    !message.trim() || loading
                      ? darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                      : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600'
                  }`}
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            MannMitra uses AI to provide farming insights. Always consult with agricultural experts for critical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;