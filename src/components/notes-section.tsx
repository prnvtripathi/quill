"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  useNotes,
  useDeleteNote,
  useUpdateNote,
  useAISummary,
  useAIExplanation,
  useAIInsight,
} from "@/hooks/useNotes";
import NoteCard from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface NotesSectionProps {
  userId: string;
}

const NotesSection = ({ userId }: NotesSectionProps) => {
  const { data: notes, isLoading, refetch } = useNotes(userId);
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const summarizeAI = useAISummary();
  const explainAI = useAIExplanation();
  const insightAI = useAIInsight();

  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [explanationDialogOpen, setExplanationDialogOpen] = useState(false);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [insight, setInsight] = useState("");
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState("");
  const [explanation, setExplanation] = useState("");
  const [processingNote, setProcessingNote] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    content: "",
  });

  type AIMode = "summary" | "explanation" | "insight";

  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>("summary");
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleEditNote = (note: Note) => {
    setEditFormData({
      id: note.id,
      title: note.title,
      content: note.content,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateNote = async () => {
    try {
      await updateNote.mutate(editFormData);
      setEditDialogOpen(false);
      // No need to refetch, React Query will handle that via invalidation
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote.mutate(id);
      refetch(); // Refresh the notes list
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAIRequest = async (note: Note, mode: AIMode) => {
    setActiveNote(note);
    setAiMode(mode);
    setAiLoading(true);
    setAiDialogOpen(true);

    try {
      let response: string;

      switch (mode) {
        case "summary":
          response = await summarizeAI.mutateAsync({
            content: `Title: ${note.title}\n\nContent: ${note.content}`,
            maxTokens: 150,
          });
          break;
        case "explanation":
          response = await explainAI.mutateAsync({
            content: `Title: ${note.title}\n\nContent: ${note.content}`,
            maxTokens: 500,
          });
          break;
        case "insight":
          response = await insightAI.mutateAsync({
            content: `Title: ${note.title}\n\nContent: ${note.content}`,
            maxTokens: 300,
          });
          break;
      }

      setAiContent(response);
    } catch (error) {
      console.error(`Error getting ${mode}:`, error);
      setAiContent(`Sorry, we couldn't generate a ${mode} at this time.`);
    } finally {
      setAiLoading(false);
    }
  };

  // Now create simple wrapper functions for each type:
  const handleSummarizeNote = (note: Note) => handleAIRequest(note, "summary");
  const handleExplainNote = (note: Note) =>
    handleAIRequest(note, "explanation");
  const handleGetInsights = (note: Note) => handleAIRequest(note, "insight");

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-slate-600 dark:text-slate-400">
            Loading notes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Your Notes
        </h2>
      </div>

      {notes?.length === 0 ? (
        <motion.div
          className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-slate-600 dark:text-slate-400">
            No notes available. Create your first note above!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {notes?.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <NoteCard
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onSummarize={handleSummarizeNote}
                onExplain={handleExplainNote}
                onGetInsights={handleGetInsights}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit note dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                value={editFormData.content}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, content: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded-md resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateNote}
              disabled={
                !editFormData.title.trim() ||
                !editFormData.content.trim() ||
                updateNote.isPending
              }
            >
              {updateNote.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified AI Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {aiMode === "summary" && "Note Summary"}
              {aiMode === "explanation" && "Note Explanation"}
              {aiMode === "insight" && "Note Insights"}
            </DialogTitle>
            <DialogDescription>
              {aiMode === "summary" &&
                `AI-generated summary of "${activeNote?.title}"`}
              {aiMode === "explanation" &&
                `Detailed explanation of "${activeNote?.title}"`}
              {aiMode === "insight" &&
                `Key insights from "${activeNote?.title}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 max-h-96 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
            {aiLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {aiMode === "summary" && "Generating summary..."}
                    {aiMode === "explanation" && "Creating explanation..."}
                    {aiMode === "insight" && "Analyzing for insights..."}
                  </p>
                </div>
              </div>
            ) : (
              <Markdown remarkPlugins={[remarkGfm]}>{aiContent}</Markdown>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {!aiLoading && (
              <Button
                variant="outline"
                onClick={() => {
                  // Switch between modes
                  const modes: AIMode[] = ["summary", "explanation", "insight"];
                  const currentIndex = modes.indexOf(aiMode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  const nextMode = modes[nextIndex];

                  // Update the mode and fetch new content
                  if (activeNote) handleAIRequest(activeNote, nextMode);
                }}
              >
                {aiMode === "summary" && "Get Explanation"}
                {aiMode === "explanation" && "Get Insights"}
                {aiMode === "insight" && "Get Summary"}
              </Button>
            )}
            <Button onClick={() => setAiDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesSection;
