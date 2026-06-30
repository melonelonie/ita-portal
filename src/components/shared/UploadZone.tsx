import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  files?: UploadedFile[];
  onRemoveFile?: (id: string) => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx';

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  accept = ACCEPTED_EXTENSIONS,
  maxFiles = 20,
  maxSizeMB = 10,
  files = [],
  onRemoveFile,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const validFiles: File[] = [];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      for (let i = 0; i < Math.min(fileList.length, maxFiles); i++) {
        const f = fileList[i];
        if (allowedTypes.includes(f.type) && f.size <= maxSizeMB * 1024 * 1024) {
          validFiles.push(f);
        }
      }
      onFilesSelected?.(validFiles);
    },
    [onFilesSelected, maxFiles, maxSizeMB],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center py-10 px-6 rounded-xl border-2 border-dashed
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-[#6366f1] bg-[#6366f1]/5'
            : 'border-[#27272a] bg-[#0f0f14] hover:border-[#3f3f46] hover:bg-[#18181f]'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-4"
        >
          <Upload size={22} className="text-[#6366f1]" />
        </motion.div>
        <p className="text-sm font-medium text-[#fafafa] mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-[#a1a1aa] mb-3">
          or <span className="text-[#6366f1] underline">browse files</span>
        </p>
        <p className="text-[10px] text-[#52525b]">
          Accepts .pdf, .doc, .docx • Max {maxSizeMB}MB per file • Up to {maxFiles} files
        </p>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#18181f] border border-[#27272a]"
              >
                <FileText size={16} className="text-[#6366f1] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#fafafa] truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#52525b]">{formatFileSize(file.size)}</span>
                    {file.status === 'uploading' && (
                      <div className="flex-1 h-1 rounded-full bg-[#27272a] overflow-hidden max-w-[120px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className="h-full rounded-full bg-[#6366f1]"
                        />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <span className="text-[10px] text-red-400">{file.error || 'Upload failed'}</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {file.status === 'uploading' && <Loader2 size={14} className="text-[#6366f1] animate-spin" />}
                  {file.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-400" />}
                  {file.status === 'error' && <AlertCircle size={14} className="text-red-400" />}
                </div>
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="p-1 rounded hover:bg-white/5 text-[#52525b] hover:text-[#fafafa] transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

UploadZone.displayName = 'UploadZone';

export { UploadZone };
export default UploadZone;
