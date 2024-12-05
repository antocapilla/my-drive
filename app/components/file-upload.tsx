'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDrive } from '../context/drive-context';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function FileUpload() {
  const { addFile } = useDrive();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    addFile(file);
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-500 bg-opacity-20 z-50 flex items-center justify-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <p className="text-xl font-semibold">Drop your file here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-8 right-8">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-label="File upload"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="default"
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <Upload className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
