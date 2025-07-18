import { Button } from "@/components/ui/button";

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  const handleEnter = () => {
    onEnter();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6 animate-fade-in">
        <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Whispering Network
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light italic leading-relaxed">
            "In this sacred space, every whisper finds its wings, every thought discovers its voice, and every soul remembers it deserves to be heard."
          </p>
          <Button 
            onClick={handleEnter}
            className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Enter
          </Button>
          <div className="mt-8 text-sm text-gray-600">
            Made with love from <span className="font-semibold text-primary">IRON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
