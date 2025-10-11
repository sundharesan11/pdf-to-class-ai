import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ArrowRight,
  MessageCircle,
  Send,
  Volume2,
  Brain,
  CheckCircle2,
  XCircle
} from "lucide-react";
import aiAgentAvatar from "@/assets/ai-agent-avatar.png";

type Message = {
  role: "agent" | "student";
  content: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "Hi there! 👋 I'm your AI tutor. Let's explore Cell Structure together. Are you ready to begin?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const totalSections = 12;
  const progressPercentage = (currentSection / totalSections) * 100;

  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the main function of the cell membrane?",
      options: [
        "Energy production",
        "Controls what enters and leaves the cell",
        "Protein synthesis",
        "DNA storage"
      ],
      correctAnswer: 1
    },
    {
      question: "Which organelle is known as the powerhouse of the cell?",
      options: [
        "Nucleus",
        "Ribosome",
        "Mitochondria",
        "Golgi apparatus"
      ],
      correctAnswer: 2
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, 
      { role: "student", content: inputMessage },
      { 
        role: "agent", 
        content: "Great question! The cell membrane is like a gatekeeper - it controls what enters and exits the cell, maintaining the cell's internal environment. Would you like me to explain more about its structure?" 
      }
    ]);
    setInputMessage("");
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = quizAnswers.filter(
      (answer, index) => answer === quizQuestions[index].correctAnswer
    ).length;
    
    setTimeout(() => {
      setMessages([...messages, {
        role: "agent",
        content: `Excellent work! You got ${correctCount} out of ${quizQuestions.length} correct! 🎉 ${
          correctCount === quizQuestions.length 
            ? "Perfect score! You really understand this topic." 
            : "Let's review the tricky ones together before moving on."
        }`
      }]);
      setShowQuiz(false);
      setQuizSubmitted(false);
      setQuizAnswers([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/student/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Button>
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Section {currentSection} of {totalSections}
                </span>
                <span className="text-sm font-medium text-primary">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        {/* Learning Content Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!showQuiz ? (
            <Card className="shadow-card animate-fade-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Cell Structure
                </h2>
                <div className="prose prose-lg max-w-none text-foreground space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The cell is the basic unit of life. Every living organism is made up of one or more cells. 
                    Understanding cell structure is fundamental to biology.
                  </p>
                  
                  <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary">
                    <h3 className="text-xl font-bold text-primary mb-2">Key Point</h3>
                    <p className="text-foreground">
                      The cell membrane is a selectively permeable barrier that separates the interior of the cell from the external environment.
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Inside the cell, you'll find various organelles, each with specific functions:
                  </p>

                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Nucleus:</strong> Contains genetic material (DNA)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Mitochondria:</strong> Produces energy (ATP)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span><strong className="text-foreground">Ribosomes:</strong> Synthesize proteins</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                  <Button 
                    variant="outline" 
                    disabled={currentSection === 1}
                    onClick={() => setCurrentSection(currentSection - 1)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  <Button 
                    variant="default"
                    className="flex-1"
                    onClick={() => setShowQuiz(true)}
                  >
                    Take Quiz
                  </Button>
                  <Button 
                    variant="outline"
                    disabled={currentSection === totalSections}
                    onClick={() => setCurrentSection(currentSection + 1)}
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
                    <div key={qIndex} className="space-y-3">
                      <p className="font-semibold text-foreground">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const isSelected = quizAnswers[qIndex] === oIndex;
                          const isCorrect = oIndex === question.correctAnswer;
                          const showResult = quizSubmitted;

                          return (
                            <button
                              key={oIndex}
                              onClick={() => !quizSubmitted && handleQuizAnswer(qIndex, oIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                showResult && isCorrect
                                  ? 'border-accent bg-accent/10'
                                  : showResult && isSelected && !isCorrect
                                  ? 'border-destructive bg-destructive/10'
                                  : isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
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
                    variant="default"
                    className="flex-1"
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.length !== quizQuestions.length || quizSubmitted}
                  >
                    {quizSubmitted ? "Checking..." : "Submit Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Agent Chat Panel */}
        <div className="lg:col-span-1">
          <Card className="shadow-card h-[calc(100vh-200px)] flex flex-col">
            <CardContent className="p-4 flex flex-col h-full">
              {/* Agent Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <img 
                  src={aiAgentAvatar} 
                  alt="AI Agent" 
                  className="w-12 h-12 rounded-full shadow-soft animate-float"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">AI Tutor</h3>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
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
                    <div 
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        message.role === "agent" 
                          ? "bg-primary/10 text-foreground" 
                          : "bg-gradient-hero text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="rounded-xl"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ask me anything about this topic!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
