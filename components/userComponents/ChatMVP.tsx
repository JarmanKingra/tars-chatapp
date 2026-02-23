"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaSearch } from "react-icons/fa";

export default function ChatMVP() {
  const users = useQuery(api.users.getAllUsers) ?? [];
  const getOrCreate = useMutation(api.conversations.getOrCreate);

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const [activeConversationId, setActiveConversationId] = useState<any>(null);

  return (
    <div className="flex h-screen">
      {/* <div className="w-1/4 border-r border-[var(--border)] p-3"> */}
      <div
        className={`
    ${isMobileChatOpen ? "hidden" : "flex"}
    w-full md:w-1/4
    p-2
    md:flex
    flex-col
    border-r
  `}
      >
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[var(--foreground)] font-semibold">
            Users
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSearch(!openSearch)}
            className="cursor-pointer"
          >
            <FaSearch />
          </Button>
        </div>

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
                // className="mb-2 p-2 hover:bg-[var(--surface-2)] cursor-pointer"
                className={`mb-2 p-2 cursor-pointer transition-colors
    ${
      activeUserId === user._id
        ? "bg-[var(--surface-2)]"
        : "hover:bg-[var(--surface-2)]"
    }`}
                onClick={async () => {
                  const convoId = await getOrCreate({ otherUserId: user._id });
                  setActiveConversationId(convoId);
                  setActiveUserId(user._id);
                  setIsMobileChatOpen(true);
                }}
              >
                {user.name}
              </Card>
            ))
          )}
        </ScrollArea>
      </div>

      {/* <div className="flex-1"> */}
      <div
        className={`
    ${isMobileChatOpen ? "flex" : "hidden"}
    md:flex
    w-full md:flex-1
    flex-col
  `}
      >
        <div className="md:hidden absolute">
           <button
          onClick={() => setIsMobileChatOpen(false)}
          className="text-sm border p-2 mt-2 rounded-2xl bg-[var(--primary)] cursor-pointer"
          >
            ← Back
          </button>
        </div>
        <ChatWindow conversationId={activeConversationId} />
      </div>
    </div>
  );
}

function ChatWindow({ conversationId }: { conversationId: any }) {
  const [text, setText] = useState("");
  const send = useMutation(api.messages.send);
  const me = useQuery(api.users.getCurrentUser);

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
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-end h-full ">
        {messages.length === 0 && (
          <div className="text-center text-[var(--muted)]">
            Start the conversation
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === me?._id;
          const messageDate = new Date(msg.createdAt);
          const now = new Date();

          const isToday = messageDate.toDateString() === now.toDateString();

          const isSameYear = messageDate.getFullYear() === now.getFullYear();

          let formattedTime;

          if (isToday) {
            formattedTime = messageDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (isSameYear) {
            formattedTime = messageDate.toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            formattedTime = messageDate.toLocaleString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black text-start"
                }`}
              >
                {msg.text}
                <div
                  className={`text-[0.65rem] mt-1 opacity-70 ${
                    isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {formattedTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-[var(--border)] p-3 flex gap-2 pb-20 md:pb-20">
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
