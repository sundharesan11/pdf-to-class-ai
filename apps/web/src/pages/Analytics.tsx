import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Award,
  BookOpen,
  BarChart3
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

const Analytics = () => {
  const navigate = useNavigate();

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
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Analytics Overview
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights across all your classes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value="127" icon={Users} />
          <StatCard 
            title="Avg Completion" 
            value="78%" 
            icon={TrendingUp} 
            iconColor="text-accent" 
            iconBg="bg-accent/10" 
          />
          <StatCard 
            title="Avg Quiz Score" 
            value="84%" 
            icon={Award} 
            iconColor="text-secondary" 
            iconBg="bg-secondary/10" 
          />
          <StatCard 
            title="Active Classes" 
            value="4" 
            icon={BookOpen} 
            iconColor="text-primary" 
            iconBg="bg-primary/10" 
          />
        </div>

        {/* Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Student Progress Trends</CardTitle>
              <CardDescription>Progress over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Line chart visualization will be here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quiz Performance by Class</CardTitle>
              <CardDescription>Average scores across all classes</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Bar chart visualization will be here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Student Activity Heatmap</CardTitle>
              <CardDescription>Weekly engagement patterns</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Heatmap visualization will be here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Completion Distribution</CardTitle>
              <CardDescription>Student progress breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Donut chart visualization will be here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
