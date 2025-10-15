import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  Upload,
  BarChart3
} from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const classes = [
    {
      id: 1,
      title: "Introduction to Biology",
      subject: "Science",
      students: 28,
      completion: 65,
      active: true,
    },
    {
      id: 2,
      title: "World History",
      subject: "Social Studies",
      students: 32,
      completion: 42,
      active: true,
    },
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
                <p className="text-sm text-muted-foreground">Teacher Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
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
            Welcome back, Professor! 👋
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your classes today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-soft transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
                  <p className="text-3xl font-bold text-foreground">4</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Students</p>
                  <p className="text-3xl font-bold text-foreground">127</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Progress</p>
                  <p className="text-3xl font-bold text-foreground">78%</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="hero" className="gap-2" onClick={() => navigate("/teacher/upload")}>
            <Plus className="w-5 h-5" />
            Create New Class
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => navigate("/teacher/upload")}>
            <Upload className="w-5 h-5" />
            Upload Resource
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/teacher/analytics")}>
            <BarChart3 className="w-5 h-5" />
            View Analytics
          </Button>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground mb-4">My Classes</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {classes.map((classItem) => (
              <Card 
                key={classItem.id} 
                className="shadow-card hover:shadow-soft transition-all cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {classItem.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {classItem.subject}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      classItem.active 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {classItem.active ? 'Active' : 'Archived'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{classItem.students} students</span>
                      </div>
                      <div className="font-semibold text-primary">
                        {classItem.completion}% complete
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-accent h-2 rounded-full transition-all"
                        style={{ width: `${classItem.completion}%` }}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/teacher/class/${classItem.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/teacher/class/${classItem.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Class Card */}
            <Card 
              className="shadow-card hover:shadow-soft transition-all cursor-pointer border-2 border-dashed border-primary/30 bg-primary/5 group"
              onClick={() => navigate("/teacher/upload")}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Create New Class</h3>
                <p className="text-muted-foreground">
                  Upload a PDF to get started
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
