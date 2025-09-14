import { useState } from "react";
import { Link } from "wouter";
import { Leaf, Coins, MapPin, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  const handleUserTypeSelect = (type: string) => {
    setSelectedUserType(type);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-primary">Project GreenMitra</h1>
                <p className="text-lg text-muted-foreground mt-1">Decentralized Waste Management Ecosystem</p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your community into a sustainable environment through intelligent waste management, 
              citizen engagement, and green innovation. Join thousands making a difference.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Earn Green Points</h3>
                  <p className="text-muted-foreground">Get rewarded for proper waste segregation and environmental actions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
                  <p className="text-muted-foreground">Track collection vehicles and report issues instantly</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                  <p className="text-muted-foreground">Connect with Green Champions and local administrators</p>
                </CardContent>
              </Card>
            </div>
            
            {/* User Type Selection */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Choose Your Role</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedUserType === 'citizen' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleUserTypeSelect('citizen')}
                  data-testid="button-select-citizen"
                >
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Citizen</h3>
                    <p className="text-muted-foreground text-sm">Report issues, track collections, earn points</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedUserType === 'champion' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
                  }`}
                  onClick={() => handleUserTypeSelect('champion')}
                  data-testid="button-select-champion"
                >
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Green Champion</h3>
                    <p className="text-muted-foreground text-sm">Verify reports, manage zones, guide citizens</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedUserType === 'admin' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => handleUserTypeSelect('admin')}
                  data-testid="button-select-admin"
                >
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">ULB Admin</h3>
                    <p className="text-muted-foreground text-sm">Monitor operations, analyze data, manage resources</p>
                  </CardContent>
                </Card>
              </div>
              
              {selectedUserType && (
                <div className="mt-8">
                  <Link href={`/auth?type=${selectedUserType}`}>
                    <Button size="lg" className="px-8" data-testid="button-continue">
                      Continue as {selectedUserType === 'citizen' ? 'Citizen' : selectedUserType === 'champion' ? 'Green Champion' : 'ULB Admin'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
