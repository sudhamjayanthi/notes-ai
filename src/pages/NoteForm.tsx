
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NoteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Determine if we're creating a new note or editing an existing one
  const isNewNote = id === "new";

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to manage notes.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setCheckingAuth(false);
      
      // Only set initial loading if we're fetching an existing note
      if (!isNewNote) {
        setInitialLoading(true);
        fetchNote();
      }
    };
    
    checkAuth();
  }, []);

  const fetchNote = async () => {
    try {
      if (!id || isNewNote) {
        return;
      }

      const { data: note, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (note) {
        setTitle(note.title);
        setContent(note.content || '');
        setSummary(note.summary || '');
      } else {
        toast({
          title: "Note not found",
          description: "The requested note could not be found.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error loading note:", error);
      toast({
        title: "Error loading note",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!content.trim()) {
      toast({
        title: "Can't generate summary",
        description: "Please add some content to your note first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: { content }
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: "Summary generated",
        description: "AI summary has been created for your note.",
      });
    } catch (error: any) {
      toast({
        title: "Summary generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide both a title and content for your note.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to save notes.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      const noteData = {
        title,
        content,
        summary,
        user_id: user.id
      };

      if (isNewNote) {
        const { error: insertError } = await supabase
          .from('notes')
          .insert([noteData]);
          
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('notes')
          .update({ ...noteData, updated_at: new Date().toISOString() })
          .eq('id', id);
          
        if (updateError) throw updateError;
      }

      toast({
        title: isNewNote ? "Note created" : "Note updated",
        description: isNewNote 
          ? "Your new note has been created successfully." 
          : "Your note has been updated successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="container mx-auto p-4 max-w-4xl flex items-center justify-center h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-md w-full mb-6"></div>
          <div className="h-40 bg-muted rounded-md w-full mb-6"></div>
          <div className="h-10 bg-muted rounded-md w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-lg font-semibold"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[200px] text-base leading-relaxed"
            required
          />
        </div>

        {summary && (
          <Card className="bg-secondary/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="button" 
            variant="secondary"
            onClick={generateSummary}
            disabled={isGeneratingSummary || !content.trim()}
          >
            {isGeneratingSummary ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate AI Summary"}
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isNewNote ? "Create Note" : "Update Note"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
