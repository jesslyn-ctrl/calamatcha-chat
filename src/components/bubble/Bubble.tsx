import React from "react";

interface BubbleProps {
  text: string;
  position: "left" | "right";
}

const Bubble: React.FC<BubbleProps> = ({ text, position }) => {
  const bubbleStyle =
    position == "left"
      ? "bg-gray-300 text-gray-800 rounded-bl-lg rounded-tr-lg"
      : "bg-green-400 text-white rounded-br-lg rounded-tl-lg";
  const containerStyle = position == "left" ? "justify-start" : "justify-end";

  return (
    <div className={`flex ${containerStyle} mb-2`}>
      <div className={`px-4 py-2 max-w-sm break-all ${bubbleStyle}`}>
        {text}
      </div>
    </div>
  );
};

export default Bubble;
