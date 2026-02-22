// "use client";

// import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { api } from "../convex/_generated/api";
// import { useEffect } from "react";

// function Content() {
//   const identity = useQuery(api.test.whoAmI);
//   return <pre>{JSON.stringify(identity, null, 2)}</pre>;
// }

// function InitUser() {
//   const createUser = useMutation(api.users.createUserIfNotExists);

//   useEffect(() => {
//     createUser();
//   }, []);

//   return null;
// }

// export default function Home() {
//   return (
//     <>
//       <Authenticated>
//         <UserButton />
//         <InitUser />
//         <div>You are signed in 🎉</div>
//       </Authenticated>
//       <Unauthenticated>
//         <SignInButton />
//       </Unauthenticated>
//     </>
//   );
// }

"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import UserList from "../components/userComponents/UserList";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <Landing />
      </Unauthenticated>

      <Authenticated>
        <InitUser/>
        <ChatLayout />
      </Authenticated>
    </>
  );
}

function InitUser() {
  const createUser = useMutation(api.users.createUserIfNotExists);

  useEffect(() => {
    createUser();
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
    <div className="flex h-screen">
      <div className="w-64 border-r p-4">
        <h2 className="font-semibold mb-4">Chats</h2>
        <UserList/>
        <div className="text-[var(--muted)] text-sm">No conversations yet</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-semibold">Welcome</h2>
          <UserButton />
        </div>

        <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
          Select or start a conversation
        </div>
      </div>
    </div>
  );
}
