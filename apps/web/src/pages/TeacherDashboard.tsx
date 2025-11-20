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
    BarChart3,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { classesApi } from "@/lib/api";

interface Class {
    id: number;
    title: string;
    description?: string;
    difficulty: string;
    joinCode: string;
    teacherId: number;
    createdAt: string;
    updatedAt: string;
    _count?: {
        enrollments: number;
    };
}

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: classes = [], isLoading, error } = useQuery<Class[]>({
        queryKey: ['teacher-classes'],
        queryFn: () => classesApi.list(),
        enabled: !!user, // Only run query if user is authenticated
    });

    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, cls) => sum + (cls._count?.enrollments || 0), 0);
    const avgProgress = totalClasses > 0 ? 65 : 0;

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
                        Welcome back, {user?.name || 'Professor'}! 👋
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
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : totalClasses}
                                    </p>
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
                                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : totalStudents}
                                    </p>
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
                                    <p className="text-3xl font-bold text-foreground">
                                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : `${avgProgress}%`}
                                    </p>
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

                    {!isLoading && !error && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {classes.length === 0 ? (
                                <Card className="shadow-card col-span-2">
                                    <CardContent className="pt-6 text-center py-12">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">No classes yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Get started by creating your first class
                                        </p>
                                        <Button onClick={() => navigate("/teacher/upload")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Class
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
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
                                                            {classItem.description || `Difficulty: ${classItem.difficulty}`}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                                        Active
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Users className="w-4 h-4" />
                                                            <span>{classItem._count?.enrollments || 0} students</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Code: {classItem.joinCode}
                                                        </div>
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
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
