import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Droplets, ShoppingBag, TreePine } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthState, setAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Reward } from "@shared/schema";

interface RedeemModalProps {
  children: React.ReactNode;
}

const rewardIcons = {
  electricity: Zap,
  water: Droplets,
  voucher: ShoppingBag,
  tree: TreePine,
};

const rewardColors = {
  electricity: "text-yellow-500",
  water: "text-blue-500", 
  voucher: "text-green-500",
  tree: "text-green-600",
};

export function RedeemModal({ children }: RedeemModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = getAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rewards = [] } = useQuery({
    queryKey: ["/api/rewards"],
    enabled: open,
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const response = await apiRequest("POST", "/api/rewards/redeem", {
        userId: user.id,
        rewardId,
      });
      return response.json();
    },
    onSuccess: async (_, rewardId) => {
      const reward = (rewards as Reward[]).find((r) => r.id === rewardId);
      if (reward && user) {
        // Update user points in auth state
        const updatedUser = {
          ...user,
          greenPoints: (user.greenPoints || 0) - reward.cost
        };
        setAuthState({ user: updatedUser });
        
        toast({ 
          title: "Reward redeemed successfully!", 
          description: `${reward.name} has been redeemed.` 
        });
        
        setOpen(false);
      }
    },
    onError: () => {
      toast({ 
        title: "Failed to redeem reward", 
        description: "Insufficient points or error occurred", 
        variant: "destructive" 
      });
    }
  });

  const handleRedeem = (rewardId: string, cost: number) => {
    if (!user || (user.greenPoints || 0) < cost) {
      toast({ 
        title: "Insufficient points", 
        description: "You don't have enough points for this reward", 
        variant: "destructive" 
      });
      return;
    }
    
    redeemMutation.mutate(rewardId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Redeem Green Points</DialogTitle>
        </DialogHeader>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary mb-2" data-testid="text-available-points">
            {user?.greenPoints || 0}
          </div>
          <p className="text-muted-foreground">Available Points</p>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {(rewards as Reward[]).map((reward) => {
            const IconComponent = rewardIcons[reward.type as keyof typeof rewardIcons] || ShoppingBag;
            const iconColor = rewardColors[reward.type as keyof typeof rewardColors] || "text-gray-500";
            const canAfford = (user?.greenPoints || 0) >= reward.cost;
            
            return (
              <Card 
                key={reward.id}
                className={`cursor-pointer transition-all ${
                  canAfford 
                    ? 'hover:bg-muted/50' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canAfford && handleRedeem(reward.id, reward.cost)}
                data-testid={`card-reward-${reward.type}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${iconColor}`} />
                      <div>
                        <h4 className="font-medium">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium">
                      {reward.cost} pts
                    </span>
                  </div>
                  {!canAfford && (
                    <p className="text-xs text-red-500 mt-2">Insufficient points</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
