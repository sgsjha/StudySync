"use client";
import React, { useState } from "react";
import { SignupFormDemo } from "./signUpForm";
import { SidebarDemo } from "./SidebarDemo";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <SidebarDemo onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <SignupFormDemo onAuthSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
