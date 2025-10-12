import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Settings as SettingsIcon,
  Copy,
  QrCode,
  Share2,
  Edit,
  BarChart3,
  CheckCircle2,
  Clock,
  Search,
  MoreVertical
} from "lucide-react";
import { mockClasses, mockStudents } from "@/lib/mockData";
import { StatCard } from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";

const TeacherClassView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in real app, fetch based on classId
  const classData = mockClasses[0];
  const students = mockStudents;

  const copyJoinCode = () => {
    navigator.clipboard.writeText(classData.joinCode);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Class Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
                {classData.subject}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{classData.title}</h1>
              <p className="text-lg opacity-90">{classData.description}</p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{classData.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{classData.chapters.length} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{classData.completion}% avg progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard title="Total Students" value={classData.students} icon={Users} />
              <StatCard 
                title="Completion Rate" 
                value={`${classData.completion}%`} 
                icon={TrendingUp} 
                iconColor="text-accent" 
                iconBg="bg-accent/10" 
              />
              <StatCard 
                title="Avg Quiz Score" 
                value="84%" 
                icon={BarChart3} 
                iconColor="text-secondary" 
                iconBg="bg-secondary/10" 
              />
              <StatCard 
                title="Active This Week" 
                value={Math.floor(classData.students * 0.7)} 
                icon={Clock} 
                iconColor="text-primary" 
                iconBg="bg-primary/10" 
              />
            </div>

            {/* Join Code Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Class Join Code
                </CardTitle>
                <CardDescription>Share this code with students to join your class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                    <span className="text-3xl font-bold tracking-widest text-primary">
                      {classData.joinCode}
                    </span>
                  </div>
                  <Button variant="outline" size="icon" onClick={copyJoinCode}>
                    <Copy className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <QrCode className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student actions and completions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { student: "Alice Chen", action: "Completed Cell Structure section", time: "2 hours ago" },
                  { student: "Bob Martinez", action: "Scored 92% on quiz", time: "5 hours ago" },
                  { student: "Carol Williams", action: "Joined the class", time: "1 day ago" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.student}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>Chapters and sections in this class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {classData.chapters.map((chapter, idx) => (
                  <div key={chapter.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{chapter.title}</h4>
                          <p className="text-sm text-muted-foreground">{chapter.sections.length} sections</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="pl-11 space-y-2">
                      {chapter.sections.map((section) => (
                        <div key={section.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                          <span className="text-sm text-foreground">{section.title}</span>
                          <span className="text-xs text-muted-foreground">~{section.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Enrolled Students</CardTitle>
                    <CardDescription>{students.length} students in this class</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{student.overallProgress}% Complete</p>
                        <p className="text-xs text-muted-foreground">
                          {student.sectionsCompleted}/{student.totalSections} sections
                        </p>
                      </div>
                      <div className="w-24">
                        <Progress value={student.overallProgress} className="h-2" />
                      </div>
                      <Badge variant={
                        student.status === 'Active' ? 'default' : 
                        student.status === 'Struggling' ? 'destructive' : 
                        'secondary'
                      }>
                        {student.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class Analytics</CardTitle>
                <CardDescription>Detailed performance metrics coming soon</CardDescription>
              </CardHeader>
              <CardContent className="py-16 text-center text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard with charts will be available here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Class Settings
                </CardTitle>
                <CardDescription>Manage class configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="py-16 text-center text-muted-foreground">
                <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Class settings will be available here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherClassView;
