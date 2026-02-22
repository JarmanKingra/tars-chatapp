// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useState } from "react";

// export default function UserList() {
//   const users = useQuery(api.users.getAllUsers) || [];
//   const [search, setSearch] = useState("");

//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search users"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="p-2 mb-4 rounded-md bg-[var(--surface)] text-[var(--foreground)]"
//       />
//       <div>
//         {filteredUsers.length === 0 ? (
//           <p className="text-[var(--muted)]">No users found</p>
//         ) : (
//           filteredUsers.map((user) => (
//             <div
//               key={user._id}
//               className="p-2 mb-2 rounded-md hover:bg-[var(--surface-2)] cursor-pointer"
//               onClick={() => console.log("Open chat with", user.name)}
//             >
//               {user.name}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaSearch } from "react-icons/fa";

export default function UserList() {
  const users = useQuery(api.users.getAllUsers) || [];
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
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

      {/* User List */}
      <ScrollArea className="flex-1">
        {filteredUsers.length === 0 ? (
          <p className="text-[var(--muted)]">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <Card
              key={user._id}
              className="mb-2 p-2 hover:bg-[var(--surface-2)] cursor-pointer"
              onClick={() => console.log("Open chat with", user.name)}
            >
              {user.name}
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
