// src/components/LinkCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

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
    <Card className="w-full max-w-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 p-4">
      <CardContent>
        <div className="flex items-center space-x-6">
          {/* QR code on the left */}
          <div className="flex-shrink-0">
            <QRCode value={shortUrl} size={100} />
          </div>
          {/* Content on the right */}
          <div className="flex-1">
            <p className="text-lg font-medium mb-1">{title}</p>
            <p className="text-sm text-blue-500 mb-3 break-all">{shortUrl}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Clicks: {clickCount}</span>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
