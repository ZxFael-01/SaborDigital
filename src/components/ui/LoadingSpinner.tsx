import { Loader2 } from 'lucide-react';

type LoadingSpinnerProps = {
  size?: number;
};

const LoadingSpinner = ({ size = 24 }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center w-full h-40">
      <Loader2 size={size} className="animate-spin text-accent" />
    </div>
  );
};

export default LoadingSpinner;