import { useState } from "preact/hooks";

interface SupportMessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function SupportMessageInput({ onSendMessage }: SupportMessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
        placeholder="Type your message..."
        className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#109121]"
      />
      <button
        type="submit"
        className="bg-[#109121] hover:bg-[#0d7a1b] text-white px-6 py-2 rounded-lg transition-colors"
      >
        Send
      </button>
    </form>
  );
}

