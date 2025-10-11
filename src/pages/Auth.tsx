import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Brain } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"teacher" | "student">(
    (searchParams.get("role") as "teacher" | "student") || "teacher"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle authentication
    // For now, just redirect to the appropriate dashboard
    if (role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-soft">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to EduAgent</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-4">
          <button
            onClick={() => setRole("teacher")}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
              role === "teacher"
                ? "border-primary bg-primary/10 shadow-soft"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
              role === "teacher" ? "text-primary" : "text-muted-foreground"
            }`} />
            <div className="font-semibold text-foreground">Teacher</div>
          </button>
          <button
            onClick={() => setRole("student")}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
              role === "student"
                ? "border-primary bg-primary/10 shadow-soft"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <BookOpen className={`w-8 h-8 mx-auto mb-2 ${
              role === "student" ? "text-primary" : "text-muted-foreground"
            }`} />
            <div className="font-semibold text-foreground">Student</div>
          </button>
        </div>

        {/* Auth Form */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
            <CardDescription>
              {isLogin
                ? `Sign in as a ${role}`
                : `Create your ${role} account`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
