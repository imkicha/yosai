import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const getDefaultRedirect = (role) => {
    if (redirectTo) return redirectTo;
    if (role === "admin") return "/admin/dashboard";
    if (role === "vendor") return "/vendor/dashboard";
    return "/";
  };

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user && !authLoading) navigate(getDefaultRedirect(user.role), { replace: true });
  }, [user, authLoading]);

  useEffect(() => {
    if (searchParams.get("signup")) { setIsSignup(true); setActiveTab("signup"); }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      if (isSignup) {
        if (confirmPassword !== password) { setError("Passwords do not match"); setIsLoading(false); return; }
        const res = await register({ name, email, password });
        setSuccess("Account created successfully!");
        navigate(getDefaultRedirect(res.user?.role));
      } else {
        const res = await login(email, password);
        setSuccess("Sign in successful!");
        navigate(getDefaultRedirect(res.user?.role));
      }
    } catch (err) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setIsSignup(value === "signup");
    setError("");
    setSuccess("");
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="mx-auto flex justify-center">
            <img className="h-16 w-auto" src="/logo.png" alt="Logo" onError={(e) => { e.target.style.display = "none"; }} />
          </motion.div>
        </div>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input id="email" type="email" placeholder="name@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={isSignup} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <Alert variant="destructive" className="text-sm"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <Alert className="bg-green-50 text-green-800 border-green-200 text-sm"><CheckCircle2 className="h-4 w-4 text-green-600" /><AlertTitle>Success</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-500 shadow-md shadow-pink-500/50" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <span>{isSignup ? "Create Account" : "Sign In"}</span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-center text-sm text-gray-600">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button type="button" onClick={() => handleTabChange(isSignup ? "signin" : "signup")} className="font-medium text-pink-600 hover:text-pink-500">
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
