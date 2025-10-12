import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Award,
  TrendingUp,
  Clock,
  Edit,
  PlayCircle
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

const StudentProfile = () => {
  const navigate = useNavigate();

  const enrolledClasses = [
    {
      id: 1,
      title: "Introduction to Biology",
      teacher: "Dr. Sarah Johnson",
      subject: "Science",
      progress: 65,
      totalSections: 12,
      completedSections: 8,
      quizAverage: 88,
      lastAccessed: "2 hours ago"
    },
    {
      id: 2,
      title: "World History",
      teacher: "Prof. Michael Chen",
      subject: "Social Studies",
      progress: 42,
      totalSections: 15,
      completedSections: 6,
      quizAverage: 76,
      lastAccessed: "1 day ago"
    }
  ];

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

      {/* Profile Hero */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm border-4 border-white/30">
              AC
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Alex Chen</h1>
              <p className="text-lg opacity-90 mb-3">10th Grade Student</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Level 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>2 Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>7 day streak</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard title="Total XP" value="2,350" icon={Award} iconColor="text-secondary" iconBg="bg-secondary/10" />
              <StatCard title="Classes" value="2" icon={BookOpen} />
              <StatCard title="Sections Done" value="14" icon={TrendingUp} iconColor="text-accent" iconBg="bg-accent/10" />
              <StatCard title="Avg Score" value="84%" icon={Award} iconColor="text-primary" iconBg="bg-primary/10" />
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: "Completed Cell Structure section", class: "Biology", time: "2 hours ago", icon: BookOpen },
                  { action: "Scored 92% on quiz", class: "Biology", time: "3 hours ago", icon: Award },
                  { action: "Started Ancient Civilizations", class: "History", time: "1 day ago", icon: PlayCircle }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.class} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Classes Tab */}
          <TabsContent value="classes" className="space-y-6 animate-fade-in">
            {enrolledClasses.map((classItem) => (
              <Card key={classItem.id} className="shadow-card hover:shadow-soft transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{classItem.subject}</Badge>
                      </div>
                      <CardTitle className="mb-1">{classItem.title}</CardTitle>
                      <CardDescription>{classItem.teacher}</CardDescription>
                    </div>
                    <Button onClick={() => navigate(`/classroom/${classItem.id}`)}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Progress</p>
                      <p className="text-2xl font-bold text-foreground">{classItem.progress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold text-foreground">
                        {classItem.completedSections}/{classItem.totalSections}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Quiz Avg</p>
                      <p className="text-2xl font-bold text-foreground">{classItem.quizAverage}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium text-primary">{classItem.progress}%</span>
                    </div>
                    <Progress value={classItem.progress} className="h-3" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                    <Clock className="w-4 h-4" />
                    <span>Last accessed {classItem.lastAccessed}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your quiz statistics across all classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-xl">
                    <p className="text-3xl font-bold text-foreground mb-1">24</p>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-xl">
                    <p className="text-3xl font-bold text-accent mb-1">84%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-xl">
                    <p className="text-3xl font-bold text-secondary mb-1">8</p>
                    <p className="text-sm text-muted-foreground">Perfect Scores</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
                <CardDescription>Performance by subject area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: "Science", score: 88, strength: true },
                  { subject: "Social Studies", score: 76, strength: false }
                ].map((item) => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">{item.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.score}%</span>
                        <Badge variant={item.strength ? "default" : "secondary"}>
                          {item.strength ? "Strength" : "Improving"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;
