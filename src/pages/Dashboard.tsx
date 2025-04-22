
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/NoteCard";
import { useToast } from "@/hooks/use-toast";
import { Note } from "@/types/note";

// Sample notes data - in a real app, this would come from Supabase
const initialNotes: Note[] = [
  {
    id: "1",
    title: "Meeting Notes",
    content: "Discussed project timeline and resource allocation. Need to follow up with the design team on UI mockups. Set next meeting for Friday to review progress.",
    summary: "Project timeline discussion, UI mockup follow-up needed, next meeting Friday.",
    createdAt: new Date("2023-04-10").toISOString(),
    updatedAt: new Date("2023-04-10").toISOString(),
  },
  {
    id: "2",
    title: "Product Ideas",
    content: "New feature suggestions: 1) Dark mode 2) Export to PDF 3) Collaboration tools 4) Mobile app integration. Need to prioritize based on user feedback and development resources.",
    summary: "Feature ideas: dark mode, PDF export, collaboration tools, mobile integration. Prioritize based on feedback.",
    createdAt: new Date("2023-04-08").toISOString(),
    updatedAt: new Date("2023-04-09").toISOString(),
  },
  {
    id: "3",
    title: "Learning Resources",
    content: "Useful TypeScript resources: 1) TypeScript Handbook 2) Matt Pocock's tutorials 3) TypeScript Deep Dive book. Make time to go through these materials to improve TS skills.",
    summary: "TypeScript resources: handbook, tutorials by Matt Pocock, Deep Dive book.",
    createdAt: new Date("2023-04-05").toISOString(),
    updatedAt: new Date("2023-04-05").toISOString(),
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    navigate("/notes/new");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Notes</h1>
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
          <Button onClick={handleCreateNote}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No notes found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term or" : "Get started by"} creating your first note
          </p>
          <Button onClick={handleCreateNote}>
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
