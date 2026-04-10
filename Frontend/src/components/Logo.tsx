import { Leaf, Scan } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Leaf icon as base */}
        <Leaf className="w-full h-full text-primary" strokeWidth={2} />
        {/* Scan overlay for AI detection theme */}
        <Scan className="absolute inset-0 w-full h-full text-accent/60 scale-75" strokeWidth={1.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold text-foreground ${textSizeClasses[size]}`}>
            Smart Crop
          </span>
          <span className="text-xs text-primary font-medium tracking-wide">
            DETECTOR
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
