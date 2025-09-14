import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { setAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().optional(),
  userType: z.enum(["citizen", "champion", "admin"]),
  zone: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Auth() {
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<"citizen" | "champion" | "admin">("citizen");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as "citizen" | "champion" | "admin";
    if (type) {
      setUserType(type);
    }
  }, []);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      password: "", 
      address: "", 
      userType: userType,
      zone: userType === "champion" ? "Ward 15" : undefined
    }
  });

  useEffect(() => {
    signupForm.setValue("userType", userType);
    if (userType === "champion") {
      signupForm.setValue("zone", "Ward 15");
    }
  }, [userType, signupForm]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthState({ user: data.user, isAuthenticated: true });
      toast({ title: "Login successful", description: "Welcome back!" });
      // Use setTimeout to ensure auth state is set before navigation
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthState({ user: data.user, isAuthenticated: true });
      toast({ title: "Registration successful", description: "Welcome to GreenMitra!" });
      // Use setTimeout to ensure auth state is set before navigation
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    },
    onError: () => {
      toast({ title: "Registration failed", description: "Please try again", variant: "destructive" });
    }
  });

  const handleLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleSignup = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  const userTypeLabels = {
    citizen: "Citizen",
    champion: "Green Champion",
    admin: "ULB Admin"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Welcome to GreenMitra</h2>
          <p className="text-muted-foreground">Sign in as {userTypeLabels[userType]}</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email / Phone</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter email or phone number"
                    {...loginForm.register("email")}
                    data-testid="input-login-email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register("password")}
                    data-testid="input-login-password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div>
                  <Label>User Type</Label>
                  <div className="bg-muted rounded-lg p-3 text-sm">{userTypeLabels[userType]}</div>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-xs p-0 h-auto mt-1" 
                    onClick={() => setLocation("/")}
                  >
                    Change user type
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    {...signupForm.register("name")}
                    data-testid="input-signup-name"
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="signup-email">Email / Phone</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter email or phone number"
                    {...signupForm.register("email")}
                    data-testid="input-signup-email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    {...signupForm.register("password")}
                    data-testid="input-signup-password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="signup-address">Address / Ward Number</Label>
                  <Input
                    id="signup-address"
                    placeholder="e.g., Ward 15, Street 23"
                    {...signupForm.register("address")}
                    data-testid="input-signup-address"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={signupMutation.isPending}
                  data-testid="button-signup-submit"
                >
                  {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
