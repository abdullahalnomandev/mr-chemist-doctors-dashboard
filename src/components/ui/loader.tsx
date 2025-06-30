import { cn } from "@/lib/utils";
import { CircleDashed, LucideProps } from "lucide-react";
import { forwardRef } from "react";

const Loader = forwardRef<SVGSVGElement, LucideProps>(({ className, ...props }, ref) => <CircleDashed ref={ref} className={cn("h-5 w-5 animate-spin", className)} {...props} />);

Loader.displayName = "Loader";

export default Loader;

export const Loading = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} className="flex w-full items-center justify-center py-3.5 text-secondary-foreground" {...props}>
    <Loader />
  </div>
));

Loading.displayName = "Loading";
