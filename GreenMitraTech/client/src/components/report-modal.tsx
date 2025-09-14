import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const reportSchema = z.object({
  type: z.enum(["dumping", "segregation", "composting"]),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

interface ReportModalProps {
  children: React.ReactNode;
  reportType: "dumping" | "segregation" | "composting";
  title: string;
}

export function ReportModal({ children, reportType, title }: ReportModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = getAuthState();
  const { toast } = useToast();

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: reportType,
      location: "",
      description: "",
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data: ReportForm) => {
      if (!user) throw new Error("User not authenticated");
      
      const reportData = {
        ...data,
        userId: user.id,
        points: 0,
      };
      
      const response = await apiRequest("POST", "/api/reports", reportData);
      return response.json();
    },
    onSuccess: () => {
      const pointsMap = {
        dumping: 10,
        segregation: 15,
        composting: 20
      };
      
      toast({ 
        title: "Report submitted successfully!", 
        description: `+${pointsMap[reportType]} points will be added after verification.` 
      });
      
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: "Failed to submit report", 
        description: "Please try again", 
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (data: ReportForm) => {
    reportMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Street 12, near bus stop"
              {...form.register("location")}
              data-testid="input-report-location"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>
            )}
          </div>
          
          <div>
            <Label>Photo Evidence</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Click to upload photo</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe the issue..."
              {...form.register("description")}
              data-testid="textarea-report-description"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={reportMutation.isPending}
              data-testid="button-submit-report"
            >
              {reportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
