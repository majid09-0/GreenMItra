import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, CheckCircle, Recycle, AlertTriangle, Leaf } from "lucide-react";
import { getAuthState, setAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface TrainingModalProps {
  children: React.ReactNode;
}

export function TrainingModal({ children }: TrainingModalProps) {
  const [open, setOpen] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const { user } = getAuthState();
  const { toast } = useToast();

  const handleStartTraining = () => {
    setTrainingStarted(true);
    
    // Award points for starting training
    if (user) {
      const updatedUser = {
        ...user,
        greenPoints: (user.greenPoints || 0) + 5
      };
      setAuthState({ user: updatedUser });
    }
    
    toast({ 
      title: "Training started!", 
      description: "+5 points added to your account." 
    });
    
    // Auto close after showing success
    setTimeout(() => {
      setOpen(false);
      setTrainingStarted(false);
    }, 2000);
  };

  const trainingModules = [
    {
      icon: CheckCircle,
      title: "Organic Waste Segregation",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Recycle,
      title: "Recyclable Materials",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: AlertTriangle,
      title: "Hazardous Waste Handling",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Leaf,
      title: "Composting at Home",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Waste Segregation Training</DialogTitle>
        </DialogHeader>
        
        {/* Video Placeholder */}
        <div className="relative bg-gradient-to-br from-green-400 to-blue-500 rounded-lg h-64 flex items-center justify-center mb-4">
          <div className="text-center text-white">
            {!trainingStarted ? (
              <>
                <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h4 className="text-xl font-semibold mb-2">Waste Segregation 101</h4>
                <p className="text-white/90">Learn the basics of proper waste sorting</p>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h4 className="text-xl font-semibold mb-2">Training Completed!</h4>
                <p className="text-white/90">Great job learning about waste segregation</p>
              </>
            )}
          </div>
          {!trainingStarted && (
            <Button
              className="absolute inset-0 bg-transparent hover:bg-black/10 border-0"
              onClick={handleStartTraining}
              data-testid="button-start-training"
            >
              <Play className="h-12 w-12 text-white" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Training Modules:</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {trainingModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${module.bgColor}`}
                >
                  <IconComponent className={`h-5 w-5 ${module.color}`} />
                  <span className="text-sm">{module.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
