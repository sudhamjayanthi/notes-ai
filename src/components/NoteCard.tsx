
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/types/note";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onView, onEdit, onDelete }: NoteCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <CardTitle className="text-xl font-semibold line-clamp-1">
          {note.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={onDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          Last updated: {formatDate(note.updatedAt)}
        </div>
        <div className="mb-2">
          {showSummary ? (
            <div className="text-sm font-medium bg-primary/10 p-2 rounded-md">
              {note.summary}
            </div>
          ) : (
            <p className="text-sm line-clamp-4">{truncateText(note.content, 150)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSummary(!showSummary)}
        >
          {showSummary ? "Show Content" : "Show Summary"}
        </Button>
        <Button variant="outline" size="sm" onClick={onView}>
          Open Note
        </Button>
      </CardFooter>
    </Card>
  );
}
