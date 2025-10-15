import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Brain, TrendingUp, Sparkles, Users } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Turn any PDF into an{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Interactive AI Classroom
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              EduAgent empowers teachers to create engaging, AI-guided lessons and helps students learn through personalized, conversational tutoring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                onClick={() => navigate("/auth?role=teacher")}
                className="group"
              >
                <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                I'm a Teacher
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate("/auth?role=student")}
                className="group"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                I'm a Student
              </Button>
            </div>
          </div>
          
          <div className="relative animate-float">
            <img 
              src={heroImage} 
              alt="EduAgent Platform Illustration" 
              className="w-full rounded-3xl shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-card/50 rounded-3xl shadow-card my-12">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How EduAgent Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform traditional learning into an intelligent, interactive experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-soft transition-all hover:-translate-y-1 space-y-4">
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Upload a Lesson</h3>
            <p className="text-muted-foreground leading-relaxed">
              Teachers upload PDFs and our AI automatically breaks them into chapters, sections, and interactive learning modules.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-soft transition-all hover:-translate-y-1 space-y-4">
            <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">AI Tutor Teaches</h3>
            <p className="text-muted-foreground leading-relaxed">
              Students learn with a friendly AI agent that explains concepts, answers doubts, and adapts to their pace.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-soft transition-all hover:-translate-y-1 space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Track Progress</h3>
            <p className="text-muted-foreground leading-relaxed">
              Real-time analytics show student comprehension, quiz results, and areas that need attention.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-hero rounded-3xl p-12 md:p-20 text-center text-white shadow-soft">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to revolutionize learning?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of teachers and students already using EduAgent to make education more engaging and effective.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">EduAgent</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
