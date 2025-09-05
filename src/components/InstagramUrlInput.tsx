import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Download, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  ext: string;
  filesize?: number;
  uploader: string;
}

const InstagramUrlInput = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateInstagramUrl = (url: string): boolean => {
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[a-zA-Z0-9_-]+\/?/;
    return instagramRegex.test(url);
  };

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError("Please enter an Instagram URL");
      return;
    }

    if (!validateInstagramUrl(url)) {
      setError("Please enter a valid Instagram post or reel URL");
      return;
    }

    setError("");
    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get video info");
      }

      setVideoInfo(data);
      toast({
        title: "Video info loaded",
        description: "Ready to download!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!url) return;
    
    // Open download URL in new tab
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}`;
    window.open(downloadUrl, '_blank');
    
    toast({
      title: "Download started",
      description: "Your video is being prepared...",
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Paste Instagram post or reel URL..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          className="glass-card text-center text-sm placeholder:text-muted-foreground/70"
        />
        
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm fade-in">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Get Info Button */}
      <Button
        onClick={handleGetInfo}
        disabled={loading || !url.trim()}
        variant="instagram"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 loading-spinner" />
            Getting info...
          </>
        ) : (
          <>
            <Info className="w-4 h-4" />
            Get Info
          </>
        )}
      </Button>

      {/* Video Info Display */}
      {videoInfo && (
        <div className="glass-card p-6 space-y-4 fade-in">
          {/* Thumbnail */}
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Video Details */}
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {videoInfo.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formatDuration(videoInfo.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(videoInfo.filesize)}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span>By:</span>
                <span className="truncate">@{videoInfo.uploader}</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            variant="instagram"
            className="w-full"
          >
            <Download className="w-4 h-4" />
            Download MP4
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstagramUrlInput;