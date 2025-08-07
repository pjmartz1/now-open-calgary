

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">Loading Calgary businesses...</p>
        <p className="text-sm text-gray-500">Connecting to City of Calgary Business Licenses API</p>
      </div>
    </div>
  );
};