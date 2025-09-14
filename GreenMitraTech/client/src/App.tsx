import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { getAuthState, subscribe } from "./lib/auth";
import { Navbar } from "./components/navbar";
import Landing from "./pages/landing";
import Auth from "./pages/auth";
import CitizenDashboard from "./pages/citizen-dashboard";
import ChampionDashboard from "./pages/champion-dashboard";
import AdminDashboard from "./pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [authState, setAuthState] = useState(getAuthState());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setAuthState(getAuthState());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const renderDashboard = () => {
    if (!authState.user) return <Redirect to="/auth" />;
    
    switch (authState.user.userType) {
      case 'citizen':
        return <CitizenDashboard />;
      case 'champion':
        return <ChampionDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard">
          {renderDashboard()}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
