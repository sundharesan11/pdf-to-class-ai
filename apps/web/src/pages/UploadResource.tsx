import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
    Upload,
    FileText,
    Check,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Copy,
    CheckCircle2,
    Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/lib/api";

type Step = 1 | 2 | 3 | 4 | 5;

const UploadResource = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [parseProgress, setParseProgress] = useState(0);
    const [isParsing, setIsParsing] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [classId, setClassId] = useState<number | null>(null);

    // Form state
    const [classTitle, setClassTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");

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
        setCurrentStep(4);
    };

    const handlePublish = async () => {
        if (!uploadedFile || !classTitle || !difficulty) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setIsParsing(true);
        setCurrentStep(2);
        setParseProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setParseProgress((prev) => Math.min(prev + 10, 90));
            }, 200);



            const response = await pdfApi.upload(uploadedFile, {
                title: classTitle,
                description,
                difficulty,
            });

            clearInterval(progressInterval);
            setParseProgress(100);

            setJoinCode(response.joinCode);
            setClassId(response.classId);

            setTimeout(() => {
                setIsParsing(false);
                setCurrentStep(5);
            }, 500);

            toast({
                title: "Success!",
                description: "Class created successfully",
            });
        } catch (error) {
            setIsParsing(false);
            setCurrentStep(4);
            toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Failed to create class",
                variant: "destructive",
            });
        }
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
                        {[1, 2, 4, 5].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step
                                        ? 'bg-gradient-hero text-white shadow-soft'
                                        : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {currentStep > step ? <Check className="w-5 h-5" /> : index + 1}
                                </div>
                                {index < 3 && (
                                    <div className={`w-20 h-1 mx-2 transition-all ${currentStep > step ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Upload</span>
                        <span>Processing</span>
                        <span>Details</span>
                        <span>Complete</span>
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
                                    Next: Class Details
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
                                    <div className={`flex items-center gap-2 text-sm transition-all ${parseProgress >= 30 ? 'text-accent' : 'text-muted-foreground'
                                        }`}>
                                        {parseProgress >= 30 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                        <span>Extracting text content</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm transition-all ${parseProgress >= 60 ? 'text-accent' : 'text-muted-foreground'
                                        }`}>
                                        {parseProgress >= 60 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                        <span>Detecting chapters and sections</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm transition-all ${parseProgress >= 100 ? 'text-accent' : 'text-muted-foreground'
                                        }`}>
                                        {parseProgress >= 100 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                        <span>Generating course structure</span>
                                    </div>
                                </div>
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
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
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
                                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    variant="hero"
                                    onClick={handlePublish}
                                    disabled={!classTitle || !difficulty || !uploadedFile}
                                    className="gap-2"
                                >
                                    Create Class
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
