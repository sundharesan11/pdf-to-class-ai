import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User,
  Bell,
  Shield,
  HelpCircle,
  Settings as SettingsIcon,
  Moon,
  Sun
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      description: "Manage your personal information"
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Configure notification preferences"
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      description: "Control your privacy settings"
    },
    {
      id: "help",
      title: "Help & Support",
      icon: HelpCircle,
      description: "Get help and contact support"
    }
  ];

  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="shadow-card lg:col-span-1 h-fit">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details and profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      AC
                    </div>
                    <div>
                      <Button variant="outline">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Chen" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.chen@student.edu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Input id="grade" defaultValue="10th Grade" />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your classes and progress
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Get instant updates on your device
                        </p>
                      </div>
                      <Switch 
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Achievement Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you unlock new badges
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Weekly Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly digest of your learning activity
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Section */}
            {activeSection === "privacy" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy settings and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Appearance</h4>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                          <div>
                            <p className="font-medium text-foreground">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">
                              Switch between light and dark themes
                            </p>
                          </div>
                        </div>
                        <Switch 
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Password</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button className="w-full">Update Password</Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-foreground mb-3 text-destructive">Danger Zone</h4>
                      <div className="p-4 border-2 border-destructive/20 rounded-xl bg-destructive/5">
                        <p className="text-sm text-muted-foreground mb-3">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Section */}
            {activeSection === "help" && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get assistance and find answers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Documentation</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn how to use all features of EduAgent
                      </p>
                      <Button variant="outline">View Documentation</Button>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Video Tutorials</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Watch step-by-step guides and tutorials
                      </p>
                      <Button variant="outline">Watch Tutorials</Button>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Contact Support</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Need help? Our support team is here for you
                      </p>
                      <div className="space-y-3">
                        <Input placeholder="Your email" type="email" />
                        <Textarea placeholder="Describe your issue..." rows={4} />
                        <Button className="w-full">Send Message</Button>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">App Version</p>
                      <p className="font-bold text-foreground">EduAgent v1.0.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
