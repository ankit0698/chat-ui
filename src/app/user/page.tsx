"use client";

import Chat from "../../../components/Chat";

interface ChatUser {
  id: string;
  name: string;
  status: "Online" | "Offline";
  lastMessage: string;
  unread: number;
  avatarColor: string;
}

interface Message {
  id: string;
  userId: string;
  position: "left" | "right";
  text: string;
  date: Date;
}

export default function UserPage() {
  const users: ChatUser[] = [
    {
      id: "user1",
      name: "Lily",
      status: "Online",
      lastMessage: "Always on holidays",
      unread: 0,
      avatarColor: "bg-gray-700",
    },
    {
      id: "user2",
      name: "Zoe",
      status: "Offline",
      lastMessage: "Great! Good luck with your ne...",
      unread: 0,
      avatarColor: "bg-gray-600",
    },
    {
      id: "user3",
      name: "Joe",
      status: "Offline",
      lastMessage: "Sleeping",
      unread: 0,
      avatarColor: "bg-gray-500",
    },
    {
      id: "user4",
      name: "Emily",
      status: "Online",
      lastMessage: "Are you there?",
      unread: 3,
      avatarColor: "bg-gray-800",
    },
  ];

  const initialMessages: Message[] = [
    {
      id: "msg-1",
      userId: "user2", // Zoe
      position: "right",
      text: "Hi Zoe!",
      date: new Date("2025-05-10T10:00:00"),
    },
    {
      id: "msg-2",
      userId: "user2",
      position: "right",
      text: "Hi, what's up?",
      date: new Date("2025-05-10T10:01:00"),
    },
    {
      id: "msg-3",
      userId: "user2",
      position: "left",
      text: "I am pleased to announce that on this beautiful magical day of the Fall Equinox, we have released the first version of the chat-ui-kit-react library",
      date: new Date("2025-05-10T10:02:00"),
    },
    {
      id: "msg-4",
      userId: "user2",
      position: "right",
      text: "That's great news! you must be very excited",
      date: new Date("2025-05-10T10:03:00"),
    },
    {
      id: "msg-5",
      userId: "user2",
      position: "left",
      text: "Yes I am :)",
      date: new Date("2025-05-10T10:04:00"),
    },
    {
      id: "msg-6",
      userId: "user2",
      position: "right",
      text: "I am so proud of your team :)",
      date: new Date("2025-05-10T10:05:00"),
    },
    {
      id: "msg-7",
      userId: "user2",
      position: "right",
      text: "Good luck with your new product!",
      date: new Date("2025-05-10T10:06:00"),
    },
    {
      id: "msg-8",
      userId: "user2",
      position: "left",
      text: "Thank You :)",
      date: new Date("2025-05-10T10:07:00"),
    },
    {
      id: "msg-9",
      userId: "user1", // Lily
      position: "right",
      text: "Hey Lily, how's it going?",
      date: new Date("2025-05-10T09:00:00"),
    },
    {
      id: "msg-10",
      userId: "user1",
      position: "left",
      text: "Pretty good, just chilling!",
      date: new Date("2025-05-10T09:01:00"),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="bg-black text-primary p-4">
        <h1 className="text-2xl font-bold text-white px-[5%]">Chat App</h1>
      </header>
      <main className="flex-1">
        <Chat users={users} initialMessages={initialMessages} />
      </main>
    </div>
  );
}
