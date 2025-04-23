import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit } from "lucide-react";
import { Note } from "@/types/note";
import { supabase } from "@/integrations/supabase/client";

const NoteView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("Note ID is required");
        
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Map the snake_case DB fields to camelCase for our app
          setNote({
            id: data.id,
            title: data.title,
            content: data.content || '',
            summary: data.summary || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          });
        } else {
          toast({
            title: "Note not found",
            description: "The requested note could not be found.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error: any) {
        toast({
          title: "Error loading note",
          description: error.message,
          variant: "destructive",
        });
        navigate("/dashboard");
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
