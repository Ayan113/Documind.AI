const API_BASE_URL = "http://localhost:8000/api";

export const uploadDocuments = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload documents");
  }

  return response.json();
};

export const fetchDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json();
};

/**
 * Handles the streaming response from the backend.
 * Uses the native Fetch API to read the stream chunk by chunk.
 */
export const streamChat = async (query, history, selectedDocs, onToken, onSources) => {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      history,
      selected_docs: selectedDocs,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkStr = decoder.decode(value, { stream: true });
    // Multiple SSE events can arrive in one chunk, separated by "\n\n"
    const events = chunkStr.split("\\n\\n");
    
    for (const event of events) {
      if (!event.trim()) continue;
      
      try {
        const parsed = JSON.parse(event);
        if (parsed.type === "sources" && onSources) {
          onSources(parsed.data);
        } else if (parsed.type === "token" && onToken) {
          onToken(parsed.data);
        }
      } catch (err) {
        // Fallback for raw text if parsing fails
        if (onToken) {
           // We'll ignore manual raw text just in case it breaks JSON parsing, but normally we strictly send JSON
           console.warn("Could not parse JSON event", event);
        }
      }
    }
  }
};
