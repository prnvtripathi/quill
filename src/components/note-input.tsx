"use client";

import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SendButton from "./send-button";
import { useCreateNote } from "@/hooks/useNotes";
import { PencilIcon, X, Paperclip, AlignLeft } from "lucide-react";

interface NoteInputProps {
  userId: string;
  className?: string;
  onNoteCreated?: () => void;
}

const NoteInput = ({ userId, className, onNoteCreated }: NoteInputProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const createNote = useCreateNote();

  const MAX_CHARS = 2000;

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  useEffect(() => {
    // Auto-focus title when component expands
    if (isExpanded && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    // Handle clicks outside to collapse the component
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (isExpanded && !title && !content) {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, title, content]);

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newNote = {
      user_id: userId,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      await createNote.mutate(newNote);

      // Reset fields after sending
      setTitle("");
      setContent("");
      setCharCount(0);

      // Show success feedback
      // Keep expanded if the user might want to add another note

      if (onNoteCreated) {
        onNoteCreated();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCancel = () => {
    if (title || content) {
      if (window.confirm("Discard your note?")) {
        setTitle("");
        setContent("");
        setIsExpanded(false);
        setIsFocused(false);
      }
    } else {
      setIsExpanded(false);
      setIsFocused(false);
    }
  };

  const expandComponent = () => {
    setIsExpanded(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 10);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col rounded-lg border transition-all duration-200 
      ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md cursor-pointer"} 
      ${
        isFocused
          ? "border-blue-400 dark:border-blue-500"
          : "border-slate-200 dark:border-slate-700"
      }
      bg-white dark:bg-slate-900 
      ${
        isExpanded
          ? "from-white to-blue-50/20 dark:from-slate-800 dark:to-slate-900/90"
          : "bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-900/70"
      } 
      ${className}`}
      onClick={!isExpanded ? expandComponent : undefined}
    >
      {/* Collapsed state placeholder */}
      {!isExpanded ? (
        <div className="flex items-center p-4 text-slate-500 dark:text-slate-400 gap-2">
          <PencilIcon size={18} />
          <span>Take a note...</span>
        </div>
      ) : (
        <>
          {/* Title input */}
          <div className="relative">
            <Textarea
              ref={titleRef}
              value={title}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTitle(e.target.value.slice(0, 100))
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Title"
              aria-label="Note title"
              className="min-h-[50px] p-4 border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 
                bg-transparent dark:text-slate-100 font-medium text-lg"
              maxLength={100}
            />
          </div>

          {/* Content input */}
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value.slice(0, MAX_CHARS))
            }
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Take a note..."
            aria-label="Note content"
            className="min-h-[120px] p-4 pt-2 border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 
              bg-transparent dark:text-slate-100"
            maxLength={MAX_CHARS}
          />

          {/* Character count and formatting tools */}
          <div className="flex justify-between items-center px-3 py-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                title="Format text"
                type="button"
              >
                <AlignLeft size={16} />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                title="Attach file"
                type="button"
              >
                <Paperclip size={16} />
              </Button> */}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${
                  charCount > MAX_CHARS * 0.9
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  disabled={isSubmitting}
                  type="button"
                >
                  Cancel
                </Button>

                <SendButton
                  onClick={handleSend}
                  disabled={!title.trim() || !content.trim() || isSubmitting}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteInput;
