"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaSearch } from "react-icons/fa";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function UserList() {
  const users = useQuery(api.users.getAllUsers) || [];
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const getOrCreate = useMutation(api.conversations.getOrCreate);
  const [activeConversationId, setActiveConversationId] = useState<any>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 flex flex-col h-full bg-[var(--surface)]">
      {/* Search Toggle */}
      <div className="flex items-center justify-between mb-2">
        <Label className="text-[var(--foreground)] font-semibold">Users</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenSearch(!openSearch)}
        >
          <FaSearch />
        </Button>
      </div>

      {/* Search Input */}
      {openSearch && (
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 bg-[var(--surface-2)] text-[var(--foreground)] border-[var(--border)]"
        />
      )}

      <ScrollArea className="flex-1">
        {filteredUsers.length === 0 ? (
          <p className="text-[var(--muted)]">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <Card
              key={user._id}
              className="mb-2 p-2 hover:bg-[var(--surface-2)] cursor-pointer"
              onClick={async () => {
                const convoId = await getOrCreate({ otherUserId: user._id });
                setActiveConversationId(convoId);
              }}
            >
              {user.name}
              <UserButton/>
            </Card>
          ))
        )}
      </ScrollArea>
      <div className="flex-1">
        <ChatWindow conversationId={activeConversationId} />
      </div>
    </div>
  );
}

function ChatWindow({ conversationId }: { conversationId: any }) {
  const [text, setText] = useState("");
  const send = useMutation(api.messages.send);

  const messages =
    useQuery(api.messages.list, conversationId ? { conversationId } : "skip") ??
    [];

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--muted)]">
        Click a user to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m._id} className="bg-[var(--surface)] p-2 rounded-md">
            {m.text}
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] p-3 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type…"
        />
        <button
          className="px-4 rounded-md bg-[var(--primary)] text-white"
          onClick={async () => {
            const t = text.trim();
            if (!t) return;
            await send({ conversationId, text: t });
            setText("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
