"use client";

import React from "react";
import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import moment from "moment";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";

interface ILiveSupportMessage {
  data: tLiveSupportMessage;
}

const LiveSupportMessage: React.FC<ILiveSupportMessage> = ({ data }) => {
  const isFromUser = !data.supporterId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 items-end ${isFromUser ? "justify-end" : "justify-start"}`}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={isFromUser ? data.User?.avatar || "/images/default-avatar.png" : "/images/avatar-talk.png"}
        alt=""
      />
      <div className={`max-w-[70%] p-3 text-sm rounded-lg whitespace-pre-line break-words ${isFromUser ? "bg-[#0F212E] text-white" : "bg-[#e6e7e7] text-gray-800"}`}>
        <div dangerouslySetInnerHTML={{ __html: data.message }} />
        <div className="text-[12px] mt-1 text-right text-gray-300">
          {moment(data.createdAt).format("hh:mm A")}
          {data.status === 1 && <Spinner classNames={{ wrapper: "w-[12px] h-[12px]" }} variant="gradient" color="default" />}
        </div>
      </div>
    </motion.div>
  );

};

export default LiveSupportMessage;
