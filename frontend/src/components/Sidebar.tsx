"use client";

import { MessageSquare } from "lucide-react";

interface SidebarProps {
  chats: string[];
}

export default function Sidebar({
  chats,
}: SidebarProps) {

  return (

    <div className="hidden md:flex flex-col w-72 border-r border-zinc-800 bg-black/40 backdrop-blur-xl p-5">

      <h2 className="text-xl font-bold mb-6">
        Chat History
      </h2>

      <div className="space-y-3">

        {chats.map((chat, index) => (

          <div
            key={index}
            className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer flex items-center gap-3"
          >

            <MessageSquare size={18} />

            <p className="text-sm truncate">
              {chat}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}