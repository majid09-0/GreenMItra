import { Link, useLocation } from "wouter";
import { Leaf, Home, BarChart3, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthState, logout } from "@/lib/auth";

export function Navbar() {
  const [location] = useLocation();
  const { user } = getAuthState();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  const userTypeLabels = {
    citizen: "Citizen",
    champion: "Green Champion", 
    admin: "ULB Admin"
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">GreenMitra</h1>
              <p className="text-xs text-muted-foreground -mt-1">Waste Management</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Welcome {user.name}</p>
              <p className="text-xs text-muted-foreground">{userTypeLabels[user.userType]}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
