
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";

export function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the user is on a protected route
  const isProtectedRoute = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/notes/');
  
  // Simple check if the user is on the login/signup pages
  const isAuthPage = location.pathname.includes('/login') || 
                    location.pathname.includes('/signup');

  const handleLogout = () => {
    // In a real app, this would use Supabase auth signOut
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  // Don't show the nav on auth pages
  if (isAuthPage) return null;

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a 
              href="#"
              className="text-xl font-bold cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              NoteScribe <span className="text-primary">AI</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="#"
              className={`text-sm ${location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"} hover:text-primary transition-colors`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </a>
            <a 
              href="#"
              className={`text-sm ${location.pathname === "/about" ? "text-primary font-medium" : "text-muted-foreground"} hover:text-primary transition-colors`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
            >
              About
            </a>
            {isProtectedRoute && (
              <a 
                href="#"
                className={`text-sm ${location.pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground"} hover:text-primary transition-colors`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </a>
            )}
            
            {isProtectedRoute ? (
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <a 
              href="#"
              className="block py-2 px-3 text-base hover:bg-muted rounded-md"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                setMobileMenuOpen(false);
              }}
            >
              Home
            </a>
            <a 
              href="#"
              className="block py-2 px-3 text-base hover:bg-muted rounded-md"
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
                setMobileMenuOpen(false);
              }}
            >
              About
            </a>
            {isProtectedRoute && (
              <a 
                href="#"
                className="block py-2 px-3 text-base hover:bg-muted rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                Dashboard
              </a>
            )}
            
            {isProtectedRoute ? (
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Log out
              </Button>
            ) : (
              <div className="space-y-2 pt-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
