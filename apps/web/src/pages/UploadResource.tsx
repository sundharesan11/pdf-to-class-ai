import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Upload, 
  FileText, 
  Check, 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { generateJoinCode, type Chapter } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3 | 4 | 5;

const UploadResource = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [joinCode] = useState(generateJoinCode());
  
  // Form state
  const [classTitle, setClassTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  
  // Chapter structure state
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "ch1",
      title: "Introduction to the Topic",
      sections: [
        { id: "s1", title: "Overview", duration: 10 },
        { id: "s2", title: "Key Concepts", duration: 15 },
      ],
    },
    {
      id: "ch2",
      title: "Core Principles",
      sections: [
        { id: "s3", title: "Fundamental Ideas", duration: 20 },
        { id: "s4", title: "Advanced Topics", duration: 25 },
      ],
    },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setClassTitle(file.name.replace(".pdf", ""));
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleParse = () => {
    setIsParsing(true);
    setCurrentStep(2);
    
    // Simulate parsing progress
    const interval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsParsing(false);
          setTimeout(() => setCurrentStep(3), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleAddSection = (chapterId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: [...ch.sections, {
            id: `s${Date.now()}`,
            title: "New Section",
            duration: 15,
          }],
        };
      }
      return ch;
    }));
  };

  const handleDeleteSection = (chapterId: string, sectionId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: ch.sections.filter(s => s.id !== sectionId),
        };
      }
      return ch;
    }));
  };

  const handlePublish = () => {
    // Mock: Save to localStorage for now
    const newClass = {
      id: `class-${Date.now()}`,
      title: classTitle,
      subject,
      grade,
      description,
      difficulty,
      joinCode,
      chapters,
      students: 0,
      completion: 0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`class-${newClass.id}`, JSON.stringify(newClass));
    
    setCurrentStep(5);
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Create New Class</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step 
                    ? 'bg-gradient-hero text-white shadow-soft' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Upload</span>
            <span>Parse</span>
            <span>Edit</span>
            <span>Details</span>
            <span>Publish</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload PDF Resource
              </CardTitle>
              <CardDescription>
                Upload a PDF file to automatically generate your class structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <FileText className="w-16 h-16 mx-auto text-primary" />
                      <p className="text-lg font-semibold text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                      <p className="text-lg font-semibold text-foreground">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 20MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="hero"
                  onClick={handleParse}
                  disabled={!uploadedFile}
                  className="gap-2"
                >
                  Next: Parse PDF
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Parsing */}
        {currentStep === 2 && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                AI is Analyzing Your PDF
              </CardTitle>
              <CardDescription>
                Our AI is extracting content and generating the course structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-primary">{parseProgress}%</span>
                </div>
                <Progress value={parseProgress} className="h-3" />
                
                <div className="space-y-2 pt-4">
                  <div className={`flex items-center gap-2 text-sm transition-all ${
                    parseProgress >= 30 ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {parseProgress >= 30 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    <span>Extracting text content</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-all ${
                    parseProgress >= 60 ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {parseProgress >= 60 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    <span>Detecting chapters and sections</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-all ${
                    parseProgress >= 100 ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {parseProgress >= 100 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                    <span>Generating course structure</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Edit Structure */}
        {currentStep === 3 && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="w-6 h-6 text-primary" />
                Edit Course Structure
              </CardTitle>
              <CardDescription>
                Review and modify the generated chapters and sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="multiple" className="w-full" defaultValue={chapters.map(ch => ch.id)}>
                {chapters.map((chapter) => (
                  <AccordionItem key={chapter.id} value={chapter.id}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{chapter.title}</span>
                        <span className="text-xs text-muted-foreground">
                          ({chapter.sections.length} sections)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-7 pt-2">
                        {chapter.sections.map((section) => (
                          <div key={section.id} className="flex items-center justify-between p-3 bg-muted rounded-lg group">
                            <div className="flex items-center gap-3 flex-1">
                              <GripVertical className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{section.title}</span>
                              <span className="text-xs text-muted-foreground">
                                ~{section.duration} min
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteSection(chapter.id, section.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSection(chapter.id)}
                          className="w-full gap-2 mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Section
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="hero" onClick={() => setCurrentStep(4)} className="gap-2">
                  Next: Class Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Class Details */}
        {currentStep === 4 && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
              <CardDescription>
                Add metadata and settings for your class
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title *</Label>
                <Input
                  id="title"
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="e.g., Introduction to Biology"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Social Studies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Level *</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6th Grade">6th Grade</SelectItem>
                      <SelectItem value="7th Grade">7th Grade</SelectItem>
                      <SelectItem value="8th Grade">8th Grade</SelectItem>
                      <SelectItem value="9th Grade">9th Grade</SelectItem>
                      <SelectItem value="10th Grade">10th Grade</SelectItem>
                      <SelectItem value="11th Grade">11th Grade</SelectItem>
                      <SelectItem value="12th Grade">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description of what students will learn..."
                  rows={4}
                />
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  variant="hero" 
                  onClick={handlePublish}
                  disabled={!classTitle || !subject || !grade || !difficulty}
                  className="gap-2"
                >
                  Publish Class
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <Card className="shadow-card animate-fade-in text-center">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Class Created Successfully! 🎉</h2>
                <p className="text-muted-foreground">
                  Your class is now live and ready for students
                </p>
              </div>

              <Card className="bg-primary/5 border-primary/20 max-w-md mx-auto">
                <CardContent className="pt-6">
                  <Label className="text-sm text-muted-foreground mb-2 block">Join Code</Label>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold tracking-widest text-primary">
                      {joinCode}
                    </span>
                    <Button variant="ghost" size="icon" onClick={copyJoinCode}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Share this code with your students to let them join
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="hero" onClick={() => navigate("/teacher/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/teacher/dashboard")}>
                  View Class Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadResource;
