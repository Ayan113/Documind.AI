import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, FileText } from 'lucide-react';

const ChatBox = ({ messages, isStreaming }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto w-full px-4 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-400 mt-20"
            >
              <Bot className="w-16 h-16 mb-4 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-300">How can I help you today?</h2>
              <p className="text-sm mt-2">Upload a PDF and select it from the sidebar to begin.</p>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none prose prose-invert max-w-[90%]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <>
                    <ReactMarkdown className="leading-relaxed">
                      {msg.content}
                    </ReactMarkdown>
                    
                    {/* Source Attribution Rendering */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs bg-gray-900 border border-gray-600 px-2 py-1 rounded-md text-gray-300 cursor-help" title={src.snippet}>
                              <FileText className="w-3 h-3 text-blue-400" />
                              <span className="truncate max-w-[150px]">{src.source}</span>
                              <span className="bg-gray-700 px-1.5 rounded-sm">p.{src.page}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
          
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatBox;
