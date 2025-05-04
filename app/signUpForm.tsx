"use client";
import type React from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Calendar,
  Clock,
  Users,
  BarChart,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Main component that combines landing page and signup form
export function SignupFormDemo({
  onAuthSuccess,
}: {
  onAuthSuccess: () => void;
}) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSignupForm, setShowSignupForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form field values
    const email = (e.currentTarget.email as HTMLInputElement).value;
    const password = (e.currentTarget.password as HTMLInputElement).value;

    try {
      if (!isLoginMode) {
        // Sign Up with Email/Password
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Sign up success:", userCred.user);
      } else {
        // Login with Email/Password
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Login success:", userCred.user);
      }
      setErrorMsg(null);
      onAuthSuccess();
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMsg(error.message || "Something went wrong");
    }
  };

  // Handle Sign in with Google via popup
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in success:", result.user);
      setErrorMsg(null);
      onAuthSuccess();
    } catch (error: any) {
      console.error("Google sign in error:", error);
      setErrorMsg(error.message || "Something went wrong with Google sign in");
    }
  };

  // If showing the signup form, render only the form
  if (showSignupForm) {
    return (
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to StudySync
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {isLoginMode
            ? "Login with your email and password"
            : "Sign up with your details"}
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Durden" type="text" />
              </LabelInputContainer>
            </div>
          )}

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="your-email@example.com"
              type="email"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" />
          </LabelInputContainer>

          {errorMsg && (
            <div className="mb-4 text-red-600 text-sm">{errorMsg}</div>
          )}

          {/* Sign Up / Login Button */}
          <button
            className="bg-gradient-to-br relative group/btn from-emerald-600 dark:from-emerald-700 dark:to-emerald-900 to-emerald-500 block w-full text-white rounded-md h-10 font-medium shadow"
            type="submit"
          >
            {isLoginMode ? "Login" : "Sign Up"} &rarr;
          </button>

          {/* OR Separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="px-2 text-neutral-500 dark:text-neutral-400 text-sm">
              OR
            </span>
            <div className="flex-grow h-px bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-white dark:bg-gray-800 border border-neutral-300 dark:border-neutral-700 w-full py-2 rounded flex items-center justify-center gap-2"
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="text-neutral-800 dark:text-neutral-200">
              Sign in with Google
            </span>
          </button>

          {/* Toggle Button for Switching Modes */}
          <button
            className="bg-gradient-to-br from-gray-600 to-gray-900 dark:bg-gray-800 w-full text-white rounded-md h-10 font-medium shadow-input mt-4"
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Switch to Sign Up" : "Switch to Login"}
          </button>

          {/* Back to landing page */}
          <button
            className="w-full text-emerald-600 mt-4 text-sm"
            type="button"
            onClick={() => setShowSignupForm(false)}
          >
            &larr; Back to home
          </button>
        </form>
      </div>
    );
  }

  // Otherwise, render the landing page with a button to show the signup form
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Study Smarter,{" "}
                <span className="text-emerald-600">Not Harder</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                StudySync helps you organize your study sessions, track your
                progress, and connect with your academic tools to achieve your
                goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  onClick={() => setShowSignupForm(true)}
                >
                  Get Started Free
                </button>
              </div>
              {/* Removed free trial text */}
            </div>

            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="bg-emerald-600 text-white p-6 rounded-lg shadow-lg">
                <p className="font-bold text-lg">Achieve Greatness</p>
                <p className="text-sm">by taking control of your academics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Features Designed for Student Success
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to optimize your study habits and achieve
              academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description:
                  "Create optimized study schedules based on your availability and learning preferences.",
              },
              {
                icon: Clock,
                title: "Time Management",
                description:
                  "Track study sessions with built-in timers and Pomodoro technique integration.",
              },
              {
                icon: Users,
                title: "Assignment Management",
                description:
                  "Organize and manage your assignments with deadline reminders and progress tracking.",
              },
              {
                icon: BarChart,
                title: "Progress Tracking",
                description:
                  "Visualize your study habits and academic progress with detailed analytics.",
              },
              {
                icon: BookOpen,
                title: "Module Tracking",
                description:
                  "Monitor your course modules and centralize your learning resources.",
              },
              {
                icon: BrainCircuit,
                title: "AI-Powered Insights",
                description:
                  "Take revision quizes and generate mock exams to test your knowledge.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How StudySync Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in minutes and transform your study habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Create Your Account",
                description:
                  "Sign up for free and set up your account in just a seconds.",
              },
              {
                number: "02",
                title: "Add your Study Materials",
                description:
                  "Make your notes, assignments, and study resources to get started.",
              },
              {
                number: "03",
                title: "Log Your Study Sessions",
                description:
                  "Log your study sessions and monitor your progress with detailed analytics and insights.",
              },
              {
                number: "04",
                title: "Achieve Your Goals",
                description:
                  "Improve your grades with analytics and AI-powered quizes and mock exams",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-emerald-50 dark:bg-emerald-950 rounded-xl p-6 h-full">
                  <div className="text-4xl font-bold text-emerald-600 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>

                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-emerald-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to transform your study habits?
                </h3>
                <ul className="space-y-2">
                  {["Always free to use", "No credit card required"].map(
                    (item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={() => setShowSignupForm(true)}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">StudySync</h3>
              <p className="text-gray-400 mb-4">
                Empowering students to achieve academic excellence through smart
                study tools and collaborative learning.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "Features", "Blog", "About Us", "Contact"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-emerald-500 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <span className="text-gray-400">support@studysync.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <span className="text-gray-400">
                    123 Education Ave, Suite 400
                    <br />
                    San Francisco, CA 94107
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} StudySync. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-500 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-500 text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for form inputs
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

// Google icon component
const GoogleIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
};
