
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">About NoteScribe AI</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              NoteScribe AI was created with a simple goal: to help you take better notes and extract 
              meaningful insights from them. We believe that note-taking should be effortless, 
              and the information within your notes should be easily accessible.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-xl font-medium mb-2">AI-Powered Summarization</h3>
                <p className="text-muted-foreground">
                  Our app uses advanced AI to automatically generate concise summaries of your notes, 
                  helping you quickly grasp the key points without reading the entire text.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-xl font-medium mb-2">Intuitive Interface</h3>
                <p className="text-muted-foreground">
                  With a clean, modern design, NoteScribe AI makes it easy to create, organize, 
                  and find your notes whenever you need them.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-xl font-medium mb-2">Secure Storage</h3>
                <p className="text-muted-foreground">
                  Your notes are securely stored and accessible only to you. We use 
                  industry-standard encryption to protect your data.
                </p>
              </div>
              
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-xl font-medium mb-2">Cross-Platform</h3>
                <p className="text-muted-foreground">
                  Access your notes from any device with a web browser. Your content 
                  syncs automatically, so you're always up to date.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4 pl-4">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Create a note</span> - Write down your thoughts, ideas, or information.
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Generate a summary</span> - With one click, our AI analyzes your content and creates a concise summary.
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Organize and access</span> - Your notes are stored securely and can be searched, edited, or deleted at any time.
              </li>
            </ol>
          </section>
          
          <div className="text-center py-6">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started Now
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account? <a href="#" className="text-primary hover:underline" onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
