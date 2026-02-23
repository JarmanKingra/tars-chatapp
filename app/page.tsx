"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import ChatMVP from "@/components/userComponents/ChatMVP";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <Landing />
      </Unauthenticated>

      <Authenticated>
        <InitUser />
        <ChatLayout />
      </Authenticated>
    </>
  );
}

function InitUser() {
  const syncUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    syncUser();
  }, []);

  return null;
}

function Landing() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-[var(--foreground)] text-4xl font-bold">Tars Chat</h1>
      <p className="text-[var(--foreground)]">
        Real-time conversations made simple.
      </p>
      <SignInButton>
        <button className="btn-primary">Sign In</button>
      </SignInButton>
    </div>
  );
}

function ChatLayout() {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-semibold">Welcome</h2>
          <UserButton />
        </div>
        <ChatMVP />
      </div>
    </div>
  );
}
