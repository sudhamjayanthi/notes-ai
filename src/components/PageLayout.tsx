
import { MainNav } from "@/components/MainNav";
import { Toaster } from "@/components/ui/toaster";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NoteScribe AI. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
