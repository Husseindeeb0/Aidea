import { Eye, Package, Tag, CreditCard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store";
import { sendRequestThunk } from "../../states/request/requestThunk";
import { loginWithGoogle } from "../../states/auth/authAPI";

interface CategoriesCardProps {
  category: {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    items?: any[];
    price?: number;
  };
  isSelected: boolean;
  onViewItems: () => void;
  onSubscribe?: () => void;
}

const CategoriesCard = ({
  category,
  isSelected,
  onViewItems,
}: CategoriesCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [showNotice, setShowNotice] = useState(false);
  const [localIsRequested, setLocalIsRequested] = useState(false); // Local state to track request status
  const itemsCount = (category.items as any[])?.length || 0;
  const availableItems =
    (category.items as any[])?.filter((it) => it.state === "متاح").length || 0;

  // auto-hide notice after 60s
  useEffect(() => {
    if (!showNotice) return;
    const t = setTimeout(() => setShowNotice(false), 60000);
    return () => clearTimeout(t);
  }, [showNotice]);

const checkRequestedCategory = (categoryName: string) => {
  for (let i = 0; i < (userData?.requests?.length || 0); i++) {
    const req = userData.requests[i];
    if (req.categoryName === categoryName) {
      return { found: true, requestId: req._id };
    }
  }
  return { found: false, requestId: null };
};

  // Check both Redux state and local state
  const isRequestedFromRedux = checkRequestedCategory(category.name);
  const isRequested = isRequestedFromRedux || localIsRequested;

  // Update local state when Redux state changes
  useEffect(() => {
    if (isRequestedFromRedux) {
      setLocalIsRequested(true);
    }
  }, [isRequestedFromRedux]);

  // Handle subscription click
  const handleSubscribe = async () => {
    if (userData?._id) {
      try {
        // Set local state immediately to prevent double-clicking
        setLocalIsRequested(true);

        await dispatch(
          sendRequestThunk({
            userId: userData._id,
            categoryName: category.name,
          })
        ).unwrap(); // Use unwrap to handle success/failure properly

        setShowNotice(true);
      } catch (error) {
        // If request fails, revert local state
        setLocalIsRequested(false);
        console.error("Failed to send category request:", error);
      }
    } else {
      loginWithGoogle();
    }
  };

  return (
    <div
      className={`group relative transform transition-all duration-500 hover:-translate-y-3 ${
        isSelected
          ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/60 shadow-cyan-400/25 shadow-2xl scale-105"
          : "bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border-white/20 hover:border-cyan-400/40"
      } backdrop-blur-xl rounded-3xl p-6 border overflow-hidden`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 left-4 bg-cyan-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
          محدد
        </div>
      )}

      <div className="relative z-10">
        {/* Header section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-3 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
            >
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                  isSelected
                    ? "text-cyan-400"
                    : "text-white group-hover:text-cyan-400"
                }`}
              >
                {category.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>العناصر: {itemsCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>المتاحة: {availableItems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300 text-sm">
          {category.description}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewItems();
            }}
            className="w-full bg-gray-700/50 hover:bg-gray-600/60 border border-gray-600/50 hover:border-gray-500/60 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500/50 group/btn"
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>استعراض عناصر الفئة</span>
            </div>
          </button>

          {userData ? (
            !isRequested ? (
              <button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 group/btn"
              >
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span>
                    اشتراك الفئة
                    {typeof category.price === "number"
                      ? ` $${category.price}`
                      : ""}
                  </span>
                </div>
              </button>
            ) : (
              <div className="w-full bg-gradient-to-r from-red-500/30 to-pink-500/30 text-white font-semibold py-3 px-4 rounded-xl">
                <div className="flex items-center justify-center gap-2">
                  <span>انتظار القبول</span>
                </div>
              </div>
            )
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400/50 group/btn"
            >
              <div className="flex items-center justify-center gap-2">
                <span>تسجيل الدخول للاشتراك</span>
              </div>
            </button>
          )}
        </div>

        {/* Inline notice after sending request */}
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
    </div>
  );
};

export default CategoriesCard;
