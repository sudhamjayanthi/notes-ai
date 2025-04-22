
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Note } from "@/types/note";

// Sample notes data - in a real app, this would come from Supabase
const sampleNotes: Record<string, Note> = {
  "1": {
    id: "1",
    title: "Meeting Notes",
    content: "Discussed project timeline and resource allocation. Need to follow up with the design team on UI mockups. Set next meeting for Friday to review progress.",
    summary: "Project timeline discussion, UI mockup follow-up needed, next meeting Friday.",
    createdAt: new Date("2023-04-10").toISOString(),
    updatedAt: new Date("2023-04-10").toISOString(),
  },
  "2": {
    id: "2",
    title: "Product Ideas",
    content: "New feature suggestions: 1) Dark mode 2) Export to PDF 3) Collaboration tools 4) Mobile app integration. Need to prioritize based on user feedback and development resources.",
    summary: "Feature ideas: dark mode, PDF export, collaboration tools, mobile integration. Prioritize based on feedback.",
    createdAt: new Date("2023-04-08").toISOString(),
    updatedAt: new Date("2023-04-09").toISOString(),
  },
  "3": {
    id: "3",
    title: "Learning Resources",
    content: "Useful TypeScript resources: 1) TypeScript Handbook 2) Matt Pocock's tutorials 3) TypeScript Deep Dive book. Make time to go through these materials to improve TS skills.",
    summary: "TypeScript resources: handbook, tutorials by Matt Pocock, Deep Dive book.",
    createdAt: new Date("2023-04-05").toISOString(),
    updatedAt: new Date("2023-04-05").toISOString(),
  }
};

const NoteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== "new");

  const isNewNote = id === "new";

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const fetchNote = () => {
      if (isNewNote) {
        setInitialLoading(false);
        return;
      }

      try {
        if (id && sampleNotes[id]) {
          const note = sampleNotes[id];
          setTitle(note.title);
          setContent(note.content);
          setSummary(note.summary);
        } else {
          toast({
            title: "Note not found",
            description: "The requested note could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        toast({
          title: "Error loading note",
          description: "There was a problem loading the note.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchNote();
  }, [id, isNewNote, navigate, toast]);

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
      // In a real app, this would call the DeepSeek API
      console.log("Generating summary for:", content);
      
      // Mock API call with a timeout
      setTimeout(() => {
        // Create a simple summary by taking the first sentence and adding "..."
        const firstSentence = content.split('.')[0];
        const mockSummary = firstSentence.length > 100 
          ? firstSentence.substring(0, 100) + "..." 
          : firstSentence + "...";
        
        setSummary(mockSummary);
        
        toast({
          title: "Summary generated",
          description: "AI summary has been created for your note.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Summary generation failed",
        description: "There was an error generating the summary. Please try again.",
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
      // In a real app, this would save to Supabase
      console.log("Saving note:", { title, content, summary });
      
      toast({
        title: isNewNote ? "Note created" : "Note updated",
        description: isNewNote 
          ? "Your new note has been created successfully." 
          : "Your note has been updated successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error saving note",
        description: "There was a problem saving your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
        <div className="animate-pulse">
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

      <h1 className="text-3xl font-bold mb-6">
        {isNewNote ? "Create New Note" : "Edit Note"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
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
            className="min-h-[200px]"
            required
          />
        </div>

        {summary && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
              <p>{summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={generateSummary}
            disabled={isGeneratingSummary || !content.trim()}
          >
            {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "Saving..." : isNewNote ? "Create Note" : "Update Note"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
