
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/NoteCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Note } from "@/types/note";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data: notesData, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map the snake_case DB fields to camelCase for our app
        const mappedNotes: Note[] = (notesData || []).map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          summary: note.summary || '',
          createdAt: note.created_at,
          updatedAt: note.updated_at
        }));
        
        setNotes(mappedNotes);
      } catch (error: any) {
        toast({
          title: "Error loading notes",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNote = payload.new as any;
            const mappedNote: Note = {
              id: newNote.id,
              title: newNote.title,
              content: newNote.content || '',
              summary: newNote.summary || '',
              createdAt: newNote.created_at,
              updatedAt: newNote.updated_at
            };
            setNotes(current => [mappedNote, ...current]);
          } else if (payload.eventType === 'DELETE') {
            setNotes(current => current.filter(note => note.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedNote = payload.new as any;
            const mappedNote: Note = {
              id: updatedNote.id,
              title: updatedNote.title,
              content: updatedNote.content || '',
              summary: updatedNote.summary || '',
              createdAt: updatedNote.created_at,
              updatedAt: updatedNote.updated_at
            };
            setNotes(current =>
              current.map(note =>
                note.id === mappedNote.id ? mappedNote : note
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleCreateNote = () => {
    navigate("/notes/new");
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          My Notes
        </h1>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateNote}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No notes found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term or" : "Get started by"} creating your first note
          </p>
          <Button 
            onClick={handleCreateNote}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onView={() => navigate(`/notes/${note.id}`)}
              onEdit={() => navigate(`/notes/${note.id}/edit`)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
