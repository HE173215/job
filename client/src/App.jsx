import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from './contexts/AuthContext';
import router from './routes';

export function App() {
  return (
    <AuthProvider>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;
