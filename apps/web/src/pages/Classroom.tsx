import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowLeft,
    ArrowRight,
    MessageCircle,
    Send,
    Volume2,
    Brain,
    CheckCircle2,
    XCircle,
    Menu,
    X,
    Lightbulb,
    ThumbsUp,
    ThumbsDown,
    Mic,
    Clock,
    PlayCircle,
    BookOpen,
    Save,
    Sparkles,
    ChevronRight,
    Loader2
} from "lucide-react";
import aiAgentAvatar from "@/assets/ai-agent-avatar.png";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsApi, chatApi, classesApi } from "@/lib/api";

// Custom markdown component for rich text messages
const RichTextMessage = ({ content }: { content: string }) => {
    return (
        <div className="prose prose-sm max-w-none text-inherit leading-relaxed
            prose-headings:text-inherit prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-4 first:prose-headings:mt-0
            prose-p:text-inherit prose-p:leading-relaxed prose-p:mb-3 prose-p:mt-0
            prose-strong:text-inherit prose-strong:font-semibold
            prose-em:text-inherit
            prose-code:text-inherit prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-blockquote:text-inherit prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/20 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-ul:text-inherit prose-ol:text-inherit prose-ul:my-2 prose-ol:my-2
            prose-li:text-inherit prose-li:mb-1
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-table:text-inherit prose-th:text-inherit prose-td:text-inherit prose-th:bg-muted prose-th:font-semibold prose-table:border-collapse prose-th:border prose-th:border-border prose-td:border prose-td:border-border prose-th:p-2 prose-td:p-2
            prose-hr:border-border prose-hr:my-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

type Message = {
    role: "agent" | "student";
    content: string;
    timestamp?: string;
};

type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    hint?: string;
    explanation?: string;
};

type Section = {
    id: number;
    title: string;
    content: string;
    orderIndex: number;
    quizzes?: Array<{
        id: number;
        questions: QuizQuestion[];
    }>;
};

type Chapter = {
    id: number;
    title: string;
    orderIndex: number;
    sections: Section[];
};

const Classroom = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isInitializing, setIsInitializing] = useState(true);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [classData, setClassData] = useState<any>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [showHints, setShowHints] = useState<Record<string, boolean>>({});
    const [sessionTime, setSessionTime] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentSection, setCurrentSection] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Quick responses for lesson progression
    const quickResponses = [
        "I understand this topic",
        "Can you explain it differently?",
        "I'm ready for a quiz on this",
        "I have a question about this"
    ];

    // Initialize session and load class data
    useEffect(() => {
        const initializeClassroom = async () => {
            if (!classId) return;

            try {
                setIsInitializing(true);

                // Start or resume session
                const sessionResponse = await sessionsApi.start(parseInt(classId));
                const session = sessionResponse.data;
                setSessionId(session.id);

                // Fetch class details with chapters and sections
                const classResponse = await classesApi.get(parseInt(classId));
                const classInfo = classResponse; // classResponse is already the data
                setClassData(classInfo);
                setChapters(classInfo.chapters || []);

                // Start teaching immediately (agent-driven)
                const firstChapter = classInfo.chapters?.[0];
                const firstSection = firstChapter?.sections?.[0];

                setMessages([{
                role: "agent",
                content: `👋 **Hello ${user?.name}!** Welcome to **${classInfo.title}**

I'm your AI learning companion and I'll guide you through this course step by step with personalized instruction.

---

## 🎯 Let's Start Learning!

**Our first topic:** *${firstSection?.title}*

Take a moment to read through the material below. When you're ready to continue, use one of the quick response buttons or ask me anything!

📖 *Happy learning!*`,
                    timestamp: "Just now"
                }]);

                // Set the first section as the current lesson to display
                setCurrentSection(firstSection);

            } catch (error: any) {
                console.error('Failed to initialize classroom:', error);
                setMessages([{
                    role: "agent",
                    content: "😔 **Oops!** I had trouble starting your learning session.\n\nPlease try refreshing the page to begin your lesson.",
                    timestamp: "Just now"
                }]);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeClassroom();
    }, [classId, user]);

    // Session timer
    useEffect(() => {
        const timer = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (message?: string) => {
        const textToSend = message || inputMessage;
        if (!textToSend.trim() || !classId) return;

        const studentMessage: Message = {
            role: "student",
            content: textToSend,
            timestamp: "Just now"
        };

        setMessages(prev => [...prev, studentMessage]);
        setInputMessage("");
        setIsTyping(true);

        try {
            const response = await chatApi.sendMessage({
                classId: parseInt(classId),
                sectionId: currentSection?.id,
                message: textToSend
            });

            const tutorMessage: Message = {
                role: "agent",
                content: response.data.answer.message,
                timestamp: "Just now"
            };

            setMessages(prev => [...prev, tutorMessage]);
        } catch (error: any) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, {
                role: "agent",
                content: "🤔 **Hmm, I couldn't process that message.**\n\nPlease try again or rephrase your question!",
                timestamp: "Just now"
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuizAnswer = (questionId: string, answer: number | string) => {
        setQuizAnswers({ ...quizAnswers, [questionId]: answer });
    };

    const handleQuizSubmit = async () => {
        setQuizSubmitted(true);

        const quiz = currentSection?.quizzes?.[0];

        if (!quiz || !sessionId) return;

        try {
            const result = await sessionsApi.continue(sessionId, 'quiz', {
                quizAnswers
            });

            const quizResult = result.data;
            const correctCount = quizResult.correctCount || 0;
            const totalQuestions = quiz.questions.length;
            const scorePercent = (correctCount / totalQuestions) * 100;

            let encouragement = "";
            if (scorePercent === 100) {
                encouragement = "Perfect score! You really understand this topic. 🌟";
            } else if (scorePercent >= 70) {
                encouragement = "Great job! You're doing well. Let's review the tricky ones.";
            } else {
                encouragement = "Don't worry! Learning takes practice. Let's go over these concepts together.";
            }

            setMessages(prev => [...prev, {
                role: "agent",
                content: `Excellent work! You got ${correctCount} out of ${totalQuestions} correct (${scorePercent.toFixed(0)}%). ${encouragement}`,
                timestamp: "Just now"
            }]);

            setTimeout(() => {
                setShowQuiz(false);
                setQuizSubmitted(false);
                setQuizAnswers({});
                setShowHints({});
            }, 3000);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            setMessages(prev => [...prev, {
                role: "agent",
                content: "📝 **Oops!** I couldn't submit your quiz answers right now.\n\nPlease try again - your progress is important to me!",
                timestamp: "Just now"
            }]);
        }
    };

    const toggleHint = (questionId: string) => {
        setShowHints({ ...showHints, [questionId]: !showHints[questionId] });
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const handleSaveProgress = async () => {
        if (!sessionId) return;

        setIsSaving(true);
        try {
            await sessionsApi.pause(sessionId);
            setMessages(prev => [...prev, {
                role: "agent",
                content: "💾 **Progress saved successfully!**\n\n📚 You can continue your learning journey from right here whenever you're ready.",
                timestamp: "Just now"
            }]);
        } catch (error) {
            console.error('Failed to save progress:', error);
            setMessages(prev => [...prev, {
                role: "agent",
                content: "⚠️ **Couldn't save your progress right now.**\n\nDon't worry, your learning continues! Please try saving again in a moment.",
                timestamp: "Just now"
            }]);
        } finally {
            setIsSaving(false);
        }
    };



    // Calculate progress (simplified for agent-driven learning)
    const totalSections = chapters.reduce((sum, ch) => sum + ch.sections.length, 0);
    const progressPercentage = 0; // Will be updated based on agent progress

    // For now, show the first quiz available
    const firstChapter = chapters[0];
    const firstSection = firstChapter?.sections[0];
    const currentQuiz = firstSection?.quizzes?.[0];

    if (isInitializing) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Starting your learning session...</p>
                </div>
            </div>
        );
    }

    if (!classData || chapters.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">No content available for this class.</p>
                    <Button onClick={() => navigate("/student/dashboard")} className="mt-4">
                        Back to Dashboard
                    </Button>
            </div>
    </div>
    );
    }

    return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
    {/* Header */}
    <header className="bg-card border-b border-border shadow-card sticky top-0 z-40">
    <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
    <Button
    variant="ghost"
    size="icon"
    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="lg:hidden"
    title={sidebarCollapsed ? "Show lessons" : "Hide lessons"}
    >
        {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            </Button>

    <Button
    variant="ghost"
        onClick={() => navigate("/student/dashboard")}
            className="gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Back to Dashboard</span>
                            </Button>

                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span className="font-semibold text-foreground">{classData?.title}</span>
                            </div>
                        </div>

    <div className="flex-1 max-w-md">
    <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-foreground">AI-Guided Learning</span>
    <div className="flex items-center gap-3">
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
    <Clock className="w-4 h-4" />
        <span>{formatTime(sessionTime)}</span>
            </div>
        <span className="text-sm font-medium text-primary">
        {progressPercentage.toFixed(0)}%
            </span>
        </div>
    </div>
    <Progress value={progressPercentage} className="h-2" />
    </div>

    <div className="flex items-center gap-2">
    <Button
    variant="ghost"
    onClick={handleSaveProgress}
    disabled={isSaving}
    className="gap-2"
    >
    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? 'Saving...' : 'Save Session'}
        </Button>
                        </div>
    </div>
    </div>
    </header>

            {/* Main Content - Agent-Driven Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Lessons Sidebar - Left Side */}
                <aside className={`${sidebarCollapsed ? 'hidden lg:flex lg:flex-col lg:w-16' : 'flex flex-col w-80'} bg-card border-r border-border h-[calc(100vh-73px)] overflow-hidden transition-all duration-300`}>
                    {sidebarCollapsed ? (
                        <div className="flex flex-col items-center justify-center h-full p-2 gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarCollapsed(false)}
                                title="Expand lessons sidebar"
                                className="w-10 h-10 hover:bg-primary/10"
                            >
                                <BookOpen className="w-5 h-5 text-primary" />
                            </Button>
                            <div className="text-xs text-muted-foreground text-center writing-mode-vertical rotate-180 whitespace-nowrap">
                                Course Content
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-border flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                Course Content
                                </h3>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarCollapsed(true)}
                                    title="Collapse sidebar"
                                className="w-6 h-6 hover:bg-muted"
                                    >
                                <X className="w-4 h-4" />
                            </Button>
                            </div>
                        <p className="text-xs text-muted-foreground mt-1">Available lessons and topics</p>
                    </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-3">
                                {chapters.map((chapter, chIdx) => (
                                    <div key={chapter.id} className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded-lg">
                                            <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-primary">{chIdx + 1}</span>
                                    </div>
                                <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                    {chapter.title}
                                        </p>
                                    <p className="text-xs text-muted-foreground">
                                                {chapter.sections?.length || 0} sections
                                        </p>
                            </div>
                        </div>

                                <div className="ml-8 space-y-1">
                                                {chapter.sections?.map((section, secIdx) => (
                                            <div key={section.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/30 rounded-md transition-colors group relative">
                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                                section.quizzes && section.quizzes.length > 0
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'border-muted-foreground/30'
                                            }`}>
                                                {section.quizzes && section.quizzes.length > 0 ? (
                                                    <Brain className="w-2.5 h-2.5 text-primary" />
                                                ) : (
                                                    <span className="text-xs font-bold text-muted-foreground">
                                                        {secIdx + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate flex-1 group-hover:text-foreground transition-colors">
                                                {section.title}
                                            </p>
                                                {section.quizzes && section.quizzes.length > 0 && (
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                </div>
                            ))}
                       </div>
                    </div>
                ))}
                </div>
                </ScrollArea>

                <div className="p-4 border-t border-border bg-muted/20 flex-shrink-0">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Total Lessons</span>
                            <span className="font-medium text-foreground">{chapters.length} chapters</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>Total Sections</span>
                            <span className="font-medium text-foreground">
                                {chapters.reduce((sum, ch) => sum + (ch.sections?.length || 0), 0)} sections
                        </span>
                </div>
                </div>
                </>
                )}
                </aside>

                {/* Agent Chat Interface - Main Center */}
                <div className="flex-1 flex flex-col bg-card border-r border-border max-w-none h-[calc(100vh-73px)] overflow-hidden">
                {/* Chat Header - Fixed */}
                <div className="flex-shrink-0 p-6 border-b border-border">
                <div className="flex items-center gap-3">
                <img
                src={aiAgentAvatar}
                alt="AI Agent"
                className="w-12 h-12 rounded-full shadow-soft animate-float"
                />
                <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">Your AI Learning Guide</h2>
                <p className="text-sm text-muted-foreground">I'm teaching you {classData?.title} step by step</p>
                </div>
                </div>
                </div>

                {/* Messages - Scrollable */}
                <ScrollArea className="flex-1 min-h-0">
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                <div
                key={index}
                className={`flex gap-4 animate-slide-in ${message.role === "student" ? "flex-row-reverse" : ""}`}
                >
                {message.role === "agent" && (
                <img
                src={aiAgentAvatar}
                alt="AI Agent"
                className="w-10 h-10 rounded-full flex-shrink-0 mt-1"
                />
                )}
                <div className={`flex-1 max-w-2xl ${message.role === "student" ? "text-right" : ""}`}>
                <div
                className={`rounded-2xl px-6 py-4 shadow-soft ${message.role === "agent"
                            ? "bg-primary/10 text-foreground"
                            : "bg-gradient-hero text-white"
                    }`}
                >
                <RichTextMessage content={message.content} />
                </div>
                {message.role === "agent" && (
                <div className="flex items-center gap-2 mt-3 px-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                <span className="text-xs text-muted-foreground ml-auto">{message.timestamp}</span>
                </div>
                )}
                </div>
                </div>
                ))}

                {isTyping && (
                <div className="flex gap-4 animate-slide-in">
                <img
                src={aiAgentAvatar}
                alt="AI Agent"
                className="w-10 h-10 rounded-full flex-shrink-0 mt-1"
                />
                <div className="bg-primary/10 rounded-2xl px-6 py-4 shadow-soft">
                        <div className="flex gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                </div>
                </div>
                )}
                <div ref={messagesEndRef} />

                {/* Current Lesson Card */}
                {currentSection && (
                <div className="px-6 py-4 bg-muted/10 rounded-lg mx-6 mb-6">
                <Card className="shadow-soft">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {currentSection.title}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit">
                            Lesson Content
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ScrollArea className="max-h-96 pr-4">
                            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                                <div dangerouslySetInnerHTML={{
                                    __html: currentSection.content?.replace(/\n/g, '<br>') || 'No content available.'
                                }} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                </div>
                )}
                </div>
                </ScrollArea>

                {/* Quick Responses - Fixed at bottom */}
                <div className="flex-shrink-0 px-6 py-3 border-t border-border bg-card">
                <p className="text-xs text-muted-foreground mb-3 text-center">Quick responses:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                {quickResponses.map((response, idx) => (
                <button
                key={idx}
                onClick={() => handleSendMessage(response)}
                className="text-xs px-4 py-2 bg-muted hover:bg-muted/70 rounded-full text-foreground transition-colors"
                >
                {response}
                </button>
                ))}
                </div>
                </div>

                {/* Input - Fixed at bottom */}
                <div className="flex-shrink-0 p-6 border-t border-border bg-card">
                <div className="flex gap-3 max-w-4xl mx-auto">
                <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Tell me when you're ready to continue..."
                className="rounded-xl flex-1"
                />
                <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                >
                <Mic className="w-5 h-5" />
                </Button>
                <Button
                onClick={() => handleSendMessage()}
                size="icon"
                disabled={!inputMessage.trim()}
                className="flex-shrink-0"
                >
                <Send className="w-5 h-5" />
                </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                <Sparkles className="w-3 h-3 inline mr-1" />
                I'll guide you through each topic and quiz you to ensure you understand
                </p>
                </div>
                </div>

                {/* Quiz Panel - Right Side */}
                <div className="hidden lg:block w-96 bg-card h-[calc(100vh-73px)] overflow-hidden flex flex-col">
                {!showQuiz ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready for a Quiz?</h3>
                <p className="text-muted-foreground text-sm mb-6">
                I'll test your understanding when you're ready to move forward.
                </p>
                <Button
                variant="hero"
                className="w-full"
                onClick={() => setShowQuiz(true)}
                >
                Start Quiz
                </Button>
                </div>
                ) : currentQuiz ? (
                <div className="h-full flex flex-col">
                            {/* Quiz Header */}
                    <div className="p-6 border-b border-border flex-shrink-0">
                        <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                <h3 className="font-bold text-foreground">Knowledge Check</h3>
                <p className="text-sm text-muted-foreground">Test your understanding</p>
                </div>
                </div>
                </div>

                {/* Quiz Content */}
                <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                {currentQuiz.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-4 p-4 bg-muted/20 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-foreground flex-1 text-sm">
                {qIndex + 1}. {question.question}
                </p>
                {question.hint && (
                        <Button
                        variant="ghost"
                            size="sm"
                            onClick={() => toggleHint(question.id.toString())}
                        className="gap-1.5 h-8 px-2"
                >
                <Lightbulb className="w-3.5 h-3.5" />
                    {showHints[question.id] ? "Hide" : "Hint"}
                </Button>
                )}
                </div>

                {showHints[question.id] && question.hint && (
                    <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-lg">
                            <p className="text-xs text-foreground">{question.hint}</p>
                            </div>
                            )}

                            <div className="space-y-2">
                            {question.options?.map((option, oIndex) => {
                            const isSelected = quizAnswers[question.id] === oIndex;
                        const isCorrect = oIndex === question.correctAnswer;
                        const showResult = quizSubmitted;

                            return (
                                <button
                                key={oIndex}
                            onClick={() => !quizSubmitted && handleQuizAnswer(question.id.toString(), oIndex)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${showResult && isCorrect
                                        ? 'border-accent bg-accent/10'
                                            : showResult && isSelected && !isCorrect
                                                    ? 'border-destructive bg-destructive/10'
                                                        : isSelected
                                                            ? 'border-primary bg-primary/10'
                                                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                        }`}
                                                        >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-foreground">{option}</span>
                                                    {showResult && isCorrect && (
                                                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                                                )}
                                            {showResult && isSelected && !isCorrect && (
                                            <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                                        )}
                                    </div>
                                    </button>
                            );
                            })}
                            </div>

                                    {quizSubmitted && question.explanation && (
                                                <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-lg animate-fade-in">
                                            <p className="text-xs font-medium text-primary mb-1">Explanation:</p>
                                            <p className="text-xs text-foreground">{question.explanation}</p>
                                    </div>
                            )}
                    </div>
                ))}
                </div>
                </ScrollArea>

                {/* Quiz Actions */}
                <div className="p-6 border-t border-border flex-shrink-0">
                <div className="flex gap-3">
                <Button
                    variant="outline"
                        onClick={() => setShowQuiz(false)}
                    disabled={quizSubmitted}
                        className="flex-1"
                    >
                    Cancel
                </Button>
                <Button
                    variant="hero"
                        className="flex-1"
                    onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== currentQuiz.questions.length || quizSubmitted}
                        >
                            {quizSubmitted ? "Checking..." : "Submit"}
                    </Button>
                </div>
                </div>
                </div>
                ) : null}
                </div>
            </div>
        </div>
    );
};

export default Classroom;
