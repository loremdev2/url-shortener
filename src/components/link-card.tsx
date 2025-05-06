
// src/components/LinkCard.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import QRCodeLib from "qrcode";

interface LinkCardProps {
  title: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  shortUrl,
  clickCount,
  createdAt,
}) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>("");

  useEffect(() => {
    QRCodeLib.toDataURL(shortUrl, { margin: 1, width: 100 })
      .then((url) => setQrImageUrl(url))
      .catch((err) => console.error("QR generation failed:", err));
  }, [shortUrl]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy."));
  };

  const formattedDate = new Date(createdAt).toISOString();

  return (
    <Card className="w-full max-w-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 p-4">
      <CardContent className="relative">
        {/* Created date absolute top-right */}
        <p className="absolute top-4 right-4 text-sm text-gray-500">{formattedDate}</p>

        <div className="flex items-start space-x-6 pt-6">
          {/* QR image or loader */}
          <div className="flex-shrink-0">
            {qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="QR code"
                width={100}
                height={100}
                className="object-contain"
              />
            ) : (
              <div className="w-[100px] h-[100px] bg-gray-200 animate-pulse" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-lg font-medium">{title}</p>
            <p className="text-sm text-blue-500 break-all">{shortUrl}</p>
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