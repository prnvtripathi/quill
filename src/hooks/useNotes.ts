import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const API_ROUTE = "/api/groq";

export function useNotes(userId: string | undefined) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["notes", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (note: {
      title: string;
      content: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([note])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: any) => {
      const { data, error } = await supabase
        .from("notes")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

type AIParams = {
  content: string;
  maxTokens?: number;
};

async function fetchAIResponse(
  mode: "summary" | "explain" | "insight",
  params: AIParams
) {
  const res = await fetch(API_ROUTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, mode }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong with AI");
  return data.response;
}

export function useAISummary() {
  return useMutation({
    mutationFn: (params: AIParams) => fetchAIResponse("summary", params),
  });
}

export function useAIExplanation() {
  return useMutation({
    mutationFn: (params: AIParams) => fetchAIResponse("explain", params),
  });
}

export function useAIInsight() {
  return useMutation({
    mutationFn: (params: AIParams) => fetchAIResponse("insight", params),
  });
}
