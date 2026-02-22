"use client";

import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

function Content() {
  const identity = useQuery(api.test.whoAmI);
  return <pre>{JSON.stringify(identity, null, 2)}</pre>;
}

function InitUser() {
  const createUser = useMutation(api.users.createUserIfNotExists);

  useEffect(() => {
    createUser();
  }, []);

  return null;
}

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <InitUser />
        <Content/>
        <div>You are signed in 🎉</div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
