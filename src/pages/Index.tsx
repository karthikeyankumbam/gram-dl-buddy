import InstagramUrlInput from "@/components/InstagramUrlInput";
import instadlLogo from "@/assets/instadl-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <img 
              src={instadlLogo} 
              alt="InstaDL"
              className="w-16 h-16 rounded-xl shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              InstaDL
            </h1>
            <p className="text-white/80 text-sm">
              Download Instagram videos and reels with ease
            </p>
          </div>
        </div>

        {/* Main Component */}
        <InstagramUrlInput />

        {/* Footer */}
        <div className="text-center text-xs text-white/60 space-y-1">
          <p>Download only your content or with explicit permission</p>
          <p>Please respect Instagram's Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
