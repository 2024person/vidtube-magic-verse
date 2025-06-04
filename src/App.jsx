
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { AuthPage } from "@/components/auth/AuthPage";
import { MainLayout } from "@/pages/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { HistoryPage } from "@/pages/HistoryPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { WatchPage } from "@/pages/WatchPage";
import { TrendingPage } from "@/pages/TrendingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, isGuest, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  if (!user && !isGuest) {
    return React.createElement(Navigate, { to: "/auth", replace: true });
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isGuest, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  if (user || isGuest) {
    return React.createElement(Navigate, { to: "/", replace: true });
  }
  
  return children;
};

const App = () => (
  React.createElement(QueryClientProvider, { client: queryClient },
    React.createElement(TooltipProvider, null,
      React.createElement(Toaster),
      React.createElement(Sonner),
      React.createElement(BrowserRouter, null,
        React.createElement(AuthProvider, null,
          React.createElement(Routes, null,
            React.createElement(Route, {
              path: "/auth",
              element: React.createElement(PublicRoute, null,
                React.createElement(AuthPage)
              )
            }),
            React.createElement(Route, {
              path: "/",
              element: React.createElement(ProtectedRoute, null,
                React.createElement(MainLayout)
              )
            }, 
              React.createElement(Route, { index: true, element: React.createElement(HomePage) }),
              React.createElement(Route, { path: "trending", element: React.createElement(TrendingPage) }),
              React.createElement(Route, { path: "history", element: React.createElement(HistoryPage) }),
              React.createElement(Route, { path: "dashboard", element: React.createElement(DashboardPage) }),
              React.createElement(Route, { path: "watch/:id", element: React.createElement(WatchPage) })
            ),
            React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
          )
        )
      )
    )
  )
);

export default App;
