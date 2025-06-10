import { SignInForm } from "./SignInForm";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  onBack?: () => void;
}

export function AuthLayout({ onBack }: AuthLayoutProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CMMC Compass</h1>
              <p className="text-sm text-zinc-400">Enterprise Compliance Platform</p>
            </div>
          </div>
          
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-zinc-700 bg-zinc-800/50 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to CMMC Compass
            </CardTitle>
            <p className="text-zinc-300 mt-2">
              Sign in or create an account to start your compliance journey
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sign In/Up Form */}
            <SignInForm />

            
            {/* Features Preview */}
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-white mb-3 text-center">
                What you'll get:
              </h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Track all 17 CMMC Level 1 controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>AI-powered compliance guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Comprehensive audit trails</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Real-time progress tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-zinc-400">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
