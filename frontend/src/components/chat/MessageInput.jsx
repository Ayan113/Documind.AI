import React, { useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';

const MessageInput = ({ input, setInput, onSend, disabled }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-xl border border-gray-700 shadow-sm overflow-hidden flex items-end mx-4 my-4 max-w-4xl w-full">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your documents..."
        className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none py-3 px-4 max-h-48 overflow-y-auto"
        rows="1"
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={!input.trim() || disabled}
        className="p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors m-1 rounded-lg flex-shrink-0"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;
