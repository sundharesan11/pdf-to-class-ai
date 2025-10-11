import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  TrendingUp, 
  Settings,
  LogOut,
  Award,
  PlayCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const enrolledClasses = [
    {
      id: 1,
      title: "Introduction to Biology",
      teacher: "Dr. Sarah Johnson",
      progress: 65,
      totalSections: 12,
      completedSections: 8,
      nextSection: "Cell Structure",
    },
    {
      id: 2,
      title: "World History",
      teacher: "Prof. Michael Chen",
      progress: 42,
      totalSections: 15,
      completedSections: 6,
      nextSection: "Ancient Civilizations",
    },
  ];

  const achievements = [
    { icon: Award, title: "Quick Learner", earned: true },
    { icon: CheckCircle2, title: "Perfect Quiz", earned: true },
    { icon: TrendingUp, title: "Consistent", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EduAgent</h1>
                <p className="text-sm text-muted-foreground">Student Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, Alex! 👋
          </h2>
          <p className="text-lg text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Classes Enrolled</p>
                  <p className="text-3xl font-bold text-foreground">2</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sections Complete</p>
                  <p className="text-3xl font-bold text-foreground">14</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Learning Streak</p>
                  <p className="text-3xl font-bold text-foreground">7 days</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Classes */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-4">My Classes</h3>
            
            {enrolledClasses.map((classItem) => (
              <Card 
                key={classItem.id} 
                className="shadow-card hover:shadow-soft transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors mb-1">
                        {classItem.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{classItem.teacher}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        {classItem.completedSections} of {classItem.totalSections} sections
                      </div>
                      <div className="font-semibold text-primary">
                        {classItem.progress}%
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-accent h-2 rounded-full transition-all"
                        style={{ width: `${classItem.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-xl">
                      <Clock className="w-4 h-4" />
                      <span>Next: {classItem.nextSection}</span>
                    </div>

                    <Button 
                      className="w-full gap-2"
                      onClick={() => navigate(`/classroom/${classItem.id}`)}
                    >
                      <PlayCircle className="w-5 h-5" />
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-4">Achievements</h3>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Badges</CardTitle>
                <CardDescription>Keep learning to unlock more!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-accent/10 border-2 border-accent/20' 
                        : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      achievement.earned ? 'bg-accent/20' : 'bg-muted'
                    }`}>
                      <achievement.icon className={`w-5 h-5 ${
                        achievement.earned ? 'text-accent' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        {achievement.title}
                      </p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
