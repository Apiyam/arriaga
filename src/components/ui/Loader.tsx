import { Loader2 } from "lucide-react";
type LoaderProps = {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}
export function Loader({ size = 24, text, fullScreen = false }: LoaderProps) {
  const sizeClass = `h-${size} w-${size}`;
  return (
    <div className={`flex flex-col justify-center items-center ${fullScreen ? "h-screen" : "h-full"}`}>
        <Loader2 className={`text-primary animate-spin ${sizeClass}`} />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}