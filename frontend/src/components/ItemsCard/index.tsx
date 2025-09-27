import {
  Tag,
  DollarSign,
  CreditCard,
  Clock,
  Archive,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { ItemsCardProps } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { sendRequestThunk } from "../../states/request/requestThunk";
import { loginWithGoogle } from "../../states/auth/authAPI";

const ItemsCard = ({ item }: ItemsCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [showNotice, setShowNotice] = useState(false);
  const [localIsRequested, setLocalIsRequested] = useState(false); // Local state to track request status

  useEffect(() => {
    if (!showNotice) return;
    const t = setTimeout(() => setShowNotice(false), 60000);
    return () => clearTimeout(t);
  }, [showNotice]);

  // Check if this item already has a request
  const checkRequestedItem = (categoryName: string, itemName: string) => {
    for (let i = 0; i < (userData?.requests?.length || 0); i++) {
      const req = userData.requests[i];
      if (req.categoryName === categoryName && req.itemName === itemName) {
        return { found: true, requestId: req._id };
      }
    }
    return { found: false, requestId: null };
  };

  // Check both Redux state and local state
  const isRequestedFromRedux = checkRequestedItem(
    item.categoryName,
    item.title
  );
  const isRequested = isRequestedFromRedux || localIsRequested;

  // Update local state when Redux state changes
  useEffect(() => {
    if (isRequestedFromRedux) {
      setLocalIsRequested(true);
    }
  }, [isRequestedFromRedux]);

  // Function to get state color and styling
  const getStateConfig = (state: string) => {
    switch (state) {
      case "متاح":
        return {
          bgColor: "bg-emerald-500/20",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-400/30",
          icon: null,
          available: true,
        };
      case "قريباً":
        return {
          bgColor: "bg-amber-500/20",
          textColor: "text-amber-400",
          borderColor: "border-amber-400/30",
          icon: <Clock className="h-3 w-3" />,
          available: false,
        };
      case "مؤرشف":
        return {
          bgColor: "bg-gray-500/20",
          textColor: "text-gray-400",
          borderColor: "border-gray-400/30",
          icon: <Archive className="h-3 w-3" />,
          available: false,
        };
      default:
        return {
          bgColor: "bg-gray-500/20",
          textColor: "text-gray-400",
          borderColor: "border-gray-400/30",
          icon: null,
          available: false,
        };
    }
  };

  const stateConfig = getStateConfig(item.state);
  const isAvailable = stateConfig.available;

  // Handle subscription click
  const handleSubscribe = async () => {
    if (userData?._id) {
      try {
        // Set local state immediately to prevent double-clicking
        setLocalIsRequested(true);

        await dispatch(
          sendRequestThunk({
            userId: userData._id as string,
            categoryName: item.categoryName,
            itemName: item.title,
          })
        ).unwrap(); // Use unwrap to handle success/failure properly

        setShowNotice(true);
      } catch (error) {
        // If request fails, revert local state
        setLocalIsRequested(false);
        console.error("Failed to send request:", error);
      }
    } else {
      loginWithGoogle();
    }
  };

  const openUrl = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform transition-all duration-300 ${
        isAvailable
          ? "hover:border-cyan-400/50 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/10"
          : "opacity-75"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`text-xl font-semibold mb-1 transition-colors duration-300 ${
              isAvailable
                ? "text-white group-hover:text-cyan-400"
                : "text-gray-300"
            }`}
          >
            {item.title || "عنصر غير مُسمى"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Tag className="h-3 w-3" />
            <span>{item.categoryName}</span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${stateConfig.bgColor} ${stateConfig.textColor} ${stateConfig.borderColor} border`}
        >
          {stateConfig.icon}
          <span>{item.state}</span>
        </div>
      </div>

      <div
        className={`mb-4 line-clamp-3 ${
          isAvailable ? "text-gray-300" : "text-gray-400"
        }`}
      >
        {item.description}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <DollarSign
            className={`h-4 w-4 ${
              isAvailable ? "text-yellow-400" : "text-gray-400"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              isAvailable ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            {item.price}
          </span>
        </div>

        {/* Conditional button based on availability and request status */}
        {item.price === 0 ? (
          <button
            onClick={() => openUrl(item.url)}
            disabled={item.state !== "متاح"}
            className={`font-semibold py-2 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
              item.state === "متاح"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>
              {item.state === "متاح" ? "فتح الخدمة" : "غير متاح حالياً"}
            </span>
            <ExternalLink className="w-5 h-5" />
          </button>
        ) : userData && isAvailable ? (
          !isRequested ? (
            // Available and not requested - Show subscribe button
            <button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              onClick={handleSubscribe}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>اشترك الآن</span>
              </div>
            </button>
          ) : (
            // Available but already requested - Show pending status
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium">
              <div className="flex items-center gap-2">
                <span>انتظار القبول</span>
              </div>
            </div>
          )
        ) : userData && !isAvailable ? (
          // Not available - Show disabled button
          <div className="bg-gray-600/50 text-gray-400 px-6 py-2 rounded-lg font-medium cursor-not-allowed border border-gray-500/30 relative overflow-hidden">
            <div className="flex items-center gap-2">
              {item.state === "قريباً" ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>قريباً</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>غير متاح</span>
                </>
              )}
            </div>
            {/* Diagonal stripes pattern for disabled state */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 opacity-30"></div>
          </div>
        ) : !userData ? (
          // Not logged in - Show login prompt (only if available)
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isAvailable
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                : "bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30"
            }`}
            onClick={() => {
              if (isAvailable) {
                loginWithGoogle();
              }
            }}
            disabled={!isAvailable}
          >
            <div className="flex items-center gap-2">
              <span>{isAvailable ? "تسجيل الدخول" : "غير متاح"}</span>
            </div>
          </button>
        ) : null}
      </div>

      {showNotice && (
        <div className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 p-4 text-sm">
          لإكمال عملية الدفع، تواصل معنا عبر الواتساب:{" "}
          <a
            href="https://wa.me/0123456789"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-cyan-400 hover:text-white ml-1"
          >
            0123456789
          </a>
        </div>
      )}
    </div>
  );
};

export default ItemsCard;
