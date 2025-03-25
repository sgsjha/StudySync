"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import { IconBrandGoogle } from "@tabler/icons-react";
//comment out for when using for auth

export function SignupFormDemo({
  onAuthSuccess,
}: {
  onAuthSuccess: () => void;
}) {
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      isLoginMode ? "Login form submitted" : "Sign Up form submitted"
    );
    onAuthSuccess(); // Switch to Sidebar when form is submitted
  };

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
          <Input id="email" placeholder="your-email@example.com" type="email" />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        {/* Sign Up / Login Button */}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow"
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

        {/* Toggle Button for Switching Modes */}
        <button
          className="bg-gradient-to-br from-gray-600 to-gray-900 dark:bg-gray-800 w-full text-white rounded-md h-10 font-medium shadow-input"
          type="button"
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </form>
    </div>
  );
}

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
