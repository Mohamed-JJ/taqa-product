interface LoadingOverlayProps {
  isVisible: boolean;
  currentService: string;
}

export const LoadingOverlay = ({ isVisible, currentService }: LoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[500px] h-[200px] p-8 shadow-2xl flex flex-col items-center gap-4 border border-gray-200">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-taqa-primary/20 border-t-taqa-primary rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-taqa-secondary rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Updating Dashboard
          </h3>
          <p className="text-sm text-gray-600">
            Loading data for {currentService || "All"} services...
          </p>
        </div>
      </div>
    </div>
  );
}; 