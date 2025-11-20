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
    Clock,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { classesApi } from "@/lib/api";

interface EnrolledClass {
    id: number;
    title: string;
    description?: string;
    difficulty: string;
    joinCode: string;
    teacherId: number;
    createdAt: string;
    teacher?: {
        name: string;
    };
}

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: enrolledClasses = [], isLoading, error } = useQuery<EnrolledClass[]>({
        queryKey: ['student-classes'],
        queryFn: () => classesApi.list(),
        enabled: !!user, // Only run query if user is authenticated
    });

    const achievements = [
        { icon: Award, title: "Quick Learner", earned: true },
        { icon: CheckCircle2, title: "Perfect Quiz", earned: true },
        { icon: TrendingUp, title: "Consistent", earned: false },
    ];

    const totalEnrolled = enrolledClasses.length;
    const sectionsComplete = 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
                    <p className="text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

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
                        Welcome back, {user?.name || 'Student'}! 👋
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Ready to continue your learning journey?
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button variant="hero" className="gap-2" onClick={() => navigate("/student/join")}>
                        <PlayCircle className="w-5 h-5" />
                        Join New Class
                    </Button>
                    <Button variant="secondary" className="gap-2" onClick={() => navigate("/student/achievements")}>
                        <Award className="w-5 h-5" />
                        View Achievements
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => navigate("/student/profile")}>
                        <Settings className="w-5 h-5" />
                        My Profile
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-card">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Classes Enrolled</p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : totalEnrolled}
                                    </p>
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
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : sectionsComplete}
                                    </p>
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
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "0 days"}
                                    </p>
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

                        {error && (
                            <Card className="shadow-card bg-destructive/10 border-destructive/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3 text-destructive">
                                        <AlertCircle className="w-5 h-5" />
                                        <p>Failed to load classes. Please try again.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {!isLoading && !error && enrolledClasses.length === 0 && (
                            <Card className="shadow-card">
                                <CardContent className="pt-6 text-center py-12">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">No classes yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Join a class to start learning
                                    </p>
                                    <Button onClick={() => navigate("/student/join")}>
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        Join Your First Class
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {!isLoading && !error && enrolledClasses.map((classItem) => (
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
                                                <span>{classItem.teacher?.name || 'Instructor'}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-muted-foreground">
                                                Difficulty: {classItem.difficulty}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Code: {classItem.joinCode}
                                            </div>
                                        </div>

                                        {classItem.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {classItem.description}
                                            </p>
                                        )}

                                        <Button
                                            className="w-full gap-2"
                                            onClick={() => navigate(`/classroom/${classItem.id}`)}
                                        >
                                            <PlayCircle className="w-5 h-5" />
                                            Start Learning
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
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${achievement.earned
                                                ? 'bg-gradient-accent/10 border-2 border-accent/20'
                                                : 'bg-muted/50 opacity-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${achievement.earned ? 'bg-accent/20' : 'bg-muted'
                                            }`}>
                                            <achievement.icon className={`w-5 h-5 ${achievement.earned ? 'text-accent' : 'text-muted-foreground'
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
