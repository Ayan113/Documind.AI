import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import ChatBox from './components/chat/ChatBox';
import MessageInput from './components/chat/MessageInput';
import { uploadDocuments, fetchDocuments, streamChat } from './services/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Load documents on mount
  useEffect(() => {
    fetchDocuments()
      .then(data => {
        if (data.documents) {
          setDocuments(data.documents);
          setSelectedDocuments(data.documents); // Select all by default
        }
      })
      .catch(err => console.error("Failed to fetch documents", err));
  }, []);

  const handleUpload = async (files) => {
    setIsUploading(true);
    try {
      const data = await uploadDocuments(files);
      if (data.all_docs) {
        setDocuments(data.all_docs);
        // Automatically select the newly uploaded docs
        const newSelected = new Set([...selectedDocuments, ...data.all_docs]);
        setSelectedDocuments(Array.from(newSelected));
      }
    } catch (e) {
      alert("Error uploading documents: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newHistory = [...messages, userMsg];
    
    setMessages(newHistory);
    setInput('');
    setIsStreaming(true);

    let assistantMsg = { role: 'assistant', content: '', sources: [] };
    
    // Add placeholder for assistant
    setMessages(prev => [...prev, assistantMsg]);

    const onSources = (sourcesData) => {
      assistantMsg.sources = sourcesData;
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { ...assistantMsg };
        return newArr;
      });
    };

    const onToken = (token) => {
      assistantMsg.content += token;
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { ...assistantMsg };
        return newArr;
      });
    };

    try {
      // Pass previous history for context minus the current message we just added
      const queryHistory = newHistory.slice(0, -1);
      await streamChat(userMsg.content, queryHistory, selectedDocuments, onToken, onSources);
    } catch (e) {
      assistantMsg.content = `[Error: ${e.message}]`;
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { ...assistantMsg };
        return newArr;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0E1117] overflow-hidden font-sans text-gray-100">
      <Sidebar 
        documents={documents}
        uploadedFiles={documents} // alias
        onUpload={handleUpload}
        selectedDocuments={selectedDocuments}
        onSelectDocument={setSelectedDocuments}
        isUploading={isUploading}
      />
      
      <main className="flex-1 flex flex-col h-full relative border-l border-gray-800 shadow-2xl bg-[#0b0f14]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/5 pointer-events-none" />
        
        <ChatBox messages={messages} isStreaming={isStreaming} />
        
        <div className="flex justify-center w-full z-10 pb-4 shrink-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14] to-transparent pt-6">
          <MessageInput 
            input={input} 
            setInput={setInput} 
            onSend={handleSend} 
            disabled={isStreaming}
          />
        </div>
      </main>
    </div>
  );
}

export default App;