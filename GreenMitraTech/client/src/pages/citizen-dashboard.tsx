import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Play, Camera, Truck, Trophy, Plus, Gift } from "lucide-react";
import { ReportModal } from "@/components/report-modal";
import { TrackModal } from "@/components/track-modal";
import { RedeemModal } from "@/components/redeem-modal";
import { TrainingModal } from "@/components/training-modal";
import { getAuthState } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export default function CitizenDashboard() {
  const { user } = getAuthState();

  const { data: userReports = [] } = useQuery({
    queryKey: ["/api/reports/user", user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const recentActivity = [
    {
      type: "points",
      title: "Points Earned",
      description: "Proper segregation verified",
      points: "+15",
      color: "green",
      icon: Plus
    },
    {
      type: "report",
      title: "Report Submitted", 
      description: "Illegal dumping at Street 12",
      points: "+10",
      color: "blue",
      icon: Camera
    },
    {
      type: "reward",
      title: "Reward Redeemed",
      description: "₹50 discount on electricity bill", 
      points: "-50",
      color: "yellow",
      icon: Gift
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-welcome-message">
                Welcome back, {user.name}!
              </h1>
              <p className="text-white/90">Your next collection is on <strong>Tomorrow, 8:00 AM</strong></p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <div className="text-3xl font-bold" data-testid="text-green-points">{user.greenPoints || 0}</div>
              <p className="text-white/90">Green Points</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <TrainingModal>
          <Card className="cursor-pointer hover:shadow-md transition-shadow group">
            <CardContent className="p-6 text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Start Training</h3>
              <p className="text-muted-foreground text-sm">Learn proper waste segregation techniques</p>
            </CardContent>
          </Card>
        </TrainingModal>
        
        <ReportModal reportType="dumping" title="Report Illegal Dumping">
          <Card className="cursor-pointer hover:shadow-md transition-shadow group" data-testid="card-report-dumping">
            <CardContent className="p-6 text-left">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Camera className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Report Dumping</h3>
              <p className="text-muted-foreground text-sm">Report illegal waste dumping with photo</p>
            </CardContent>
          </Card>
        </ReportModal>
        
        <TrackModal>
          <Card className="cursor-pointer hover:shadow-md transition-shadow group" data-testid="card-track-vehicle">
            <CardContent className="p-6 text-left">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Track Vehicle</h3>
              <p className="text-muted-foreground text-sm">See collection truck location in real-time</p>
            </CardContent>
          </Card>
        </TrackModal>
        
        <RedeemModal>
          <Card className="cursor-pointer hover:shadow-md transition-shadow group" data-testid="card-redeem-points">
            <CardContent className="p-6 text-left">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Redeem Points</h3>
              <p className="text-muted-foreground text-sm">Exchange points for rewards and benefits</p>
            </CardContent>
          </Card>
        </RedeemModal>
      </div>
      
      {/* Recent Activity & Upcoming */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                const colorClasses = {
                  green: "bg-green-50 text-green-600",
                  blue: "bg-blue-50 text-blue-600", 
                  yellow: "bg-yellow-50 text-yellow-600"
                };
                
                return (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses].split(' ')[0]}`}>
                    <IconComponent className={`h-5 w-5 ${colorClasses[activity.color as keyof typeof colorClasses].split(' ')[1]}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className={`font-semibold ${colorClasses[activity.color as keyof typeof colorClasses].split(' ')[1]}`}>
                      {activity.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Collection Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                <div>
                  <p className="font-medium text-primary">Next Collection</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, Dec 15</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 10:00 AM</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Upcoming:</strong></p>
                <div className="flex justify-between">
                  <span>Dec 17 - Organic Waste</span>
                  <span>8:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dec 19 - Recyclables</span>
                  <span>9:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dec 21 - General Waste</span>
                  <span>8:30 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
