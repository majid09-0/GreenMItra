import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Users, Star, ListTodo } from "lucide-react";
import { getAuthState } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Report } from "@shared/schema";

export default function ChampionDashboard() {
  const { user } = getAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: zoneReports = [] } = useQuery<Report[]>({
    queryKey: ["/api/reports/zone", user?.zone],
    enabled: !!user?.zone,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: "verified" | "rejected" }) => {
      const response = await apiRequest("PATCH", `/api/reports/${reportId}/verify`, {
        status,
        verifiedBy: user?.id,
      });
      return response.json();
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports/zone", user?.zone] });
      
      const pointsMap = {
        composting: 20,
        segregation: 15,
        dumping: 10
      };
      
      if (status === "verified") {
        toast({ 
          title: "Report verified successfully!", 
          description: "Points have been awarded to the citizen." 
        });
      } else {
        toast({ 
          title: "Report rejected", 
          description: "The report has been marked as rejected." 
        });
      }
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update report status", 
        variant: "destructive" 
      });
    }
  });

  const handleVerify = (reportId: string, status: "verified" | "rejected") => {
    verifyMutation.mutate({ reportId, status });
  };

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const pendingReports = zoneReports.filter((report) => report.status === "pending");
  const verifiedToday = zoneReports.filter((report) => 
    report.status === "verified" && 
    new Date(report.createdAt!).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: "Pending Tasks",
      value: pendingReports.length,
      color: "text-orange-600",
      icon: ListTodo
    },
    {
      title: "Verified Today", 
      value: verifiedToday,
      color: "text-green-600",
      icon: CheckCircle
    },
    {
      title: "Points Awarded",
      value: "245",
      color: "text-blue-600", 
      icon: Star
    },
    {
      title: "Active Citizens",
      value: "127",
      color: "text-purple-600",
      icon: Users
    }
  ];

  const getReportTypeLabel = (type: string) => {
    const labels = {
      dumping: "Illegal Dumping Report",
      segregation: "Segregation Check",
      composting: "Composting Verification"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getReportColor = (type: string) => {
    const colors = {
      dumping: "red",
      segregation: "green", 
      composting: "blue"
    };
    return colors[type as keyof typeof colors] || "gray";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Green Champion Dashboard</h1>
              <p className="text-white/90">Assigned Zone: <strong>{user.zone || "Ward No. 15"}</strong></p>
              <p className="text-white/90 text-sm mt-1">Managing 142 households • {pendingReports.length} pending verifications</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <div className="text-3xl font-bold">98%</div>
              <p className="text-white/90">Zone Compliance</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`} data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
                      {stat.value}
                    </p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Verification Tasks */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pending Verifications</h3>
              <Badge variant="secondary" data-testid="badge-pending-count">
                {pendingReports.length} Pending
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingReports.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending verifications</p>
              ) : (
                pendingReports.map((report: Report) => (
                  <Card key={report.id} className="border hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{getReportTypeLabel(report.type)}</h4>
                          <p className="text-sm text-muted-foreground">{report.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reported: {new Date(report.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-${getReportColor(report.type)}-800 bg-${getReportColor(report.type)}-50`}>
                          {report.type}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerify(report.id, "verified")}
                          disabled={verifyMutation.isPending}
                          data-testid={`button-verify-${report.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify (+{report.type === 'composting' ? 20 : report.type === 'segregation' ? 15 : 10} pts)
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleVerify(report.id, "rejected")}
                          disabled={verifyMutation.isPending}
                          data-testid={`button-reject-${report.id}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Zone Overview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Zone Overview - {user.zone || "Ward 15"}</h3>
            
            <div className="space-y-6">
              {/* Progress Bars */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Compliance</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: "98%"}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Segregation Rate</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: "87%"}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Citizen Participation</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: "94%"}}></div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="pt-4">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Houses Verified Today</span>
                    <span className="font-medium">{verifiedToday}/18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Points Distributed</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Issues Resolved</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">New Registrations</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
