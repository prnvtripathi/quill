"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
  WandSparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { get } from "http";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  updated_at: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSummarize: (note: Note) => void;
  onExplain: (note: Note) => void;
  onGetInsights?: (note: Note) => void;
}

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onSummarize,
  onExplain,
  onGetInsights,
}: NoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState({
    delete: false,
    summarize: false,
    explain: false,
    getInsights: false,
  });

  // Format the creation date
  const formattedDate = note.created_at
    ? formatDistanceToNow(new Date(note.created_at), { addSuffix: true })
    : "recently";
  const formattedUpdatedDate = note.updated_at
    ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    : "recently";

  // Handle content truncation
  const isLongContent = note.content.length > 150;
  const displayContent =
    isExpanded || !isLongContent
      ? note.content
      : `${note.content.substring(0, 150)}...`;

  const handleDelete = async () => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      await onDelete(note.id);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
      setShowDeleteConfirm(false);
    }
  };

  const handleSummarize = async () => {
    setIsLoading((prev) => ({ ...prev, summarize: true }));
    try {
      await onSummarize(note);
    } finally {
      setIsLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleExplain = async () => {
    setIsLoading((prev) => ({ ...prev, explain: true }));
    try {
      await onExplain(note);
    } finally {
      setIsLoading((prev) => ({ ...prev, explain: false }));
    }
  };

  const handleGetInsights = async () => {
    setIsLoading((prev) => ({ ...prev, getInsights: true }));
    try {
      if (onGetInsights) {
        await onGetInsights(note);
      } else {
        alert("Insights feature is not available.");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, getInsights: false }));
    }
  };

  return (
    <>
      <Card className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold">{note.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Pencil size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            {note.updated_at &&
            new Date(note.updated_at) > new Date(note.created_at)
              ? `Updated ${formattedUpdatedDate}`
              : `Created ${formattedDate}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-sm pt-2">
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {displayContent}
          </p>

          {isLongContent && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs h-7 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Show more
                </>
              )}
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={handleSummarize}
            disabled={isLoading.summarize}
          >
            {isLoading.summarize ? (
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-slate-500 animate-spin" />
                <span>Summarizing...</span>
              </div>
            ) : (
              <>
                <FileText size={14} className="mr-1" />
                Summarize
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={handleExplain}
            disabled={isLoading.explain}
          >
            {isLoading.explain ? (
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-slate-500 animate-spin" />
                <span>Explaining...</span>
              </div>
            ) : (
              <>
                <MessageSquare size={14} className="mr-1" />
                Explain
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={handleGetInsights}
            disabled={isLoading.getInsights}
          >
            {isLoading.getInsights ? (
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-slate-500 animate-spin" />
                <span>Getting Insights...</span>
              </div>
            ) : (
              <>
                <WandSparkles size={14} className="mr-1" />
                Get Insights
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{note.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isLoading.delete}
            >
              {isLoading.delete ? (
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteCard;
