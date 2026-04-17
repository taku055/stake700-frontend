import { tSupportMessage } from "@/types/tSupportMessages";

interface SupportMessageProps {
  data: tSupportMessage;
  onTopicClick: (topic: string) => void;
}

export default function SupportMessage({ data, onTopicClick }: SupportMessageProps) {
  if (data.type === "USER") {
    return (
      <div className="flex justify-end">
        <div className="bg-[#109121] text-white px-4 py-2 rounded-lg max-w-[80%] break-words">
          <p className="text-sm">{data.message}</p>
        </div>
      </div>
    );
  }

  if (data.type === "AI") {
    return (
      <div className="flex justify-start">
        <div className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg max-w-[80%] break-words">
          <p className="text-sm">{data.message}</p>
        </div>
      </div>
    );
  }

  if (data.type === "TOPIC") {
    // Split topic response by commas and filter out empty strings
    const topics = data.message.split(",").map((topic) => topic.trim()).filter((topic) => topic.length > 0);
    
    return (
      <div className="flex justify-start flex-wrap gap-2">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicClick(topic)}
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#109121] px-4 py-2 rounded-lg border border-[#109121] transition-colors cursor-pointer break-words"
          >
            <p className="text-sm">{topic}</p>
          </button>
        ))}
      </div>
    );
  }

  return null;
}

