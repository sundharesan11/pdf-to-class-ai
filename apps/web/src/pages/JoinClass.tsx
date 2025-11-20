import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { classesApi } from "@/lib/api";

const JoinClass = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [joinCode, setJoinCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolledClassName, setEnrolledClassName] = useState("");

    const handleCodeChange = (value: string) => {
        // Allow up to 6 characters, convert to uppercase
        const code = value.toUpperCase().slice(0, 6);
        setJoinCode(code);
    };

    const handleEnroll = async () => {
        if (!joinCode || joinCode.length !== 6) {
            toast({
                title: "Invalid Code",
                description: "Please enter a valid 6-character join code",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await classesApi.join(joinCode) as any;
            setEnrolledClassName(response.class?.name || "the class");
            setIsEnrolled(true);

            setTimeout(() => {
                toast({
                    title: "Enrolled Successfully! 🎉",
                    description: `You've joined ${response.class?.name || "the class"}`,
                });
                navigate("/student/dashboard");
            }, 2000);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to join class. Please check your code and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
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
                                disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Enter 6-character code (letters and numbers)
                                </p>
                            </div>

                            <Button
                                variant="hero"
                                size="lg"
                                className="w-full"
                                onClick={handleEnroll}
                                disabled={!joinCode || joinCode.length !== 6 || isLoading}
                            >
                                <Sparkles className="w-5 h-5" />
                                {isLoading ? "Joining..." : "Join Class"}
                            </Button>
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
                                    Welcome to {enrolledClassName}! 🎉
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
