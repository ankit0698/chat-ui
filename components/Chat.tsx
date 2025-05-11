"use client";

import { useState, useRef, useEffect } from "react";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Send } from "@mui/icons-material";

interface Message {
  id: string;
  userId: string;
  position: "left" | "right";
  text: string;
  date: Date;
  imageUrl?: string;
}

interface ChatUser {
  id: string;
  name: string;
  status: "Online" | "Offline";
  lastMessage: string;
  unread: number;
  avatarColor: string;
}

interface ChatProps {
  users: ChatUser[];
  initialMessages?: Message[];
}

const Chat: React.FC<ChatProps> = ({ users, initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMediaView, setShowMediaView] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"userList" | "chat" | "media">(
    "userList"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageIdCounter = useRef(initialMessages.length + 1);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(
    users.length > 0 ? users[1] : null
  );

  // Handle scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser, showMediaView]);

  // Handle typing indicator
  useEffect(() => {
    if (inputText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [inputText]);

  // Handle screen resize to fix edge case
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileView("userList"); // Reset to userList for side-by-side layout in web view
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = () => {
    if ((inputText.trim() === "" && !selectedImage) || !selectedUser) return;

    const newMessage: Message = {
      id: `msg-${messageIdCounter.current++}`,
      userId: selectedUser.id,
      position: "right",
      text: inputText,
      date: new Date(),
      imageUrl: selectedImage || undefined,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setSelectedImage(null);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${messageIdCounter.current++}`,
          userId: selectedUser.id,
          position: "left",
          text: "Thanks for the message! How can I assist you further?",
          date: new Date(),
        },
      ]);
    }, 1000);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("Selected image:", file.name);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    } else {
      console.log("Please select an image file.");
    }
    event.target.value = "";
  };

  // Filter messages for the selected user
  const userMessages = selectedUser
    ? messages.filter((msg) => msg.userId === selectedUser.id)
    : [];

  // Get images for the selected user's chat
  const mediaImages = userMessages
    .filter((msg) => msg.imageUrl)
    .map((msg) => msg.imageUrl!);

  // Handle user selection and view transition
  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    setMobileView("chat");
    setShowMediaView(false);
  };

  // Handle back navigation to user list
  const handleBackToUserList = () => {
    setMobileView("userList");
    setSelectedUser(null);
    setShowMediaView(false);
  };

  // Handle media view navigation
  const handleShowMediaView = () => {
    setMobileView("media");
    setShowMediaView(true);
  };

  // Handle back to chat from media
  const handleBackToChat = () => {
    setMobileView("chat");
    setShowMediaView(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] max-w-7xl mx-auto mt-8 border border-gray-300 bg-white shadow-2xl rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-bounce1 {
          animation: bounce 0.6s infinite;
        }
        .animate-bounce2 {
          animation: bounce 0.6s infinite 0.1s;
        }
        .animate-bounce3 {
          animation: bounce 0.6s infinite 0.2s;
        }
      `}</style>

      {/* User List: Shown in mobile userList view or always in web view */}
      <div
        className={`w-full md:w-[30%] border-b md:border-b-0 md:border-r border-gray-300 bg-white py-6 ${
          window.innerWidth >= 768 || mobileView === "userList"
            ? "block"
            : "hidden"
        }`}
      >
        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-12 pr-4 rounded-full bg-gray-200 text-black border-none focus:outline-none focus:ring-2 focus:ring-black shadow-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Chat Users */}
        <div className="overflow-y-auto h-[calc(100vh-160px)] px-1 sm:px-2 py-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 animate-fadeIn ${
                  selectedUser?.id === user.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 ${user.avatarColor} text-white rounded-full flex items-center justify-center text-xl font-semibold mr-4 shadow-md`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                      user.status === "Online" ? "bg-green-500" : "bg-gray-500"
                    } shadow, shadow-sm`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-black text-lg">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 truncate mt-1">
                    {user.lastMessage || "No messages yet"}
                  </div>
                </div>
                {user.unread > 0 && (
                  <div className="bg-black text-white text-xs rounded-full px-2 py-1 shadow-sm">
                    {user.unread}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window and Media View: Shown in mobile chat/media view or always in web view */}
      <div
        className={`flex flex-col w-full md:w-3/4 h-full relative ${
          window.innerWidth >= 768 || mobileView !== "userList"
            ? "block"
            : "hidden"
        }`}
      >
        {/* Chat Header: Shown when not in media view */}
        {!showMediaView && (
          <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between shadow-sm">
            {selectedUser ? (
              <div className="flex items-center">
                <IconButton
                  onClick={handleBackToUserList}
                  sx={{
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    mr: 2,
                    "&:hover": {
                      bgcolor: "#333333",
                    },
                    display: { xs: "inline-flex", md: "none" }, // Show back button only on mobile
                  }}
                  aria-label="Back to user list"
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <div
                  className={`w-10 h-10 ${selectedUser.avatarColor} text-white rounded-full flex items-center justify-center text-xl font-semibold mr-4 shadow-md`}
                >
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <div className="font-semibold text-black text-lg">
                    {selectedUser.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedUser.status === "Online"
                      ? "Online"
                      : "Active 10 mins ago"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-black text-lg">
                Select a user to start chatting
              </div>
            )}
            {selectedUser && (
              <IconButton
                onClick={handleShowMediaView}
                sx={{
                  bgcolor: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "#333333",
                    transform: "scale(1.1)",
                  },
                }}
                aria-label="View media"
              >
                <PhotoLibraryIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        )}

        {showMediaView && selectedUser && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <IconButton
                  onClick={handleBackToChat}
                  sx={{
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    mr: 2,
                    "&:hover": {
                      bgcolor: "#333333",
                    },
                    display: { xs: "inline-flex", md: "none" },
                  }}
                  aria-label="Back to chat"
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <div className="text-black text-lg font-semibold">Media</div>
              </div>
              <IconButton
                onClick={handleBackToChat}
                sx={{
                  bgcolor: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "#333333",
                  },
                }}
                aria-label="Close media view"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 overflow-x-auto">
              {mediaImages.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  No images shared
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mediaImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt="Shared media"
                      className="w-70 h-80 object-cover rounded-lg cursor-pointer p-2 bg-gray-400 hover:opacity-80 transition-opacity duration-200"
                      onClick={() => setFullScreenImage(imageUrl)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full-Screen Image Modal */}
        {fullScreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-20 flex items-center justify-center">
            <IconButton
              onClick={() => setFullScreenImage(null)}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#000000",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: 36,
                height: 36,
                "&:hover": {
                  bgcolor: "#333333",
                },
              }}
              aria-label="Close full-screen image"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <img
              src={fullScreenImage}
              alt="Full-screen image"
              className="max-w-[90%] max-h-[90%] object-contain"
            />
          </div>
        )}

        {/* Message Area: Shown when not in media view */}
        {!showMediaView && (
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100 flex flex-col">
            {selectedUser ? (
              userMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-6 max-w-[70%] ${
                    msg.position === "right" ? "ml-auto" : "mr-auto"
                  } animate-fadeIn`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-lg ${
                      msg.position === "right"
                        ? "bg-black text-white"
                        : "bg-white text-black border border-gray-300"
                    } hover:scale-[1.02] transition-transform duration-200`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Sent image"
                        className="max-w-[200px] w-full rounded-lg mb-2"
                      />
                    )}
                    {msg.text && (
                      <p className="text-base leading-relaxed">{msg.text}</p>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {msg.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4">
                No user selected
              </div>
            )}
            {isTyping && selectedUser && (
              <div className="flex mb-6 max-w-[70%] mr-auto transition-opacity duration-300">
                <div className="p-4 rounded-2xl bg-white text-black border border-gray-300 shadow-lg">
                  <p className="text-sm text-gray-500 italic">
                    <span className="inline-block animate-bounce1">.</span>
                    <span className="inline-block animate-bounce2">.</span>
                    <span className="inline-block animate-bounce3">.</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area: Shown when not in media view */}
        {!showMediaView && (
          <div className="p-4 border-t border-gray-300 bg-white shadow-lg">
            {selectedImage && (
              <div className="relative mb-4">
                <img
                  src={selectedImage}
                  alt="Selected image preview"
                  className="h-20 w-20 rounded-lg"
                />
                <IconButton
                  onClick={() => setSelectedImage(null)}
                  sx={{
                    position: "absolute",
                    top: -12,
                    right: -12,
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    "&:hover": {
                      bgcolor: "#333333",
                    },
                  }}
                  aria-label="Remove image"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <IconButton
                  onClick={handleAttachClick}
                  sx={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: "#333333",
                      transform: "translateY(-50%) scale(1.1)",
                    },
                  }}
                  aria-label="Attach file"
                >
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {inputText.length < 150 ? (
                  <input
                    type="text"
                    placeholder={
                      selectedImage ? "Add a caption..." : "Type message here"
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`w-full bg-gray-200 text-black border-none rounded-full pl-14 ${
                      inputText.length === 0 ? "pr-24" : "pr-14"
                    } py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-md transition-all duration-300 placeholder-gray-500`}
                  />
                ) : (
                  <textarea
                    placeholder={
                      selectedImage ? "Add a caption..." : "Type message here"
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`w-full bg-gray-200 text-black border-none rounded-full pl-14 ${
                      inputText.length === 0 ? "pr-24" : "pr-14"
                    } py-3 resize-none min-h-12 max-h-44 focus:outline-none focus:ring-2 focus:ring-black shadow-md transition-all duration-300 overflow-y-auto placeholder-gray-500`}
                  />
                )}
              </div>
              <div
                className={`${
                  inputText.length > 0 || selectedImage
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0"
                } bg-black text-white rounded-full w-[10%] min-w-[48px] cursor-pointer h-12 flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-gray-800 hover:scale-105 text-sm font-semibold`}
              >
                <Send onClick={handleSendMessage} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
