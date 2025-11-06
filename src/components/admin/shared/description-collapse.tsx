import { useState } from "react";

const DescriptionCollapse: React.FC<{ description?: string }> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const text = description || "-";
  const isLong = text.length > 130; // adjust as needed
  const displayText = !expanded && isLong ? text.slice(0, 130) + "..." : text;

  return (
    <div className={`text-muted-foreground max-w-full text-[13px] break-words whitespace-pre-line`}>
      {displayText}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary ml-1 cursor-pointer text-[13px] font-semibold underline"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default DescriptionCollapse;
