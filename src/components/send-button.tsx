import React from "react";
import { Button } from "@/components/ui/button";
import { Loader, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

const SendButton = ({
  onClick,
  disabled,
  className,
  loading = false,
}: SendButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className={cn(
        "rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/80",
        className
      )}
      aria-label="Send message"
    >
      {loading ? (
        <Loader className="h-8 w-8 animate-spin" />
      ) : (
        <Send className="h-8 w-8" />
      )}
    </Button>
  );
};

export default SendButton;
