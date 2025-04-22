
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate("/login");
    toast({
      title: "Welcome to NoteScribe AI!",
      description: "Please log in or sign up to continue.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-4xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          NoteScribe <span className="text-primary">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Take notes smarter with AI-powered summarization. Create, organize, and extract key insights from your notes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
