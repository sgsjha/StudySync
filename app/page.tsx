"use client";
import React, { useState } from "react";
import { SignupFormDemo } from "./signUpForm";
import { SidebarDemo } from "./SideBarDemo";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  return (
    <>
      {isAuthenticated ? (
        <SidebarDemo />
      ) : (
        <SignupFormDemo onAuthSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
