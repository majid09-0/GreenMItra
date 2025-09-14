import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Recycle, CheckCircle, Truck, Layers, RotateCcw, TriangleAlert } from "lucide-react";
import { getAuthState } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = getAuthState();

  const { data: allReports = [] } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const totalReports = allReports.length;
  const resolvedReports = allReports.filter((report) => report.status === "verified").length;
  const pendingReports = allReports.filter((report) => report.status === "pending").length;

  const stats = [
    {
      title: "Total Users",
      value: "12,547",
      change: "↑ 8.2% this month",
      changeColor: "text-green-600",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Segregation Compliance",
      value: "78%", 
      change: "↑ 2.1% this week",
      changeColor: "text-green-600",
      icon: Recycle,
      color: "text-secondary"
    },
    {
      title: "Reports Resolved",
      value: resolvedReports.toString(),
      change: `${pendingReports} pending`,
      changeColor: "text-muted-foreground",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Collection Efficiency",
      value: "92%",
      change: "↓ 1.2% this week", 
      changeColor: "text-yellow-600",
      icon: Truck,
      color: "text-accent"
    }
  ];

  const recentReports = allReports
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "red",
      "in-progress": "yellow", 
      verified: "green",
      resolved: "green"
    };
    return colors[status as keyof typeof colors] || "gray";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pending",
      verified: "Resolved",
      rejected: "Rejected"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getReportTitle = (type: string) => {
    const titles = {
      dumping: "Illegal Dumping",
      segregation: "Segregation Check",
      composting: "Composting Success"
    };
    return titles[type as keyof typeof titles] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-accent to-secondary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">ULB Admin Dashboard</h1>
          <p className="text-white/90">City-wide Waste Management Overview</p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.changeColor}`}>{stat.change}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">City Map - Reports & Collection Routes</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-1" />
                    Layers
                  </Button>
                  <Button size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              {/* Mock Map */}
              <div 
                className="h-96 bg-muted/30 rounded-lg relative overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #e2e8f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e2e8f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                {/* Collection Vehicle */}
                <div className="absolute top-20 left-10 animate-pulse">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                
                {/* Illegal Dumping Reports */}
                <div className="absolute top-32 left-32 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm animate-pulse">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                
                <div className="absolute top-16 right-24 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm animate-pulse">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                
                <div className="absolute bottom-24 left-20 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm animate-pulse">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                
                {/* Resolved Reports */}
                <div className="absolute top-40 right-16 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                
                <div className="absolute bottom-16 right-20 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Collection Vehicle</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Pending Reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Reports */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Reports</h3>
              <Button variant="link" className="text-primary hover:underline text-sm p-0">
                View All
              </Button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentReports.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reports available</p>
              ) : (
                recentReports.map((report: Report) => (
                  <div 
                    key={report.id}
                    className={`border-l-4 border-l-${getStatusColor(report.status)} bg-${getStatusColor(report.status)}-50 p-3 rounded`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{getReportTitle(report.type)}</h4>
                        <p className="text-xs text-muted-foreground">{report.location}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`text-${getStatusColor(report.status)}-800 bg-${getStatusColor(report.status)}-100`}
                        data-testid={`badge-status-${report.id}`}
                      >
                        {getStatusLabel(report.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.createdAt!).toLocaleDateString()} • {new Date(report.createdAt!).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
