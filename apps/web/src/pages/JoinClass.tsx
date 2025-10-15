import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { mockClasses } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const JoinClass = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState("");
  const [validClass, setValidClass] = useState<typeof mockClasses[0] | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleCodeChange = (value: string) => {
    const code = value.toUpperCase().slice(0, 6);
    setJoinCode(code);
    
    // Validate code (mock validation)
    if (code.length === 6) {
      const found = mockClasses.find(c => c.joinCode === code);
      setValidClass(found || null);
    } else {
      setValidClass(null);
    }
  };

  const handleEnroll = () => {
    if (validClass) {
      // Mock enrollment
      setIsEnrolled(true);
      
      setTimeout(() => {
        toast({
          title: "Enrolled Successfully! 🎉",
          description: `You've joined ${validClass.title}`,
        });
        navigate("/student/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {!isEnrolled ? (
          <Card className="shadow-card animate-fade-in">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Join a New Class</CardTitle>
              <CardDescription className="text-base">
                Enter the 6-character code provided by your teacher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="join-code" className="text-base">Class Join Code</Label>
                <Input
                  id="join-code"
                  value={joinCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="ABC123"
                  className="text-center text-2xl font-bold tracking-widest uppercase h-14"
                  maxLength={6}
                />
                {joinCode.length === 6 && !validClass && (
                  <p className="text-sm text-destructive">Invalid code. Please check and try again.</p>
                )}
              </div>

              {/* Class Preview */}
              {validClass && (
                <div className="animate-fade-in">
                  <div className="border-2 border-primary rounded-xl p-6 bg-primary/5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className="mb-2">{validClass.subject}</Badge>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {validClass.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {validClass.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-lg font-bold text-foreground">
                            {validClass.students}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-lg font-bold text-foreground">
                            {validClass.chapters.length}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Chapters</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-lg font-bold text-foreground">
                            {validClass.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Level</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">First 3 Chapters:</p>
                      <ul className="space-y-1">
                        {validClass.chapters.slice(0, 3).map((chapter) => (
                          <li key={chapter.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            {chapter.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full mt-6"
                    onClick={handleEnroll}
                  >
                    <Sparkles className="w-5 h-5" />
                    Enroll in This Class
                  </Button>
                </div>
              )}

              {!validClass && (
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled
                >
                  Enter Code to Continue
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card animate-fade-in text-center">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Welcome to {validClass?.title}! 🎉
                </h2>
                <p className="text-muted-foreground">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JoinClass;
