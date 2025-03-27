import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useLogin } from "@/apis/auth/useLogin";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { login, isPending } = useLogin();
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and email",
        variant: "destructive"
      });
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      await login({ name, email });
      toast({
        title: "Success!",
        description: `Welcome, ${name}! You've successfully logged in.`
      });

    } catch (error) {
      toast({
        title: "Authentication Failed",
        description:
          "Unable to login. Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            Fetch
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mx-auto max-w-sm">
            Find your perfect furry companion
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Login
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your details to find adoptable dogs.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isPending}
                  required
                  className="h-9 sm:h-10 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                  className="h-9 sm:h-10 text-sm sm:text-base"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2 sm:pt-4">
              <Button
                type="submit"
                className="w-full h-9 sm:h-10 text-sm sm:text-base transition-transform active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Let's Find Dogs!"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-4">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
