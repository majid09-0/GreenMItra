import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, Home } from "lucide-react";

interface TrackModalProps {
  children: React.ReactNode;
}

export function TrackModal({ children }: TrackModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Collection Vehicle Tracking</DialogTitle>
        </DialogHeader>
        
        <div className="relative h-80 bg-muted/30 rounded-lg overflow-hidden mb-4">
          {/* Mock Map Background */}
          <div 
            className="absolute inset-0"
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
          />
          
          {/* Moving Truck Animation */}
          <div className="absolute top-16 left-16 animate-pulse">
            <Truck className="h-8 w-8 text-green-600" />
          </div>
          
          {/* Your Location */}
          <div className="absolute top-24 right-20 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
            <Home className="h-4 w-4" />
          </div>
          
          {/* Route Path */}
          <svg className="absolute inset-0 w-full h-full">
            <path 
              d="M 80 100 Q 200 50 300 150" 
              stroke="hsl(var(--primary))" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="10,5"
            />
          </svg>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" data-testid="text-vehicle-id">Collection Vehicle #WM-0142</p>
              <p className="text-sm text-muted-foreground" data-testid="text-estimated-arrival">Est. arrival: 15-20 minutes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium" data-testid="status-vehicle">On Route</p>
              <p className="text-xs text-muted-foreground">Next: Your location</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
