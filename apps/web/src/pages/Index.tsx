import { BackendStatus } from "@/components/BackendStatus";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="mb-4 text-4xl font-bold">EduAgent AI Tutor</h1>
          <p className="text-xl text-muted-foreground">
            Agentic AI-powered learning platform with multi-agent system
          </p>
        </div>

        <BackendStatus />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Backend should be running at <code className="bg-muted px-2 py-1 rounded">http://localhost:8000</code></p>
          <p className="mt-2">Navigate to <a href="/auth" className="text-primary hover:underline">/auth</a> to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
