import { SignInForm } from "./SignInForm";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  onBack?: () => void;
}

export function AuthLayout({ onBack }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1663895064411-fff0ab8a9797?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          filter: "grayscale(100%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-zinc-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CMMC Compass</h1>
              <p className="text-sm text-zinc-400">
                Community CMMC Level 1 Platform
              </p>
            </div>
          </div>

          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-white bg-zinc-800 hover:text-white hover:bg-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>

        {/* Auth Card */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-white">
              Create an account
            </CardTitle>
            <p className="text-zinc-400 mt-2 text-sm">
              Start your CMMC Level 1 compliance journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Sign In/Up Form */}
            <SignInForm />

            {/* Features Preview */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-white mb-3 text-center text-sm">
                What's included:
              </h3>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                  <span>All 17 CMMC Level 1 controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                  <span>Local AI assistant with RAG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                  <span>Complete audit documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                  <span>Self-hosted data control</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-zinc-500">
          <p>MIT Licensed • Open Source • Community Driven</p>
        </div>
      </div>
    </div>
  );
}
