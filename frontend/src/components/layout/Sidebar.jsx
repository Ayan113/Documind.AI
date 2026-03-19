import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

const Sidebar = ({ documents, uploadedFiles, onUpload, onSelectDocument, selectedDocuments, isUploading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const toggleDocumentSelection = (docName) => {
    if (selectedDocuments.includes(docName)) {
      onSelectDocument(selectedDocuments.filter(d => d !== docName));
    } else {
      onSelectDocument([...selectedDocuments, docName]);
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 text-white flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2 font-semibold text-lg">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        Documind.AI
      </div>
      
      {/* Upload Zone */}
      <div className="p-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          {isUploading ? (
            <p className="text-sm text-gray-300">Uploading...</p>
          ) : (
            <p className="text-sm text-gray-300">Drop PDFs here</p>
          )}
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Uploaded Files</h3>
        <div className="space-y-1">
          {documents.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => toggleDocumentSelection(doc)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm text-left truncate ${
                selectedDocuments.includes(doc) ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{doc}</span>
              {selectedDocuments.includes(doc) && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
            </button>
          ))}
          {documents.length === 0 && (
            <p className="text-xs text-gray-600 px-2 italic">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
