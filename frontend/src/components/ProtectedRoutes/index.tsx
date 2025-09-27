import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin }: ProtectedRouteProps) => {
  const { userData, isAuthenticating } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticating) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
        <div className="text-center">
          {/* Animated Logo/Icon */}
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            {/* Orbiting dots */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-4"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-4"></div>
              <div className="absolute top-1/2 left-0 w-2 h-2 bg-indigo-400 rounded-full transform -translate-y-1/2 -translate-x-4"></div>
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-pink-400 rounded-full transform -translate-y-1/2 translate-x-4"></div>
            </div>
          </div>

          {/* Loading Text with Animation */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aidea
            </h2>

            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600 font-medium">Loading</span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Checking your authentication status...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    ); // block until checkAuth finishes
  }

  if (!userData) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
