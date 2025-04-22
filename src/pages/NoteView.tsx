
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit } from "lucide-react";
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

const NoteView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const fetchNote = () => {
      setLoading(true);
      try {
        if (id && sampleNotes[id]) {
          setNote(sampleNotes[id]);
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
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate, toast]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded-md w-3/4 mb-6"></div>
          <div className="h-4 bg-muted rounded-md w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Note not found</h2>
        <p className="text-muted-foreground mb-6">The note you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        <Button onClick={() => navigate(`/notes/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Note
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Last updated: {formatDate(note.updatedAt)}
      </p>

      {note.summary && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
            <p>{note.summary}</p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-6" />

      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{note.content}</p>
      </div>
    </div>
  );
};

export default NoteView;
