import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Award, 
  Flame, 
  Zap,
  BookOpen,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Lock
} from "lucide-react";
import { mockAchievements } from "@/lib/mockData";

const Achievements = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  
  const currentLevel = 5;
  const currentXP = 2350;
  const xpToNextLevel = 3000;
  const streak = 7;

  const iconMap: Record<string, any> = {
    BookOpen,
    Award,
    Flame,
    Zap,
    Trophy,
    Star,
    Target
  };

  const filteredAchievements = mockAchievements.filter(achievement => {
    if (filter === "all") return true;
    if (filter === "unlocked") return achievement.unlocked;
    if (filter === "locked") return !achievement.unlocked;
    return achievement.category === filter;
  });

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

      {/* Hero Section */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20 text-white shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Current Level</p>
                    <p className="text-4xl font-bold">{currentLevel}</p>
                  </div>
                  <Trophy className="w-12 h-12 opacity-90" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>XP Progress</span>
                    <span>{currentXP}/{xpToNextLevel}</span>
                  </div>
                  <Progress 
                    value={(currentXP / xpToNextLevel) * 100} 
                    className="h-2 bg-white/20" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Current Streak</p>
                    <p className="text-4xl font-bold">{streak} days</p>
                  </div>
                  <Flame className="w-12 h-12 opacity-90" />
                </div>
                <p className="text-sm mt-4 opacity-75">
                  Keep it up! Study 3 more days for the Week Warrior badge
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Badges Earned</p>
                    <p className="text-4xl font-bold">
                      {mockAchievements.filter(a => a.unlocked).length}/{mockAchievements.length}
                    </p>
                  </div>
                  <Award className="w-12 h-12 opacity-90" />
                </div>
                <p className="text-sm mt-4 opacity-75">
                  {((mockAchievements.filter(a => a.unlocked).length / mockAchievements.length) * 100).toFixed(0)}% complete
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-6 mx-auto">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            <TabsTrigger value="unlocked" onClick={() => setFilter("unlocked")}>Unlocked</TabsTrigger>
            <TabsTrigger value="locked" onClick={() => setFilter("locked")}>Locked</TabsTrigger>
            <TabsTrigger value="Learning" onClick={() => setFilter("Learning")}>Learning</TabsTrigger>
            <TabsTrigger value="Quiz" onClick={() => setFilter("Quiz")}>Quiz</TabsTrigger>
            <TabsTrigger value="Consistency" onClick={() => setFilter("Consistency")}>Streak</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const IconComponent = iconMap[achievement.icon] || Award;
                return (
                  <Card 
                    key={achievement.id} 
                    className={`shadow-card transition-all hover:shadow-soft ${
                      achievement.unlocked 
                        ? 'border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          achievement.unlocked 
                            ? 'bg-gradient-accent' 
                            : 'bg-muted'
                        }`}>
                          {achievement.unlocked ? (
                            <IconComponent className="w-8 h-8 text-white" />
                          ) : (
                            <Lock className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                          {achievement.category}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {achievement.unlocked ? (
                        <div className="flex items-center gap-2 text-sm text-accent">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">
                            Unlocked {achievement.unlockedDate}
                          </span>
                        </div>
                      ) : achievement.progress !== undefined && achievement.maxProgress ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Keep learning to unlock this badge!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="unlocked">
            <div className="grid md:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const IconComponent = iconMap[achievement.icon] || Award;
                return (
                  <Card 
                    key={achievement.id} 
                    className="shadow-card border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-accent">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <Badge>{achievement.category}</Badge>
                      </div>
                      <CardTitle className="mt-4">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">
                          Unlocked {achievement.unlockedDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="locked">
            <div className="grid md:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className="shadow-card opacity-60 hover:opacity-80 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-muted">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <Badge variant="secondary">{achievement.category}</Badge>
                    </div>
                    <CardTitle className="mt-4">{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {achievement.progress !== undefined && achievement.maxProgress ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2" 
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keep learning to unlock this badge!
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Category tabs */}
          {['Learning', 'Quiz', 'Consistency'].map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => {
                  const IconComponent = iconMap[achievement.icon] || Award;
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`shadow-card transition-all hover:shadow-soft ${
                        achievement.unlocked 
                          ? 'border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent' 
                          : 'opacity-60 hover:opacity-80'
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            achievement.unlocked 
                              ? 'bg-gradient-accent' 
                              : 'bg-muted'
                          }`}>
                            {achievement.unlocked ? (
                              <IconComponent className="w-8 h-8 text-white" />
                            ) : (
                              <Lock className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                            {achievement.category}
                          </Badge>
                        </div>
                        <CardTitle className="mt-4">{achievement.name}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {achievement.unlocked ? (
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <Award className="w-4 h-4" />
                            <span className="font-medium">
                              Unlocked {achievement.unlockedDate}
                            </span>
                          </div>
                        ) : achievement.progress !== undefined && achievement.maxProgress ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium text-foreground">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2" 
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Keep learning to unlock this badge!
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Statistics Panel */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Total XP Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{currentXP}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-accent" />
                Quizzes Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">24</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-secondary" />
                Perfect Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">8</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="w-5 h-5 text-destructive" />
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">12 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
