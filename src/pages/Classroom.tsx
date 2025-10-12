import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronRight
} from "lucide-react";
import aiAgentAvatar from "@/assets/ai-agent-avatar.png";

type Message = {
  role: "agent" | "student";
  content: string;
  timestamp?: string;
};

type QuizQuestion = {
  id: string;
  type: "mcq" | "true-false" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: number | string;
  hint?: string;
  explanation?: string;
};

type Section = {
  id: string;
  title: string;
  type: "lesson" | "quiz";
  completed: boolean;
  duration: number;
};

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "Hi there! 👋 I'm your AI tutor. Let's explore Cell Structure together. Feel free to ask me anything!",
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [sessionTime, setSessionTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock sections
  const sections: Section[] = [
    { id: "1", title: "Introduction to Cells", type: "lesson", completed: true, duration: 10 },
    { id: "2", title: "Cell Structure", type: "lesson", completed: false, duration: 15 },
    { id: "3", title: "Cell Membrane", type: "lesson", completed: false, duration: 12 },
    { id: "4", title: "Quiz: Cell Basics", type: "quiz", completed: false, duration: 5 },
    { id: "5", title: "Organelles", type: "lesson", completed: false, duration: 18 },
    { id: "6", title: "Mitochondria Deep Dive", type: "lesson", completed: false, duration: 20 },
    { id: "7", title: "Quiz: Organelles", type: "quiz", completed: false, duration: 8 },
  ];

  const progressPercentage = ((sections.filter(s => s.completed).length) / sections.length) * 100;

  const quizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      type: "mcq",
      question: "What is the main function of the cell membrane?",
      options: [
        "Energy production",
        "Controls what enters and leaves the cell",
        "Protein synthesis",
        "DNA storage"
      ],
      correctAnswer: 1,
      hint: "Think about what keeps the cell's internal environment stable",
      explanation: "The cell membrane acts as a selective barrier, controlling the passage of substances in and out of the cell to maintain homeostasis."
    },
    {
      id: "q2",
      type: "mcq",
      question: "Which organelle is known as the powerhouse of the cell?",
      options: [
        "Nucleus",
        "Ribosome",
        "Mitochondria",
        "Golgi apparatus"
      ],
      correctAnswer: 2,
      hint: "This organelle produces ATP through cellular respiration",
      explanation: "Mitochondria generate ATP (adenosine triphosphate), which provides energy for cellular processes."
    },
    {
      id: "q3",
      type: "true-false",
      question: "All cells have a nucleus.",
      options: ["True", "False"],
      correctAnswer: 1,
      hint: "Think about prokaryotic cells like bacteria",
      explanation: "Prokaryotic cells (like bacteria) lack a membrane-bound nucleus, while eukaryotic cells have one."
    }
  ];

  // Quick question suggestions
  const quickQuestions = [
    "Explain the cell membrane structure",
    "What are the main organelles?",
    "How does osmosis work?",
    "Quiz me on this section"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message?: string) => {
    const textToSend = message || inputMessage;
    if (!textToSend.trim()) return;

    setMessages([...messages, 
      { role: "student", content: textToSend, timestamp: "Just now" }
    ]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let response = "Great question! The cell membrane is like a gatekeeper - it controls what enters and exits the cell, maintaining the cell's internal environment. It's made of a phospholipid bilayer with embedded proteins. Would you like me to explain more about its structure?";
      
      if (textToSend.toLowerCase().includes("quiz")) {
        response = "Excellent! Let's test your knowledge. Click the 'Take Quiz' button to start your assessment. Good luck! 🎯";
      }
      
      setMessages(prev => [...prev, { 
        role: "agent", 
        content: response,
        timestamp: "Just now"
      }]);
    }, 1500);
  };

  const handleQuizAnswer = (questionId: string, answer: number | string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = quizQuestions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    
    setTimeout(() => {
      const scorePercent = (correctCount / quizQuestions.length) * 100;
      let encouragement = "";
      if (scorePercent === 100) {
        encouragement = "Perfect score! You really understand this topic. 🌟";
      } else if (scorePercent >= 70) {
        encouragement = "Great job! You're doing well. Let's review the tricky ones.";
      } else {
        encouragement = "Don't worry! Learning takes practice. Let's go over these concepts together.";
      }
      
      setMessages([...messages, {
        role: "agent",
        content: `Excellent work! You got ${correctCount} out of ${quizQuestions.length} correct (${scorePercent.toFixed(0)}%). ${encouragement}`,
        timestamp: "Just now"
      }]);
      
      setTimeout(() => {
        setShowQuiz(false);
        setQuizSubmitted(false);
        setQuizAnswers({});
        setShowHints({});
      }, 3000);
    }, 2000);
  };

  const toggleHint = (questionId: string) => {
    setShowHints({ ...showHints, [questionId]: !showHints[questionId] });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleSaveProgress = () => {
    // Mock save to localStorage
    localStorage.setItem(`classroom-${classId}-progress`, JSON.stringify({
      currentSection,
      sessionTime,
      messages: messages.slice(-5) // Save last 5 messages
    }));
    
    setMessages([...messages, {
      role: "agent",
      content: "✅ Your progress has been saved! You can continue from here anytime.",
      timestamp: "Just now"
    }]);
  };

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
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate("/student/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
            
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Section {currentSection + 1} of {sections.length}
                </span>
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
              <Button variant="ghost" size="icon" onClick={handleSaveProgress}>
                <Save className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Section Navigation */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-30 w-80 bg-card border-r border-border transition-transform duration-300 h-[calc(100vh-73px)] overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Content
            </h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(idx);
                    setShowQuiz(section.type === "quiz");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all group ${
                    currentSection === idx
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      section.completed 
                        ? 'bg-accent/20' 
                        : currentSection === idx 
                        ? 'bg-white/20' 
                        : 'bg-muted'
                    }`}>
                      {section.completed ? (
                        <CheckCircle2 className={`w-5 h-5 ${currentSection === idx ? 'text-white' : 'text-accent'}`} />
                      ) : section.type === "quiz" ? (
                        <Brain className={`w-4 h-4 ${currentSection === idx ? 'text-white' : 'text-muted-foreground'}`} />
                      ) : (
                        <span className={`text-sm font-bold ${currentSection === idx ? 'text-white' : 'text-muted-foreground'}`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentSection === idx ? 'text-white' : 'text-foreground'
                      }`}>
                        {section.title}
                      </p>
                      <p className={`text-xs ${
                        currentSection === idx ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        ~{section.duration} min
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                      currentSection === idx ? 'text-white' : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
              {!showQuiz ? (
                <Card className="shadow-card animate-fade-in">
                  <CardContent className="p-8">
                    <Badge className="mb-4">Chapter 1: Cell Biology</Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {sections[currentSection].title}
                    </h2>
                    
                    <div className="prose prose-lg max-w-none space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        The cell is the basic unit of life. Every living organism is made up of one or more cells. 
                        Understanding cell structure is fundamental to biology.
                      </p>
                      
                      {/* Key Point Callout */}
                      <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-bold text-primary mb-2">Key Point</h3>
                            <p className="text-foreground">
                              The cell membrane is a selectively permeable barrier that separates the interior of the cell from the external environment. It maintains cellular homeostasis.
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        Inside the cell, you'll find various organelles, each with specific functions that work together to keep the cell alive and functioning:
                      </p>

                      {/* Organelles List */}
                      <div className="space-y-3">
                        {[
                          { name: "Nucleus", desc: "Contains genetic material (DNA) and controls cell activities" },
                          { name: "Mitochondria", desc: "Produces energy (ATP) through cellular respiration" },
                          { name: "Ribosomes", desc: "Synthesize proteins from amino acids" },
                          { name: "Endoplasmic Reticulum", desc: "Processes and transports proteins and lipids" }
                        ].map((organelle, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-foreground">{organelle.name}:</span>
                              <span className="text-muted-foreground"> {organelle.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Video Placeholder */}
                      <div className="bg-muted rounded-2xl p-8 text-center">
                        <PlayCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="text-lg font-semibold text-foreground mb-2">Video: Cell Structure 3D Tour</p>
                        <p className="text-sm text-muted-foreground">Interactive visualization coming soon</p>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                      <Button 
                        variant="outline" 
                        disabled={currentSection === 0}
                        onClick={() => setCurrentSection(currentSection - 1)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </Button>
                      <Button 
                        variant="default"
                        className="flex-1 gap-2"
                        onClick={() => setShowQuiz(true)}
                      >
                        <Brain className="w-5 h-5" />
                        Take Quiz
                      </Button>
                      <Button 
                        variant="hero"
                        disabled={currentSection === sections.length - 1}
                        onClick={() => {
                          setCurrentSection(currentSection + 1);
                          setShowQuiz(sections[currentSection + 1].type === "quiz");
                        }}
                      >
                        Next
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-card animate-fade-in">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Quick Quiz</h2>
                        <p className="text-muted-foreground">Test your understanding</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {quizQuestions.map((question, qIndex) => (
                        <div key={question.id} className="space-y-3 p-6 bg-muted/20 rounded-2xl">
                          <div className="flex items-start justify-between gap-4">
                            <p className="font-semibold text-foreground flex-1">
                              {qIndex + 1}. {question.question}
                            </p>
                            {question.hint && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleHint(question.id)}
                                className="gap-2"
                              >
                                <Lightbulb className="w-4 h-4" />
                                {showHints[question.id] ? "Hide" : "Hint"}
                              </Button>
                            )}
                          </div>
                          
                          {showHints[question.id] && question.hint && (
                            <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-lg">
                              <p className="text-sm text-foreground">{question.hint}</p>
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
                                  onClick={() => !quizSubmitted && handleQuizAnswer(question.id, oIndex)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                    showResult && isCorrect
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
                                      <CheckCircle2 className="w-5 h-5 text-accent" />
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                      <XCircle className="w-5 h-5 text-destructive" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && question.explanation && (
                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-lg animate-fade-in">
                              <p className="text-sm font-medium text-primary mb-1">Explanation:</p>
                              <p className="text-sm text-foreground">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowQuiz(false)}
                        disabled={quizSubmitted}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="hero"
                        className="flex-1"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== quizQuestions.length || quizSubmitted}
                      >
                        {quizSubmitted ? "Checking..." : "Submit Quiz"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* AI Agent Chat Panel */}
          <div className="hidden lg:block w-96 border-l border-border bg-card">
            <div className="h-full flex flex-col">
              {/* Agent Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <img 
                    src={aiAgentAvatar} 
                    alt="AI Agent" 
                    className="w-12 h-12 rounded-full shadow-soft animate-float"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">AI Tutor</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      Always here to help
                    </p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex gap-3 animate-slide-in ${
                        message.role === "student" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {message.role === "agent" && (
                        <img 
                          src={aiAgentAvatar} 
                          alt="AI Agent" 
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div 
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === "agent" 
                              ? "bg-primary/10 text-foreground" 
                              : "bg-gradient-hero text-white"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        {message.role === "agent" && (
                          <div className="flex items-center gap-2 mt-2 px-2">
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-muted-foreground ml-auto">{message.timestamp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 animate-slide-in">
                      <img 
                        src={aiAgentAvatar} 
                        alt="AI Agent" 
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="bg-primary/10 rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              <div className="px-4 py-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/70 rounded-full text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="rounded-xl"
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
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Ask me anything about this topic!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
