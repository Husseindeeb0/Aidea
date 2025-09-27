// MySubscriptions.tsx - Styled Version with Purple/Pink/Cyan Theme
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ExternalLink,
  Calendar,
  FileText,
  Globe,
  Package,
  Sparkles,
} from "lucide-react";
import type { AppDispatch, RootState } from "../../store";
import { getUserSubscriptionsThunk } from "../../states/request/requestThunk";

export interface SubscriptionItem {
  _id: string;
  title: string;
  description: string;
  url?: string;
  state: "متاح" | "قريباً" | "مؤرشف";
  price: number;
  createdAt: string;
  categoryName: string;
  expiredDate: string;
}

const MySubscriptions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { subscriptions, isLoading, error } = useSelector(
    (state: RootState) => state.request
  );

  // CRITICAL FIX: Ensure subscriptions is always an array
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  useEffect(() => {
    dispatch(getUserSubscriptionsThunk());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const openUrl = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "متاح":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "قريباً":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "مؤرشف":
        return "bg-slate-50 text-slate-600 border border-slate-200";
      default:
        return "bg-purple-50 text-purple-700 border border-purple-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-center">
          <div className="relative">
            {/* Custom circular spinner */}
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto">
              <div
                className="w-16 h-16 border-4 border-transparent border-r-pink-200 rounded-full animate-spin"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
          <p className="text-white text-lg font-medium">جارٍ التحميل...</p>
          <p className="text-white/80 text-sm mt-2">يتم تحميل اشتراكاتك</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getUserSubscriptionsThunk())}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 pt-20 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-700 to-purple-600 bg-clip-text text-transparent">
                اشتراكاتي
              </h1>
              <p className="text-gray-600 text-lg">
                الخدمات والمحتويات المتاحة لك
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {safeSubscriptions.length}
                </p>
                <p className="text-gray-600 font-medium">إجمالي الاشتراكات</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Globe className="w-8 h-8 text-pink-600" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent">
                  {new Set(safeSubscriptions.map((s) => s.categoryName)).size}
                </p>
                <p className="text-gray-600 font-medium">الفئات المسموحة</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-8 h-8 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  {safeSubscriptions.filter((s) => s.state === "متاح").length}
                </p>
                <p className="text-gray-600 font-medium">العناصر المتاحة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {safeSubscriptions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-white/20 to-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
              <Package className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              لا توجد اشتراكات حالياً
            </h3>
            <p className="text-white/90 max-w-md mx-auto text-lg leading-relaxed">
              لم يتم العثور على أي خدمات أو محتويات متاحة لك في الوقت الحالي.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeSubscriptions.map((item, index) => (
              <div
                key={item._id}
                className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2 relative"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl p-0.5">
                  <div className="bg-gradient-to-br from-white/95 to-white/90 rounded-3xl w-full h-full"></div>
                </div>

                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="p-8 pb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-sm font-semibold rounded-full border border-purple-200">
                            {item.categoryName}
                          </span>
                          <span
                            className={`px-4 py-2 text-sm font-semibold rounded-full ${getStateColor(
                              item.state
                            )}`}
                          >
                            {item.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                      <Calendar className="w-5 h-5 text-cyan-500" />
                      <span>ينتهي اشتراكك في: {formatDate(item.expiredDate)}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-8 pb-8">
                    {item.url ? (
                      <button
                        onClick={() => openUrl(item.url)}
                        disabled={item.state !== "متاح"}
                        className={`w-full font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                          item.state === "متاح"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:via-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            : "bg-gray-100 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <span>
                          {item.state === "متاح"
                            ? "فتح الخدمة"
                            : "غير متاح حالياً"}
                        </span>
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 font-semibold py-4 px-6 rounded-2xl text-center">
                        لا يتوفر رابط
                      </div>
                    )}
                  </div>
                </div>

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
