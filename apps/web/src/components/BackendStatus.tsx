/**
 * Backend Status Component
 * Displays connection status and backend information
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { healthCheck, getApiInfo } from '@/lib/backendApi';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function BackendStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      setStatus('loading');
      setError(null);

      const [health, info] = await Promise.all([
        healthCheck(),
        getApiInfo(),
      ]);

      if (health.status === 'ok') {
        setStatus('connected');
        setApiInfo(info);
      } else {
        setStatus('disconnected');
        setError('Backend returned unhealthy status');
      }
    } catch (err) {
      setStatus('disconnected');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Backend Status
          {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === 'connected' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {status === 'disconnected' && <XCircle className="h-4 w-4 text-red-500" />}
        </CardTitle>
        <CardDescription>
          {status === 'connected' && 'Connected to FastAPI backend'}
          {status === 'disconnected' && 'Backend not available'}
          {status === 'loading' && 'Checking connection...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'connected' && apiInfo && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{apiInfo.version}</Badge>
              <Badge variant="outline" className="bg-green-50">
                {apiInfo.status}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mt-3 mb-1">Available Agents:</p>
              <ul className="list-disc list-inside space-y-1">
                {apiInfo.agents && Object.entries(apiInfo.agents).map(([key, value]: [string, any]) => (
                  <li key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </li>
                ))}
              </ul>

              {apiInfo.features && (
                <>
                  <p className="font-medium mt-3 mb-1">Features:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(apiInfo.features).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {status === 'disconnected' && (
          <div className="space-y-2">
            <p className="text-sm text-red-600">
              {error || 'Could not connect to backend'}
            </p>
            <p className="text-xs text-muted-foreground">
              Make sure the FastAPI server is running at http://localhost:8000
            </p>
            <button
              onClick={checkBackend}
              className="text-xs text-blue-600 hover:underline"
            >
              Retry connection
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
