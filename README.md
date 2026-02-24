🧠 Tars Chat App

A real-time one-on-one messaging application built using Next.js (App Router + TypeScript), Convex, and Clerk.
This project was built as part of a full-stack internship coding challenge. It focuses on clean schema design, real-time communication, and proper authentication flow.
It was my first time working with TypeScript, Convex, and Clerk together in a production-style setup, so I focused on understanding the architecture rather than just implementing features.

🚀 Tech Stack

Next.js (App Router)
TypeScript
Convex (Database + Real-time backend)
Clerk (Authentication)
Tailwind CSS
shadcn/ui

✨ Features

Secure authentication with Clerk --- 
Automatic user sync into Convex on login ---
Search users (excluding the current user) ---
One-on-one direct messaging ---
Real-time message updates using Convex subscriptions ---

Smart message timestamps:

Today → time only ---
Same year → month + day + time ---
Different year → full date + time ---
Message alignment (sent vs received) ---
Responsive layout (mobile-friendly chat view) ---
Clean conversation creation logic (no duplicate chats)

🗂 Database Schema

The backend is structured around three main tables:

Users

clerkId ---
email ---
name ---
image ---
createdAt

Conversations

userOne ---
userTwo ---
lastMessage ---
lastMessageAt ---
createdAt ---

Messages

conversationId ---
senderId ---
text ---
createdAt ---

Indexes are used to efficiently fetch conversations and messages in real time.

The schema is designed to be extensible (e.g., group chats could be added later without major restructuring).

⚙️ Architecture

Next.js (Frontend)
        ↓
Clerk (Authentication)
        ↓
Convex (Real-time Backend + Database)

Clerk handles authentication and session management.

Convex validates Clerk JWTs and provides real-time data updates.

The frontend subscribes to Convex queries for instant UI updates.

🔄 Real-Time Logic

Messages are retrieved using Convex queries and automatically update via subscriptions.
No manual polling is required — changes in the database instantly reflect in the UI.

The getOrCreate mutation ensures that:

A conversation between two users is reused if it already exists. ---
A new conversation is created only if necessary. ---
This prevents duplicate conversation threads. ---

📱 Responsive Design

Desktop: Sidebar + Chat window layout ---
Mobile: Sidebar collapses and chat takes full screen ---
Clean empty states and loading states ---

🛠 Running Locally

npm install ---
npx convex dev ---
npm run dev ---

Make sure to configure environment variables for Clerk and Convex before running.

🌍 Deployment

Frontend: Vercel ---
Backend: Convex Cloud

Authentication: Clerk (Development instance)

📌 Notes

This project helped me understand: 

Real-time systems using subscriptions ---
JWT-based authentication flow ---
Backend schema design with indexed queries ---
Environment alignment between development and production
