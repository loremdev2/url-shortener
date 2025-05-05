// src/components/LinkCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

interface LinkCardProps {
  title: string;
  shortUrl: string;
  clickCount: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ title, shortUrl, clickCount }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy."));
  };

  return (
    <Card className="hover:shadow-lg transform hover:scale-105 transition-all duration-200 p-4">
      <CardContent>
        <p className="text-lg font-medium mb-2 text-center">{title}</p>
        <p className="text-center text-sm text-blue-500 mb-4 break-all">{shortUrl}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Clicks: {clickCount}</span>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;