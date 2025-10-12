import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Classroom from "./pages/Classroom";
import UploadResource from "./pages/UploadResource";
import TeacherClassView from "./pages/TeacherClassView";
import JoinClass from "./pages/JoinClass";
import Achievements from "./pages/Achievements";
import StudentProfile from "./pages/StudentProfile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/upload" element={<UploadResource />} />
          <Route path="/teacher/class/:classId" element={<TeacherClassView />} />
          <Route path="/teacher/analytics" element={<Analytics />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/join" element={<JoinClass />} />
          <Route path="/student/achievements" element={<Achievements />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/classroom/:classId" element={<Classroom />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
