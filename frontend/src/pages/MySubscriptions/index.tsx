import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Calendar,
  FileText,
  Globe,
  Package,
  Sparkles,
  AlertCircle,
} from "lucide-react";

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
  source?: 'allowedItem' | 'allowedCategory';
}

// Mock API response to simulate different response structures
const mockApiResponse = {
  success: true,
  allowedItems: [
    {
      _id: "1",
      title: "دورة تطوير المواقع",
      description: "تعلم تطوير المواقع من البداية حتى الاحتراف",
      url: "https://example.com/course1",
      state: "متاح",
      price: 299,
      createdAt: "2024-01-15T10:00:00Z",
      categoryName: "البرمجة",
      expiredDate: "2024-12-31T23:59:59Z",
      source: "allowedItem"
    }
  ],
  totalItems: 1
};

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate the API response you're getting
        const apiResponse = mockApiResponse;
        
        // Debug the response structure
        console.log('API Response:', apiResponse);
        setDebugInfo(apiResponse);
        
        // Extract subscriptions based on your backend response structure
        let subscriptionsData: SubscriptionItem[] = [];
        
        if (apiResponse.success && apiResponse.allowedItems) {
          // Your backend returns { success: true, allowedItems: [...] }
          subscriptionsData = apiResponse.allowedItems;
        } else if (Array.isArray(apiResponse)) {
          // If API returns array directly
          subscriptionsData = apiResponse;
        } else if (apiResponse.subscriptions) {
          // If API returns { subscriptions: [...] }
          subscriptionsData = apiResponse.subscriptions;
        } else {
          // Fallback - check if the response itself is the array
          subscriptionsData = [];
        }

        console.log('Processed subscriptions:', subscriptionsData);
        console.log('Is array?', Array.isArray(subscriptionsData));
        
        setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
        
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || "فشل في تحميل الاشتراكات");
        setSubscriptions([]); // Ensure it's always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long", 
        day: "numeric",
      });
    } catch {
      return "تاريخ غير صالح";
    }
  };

  const openUrl = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "متاح":
        return "bg-green-50 text-green-700";
      case "قريباً":
        return "bg-yellow-50 text-yellow-700";
      case "مؤرشف":
        return "bg-gray-50 text-gray-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  // Debug panel - remove this in production
  const DebugPanel = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-yellow-800 font-bold mb-2">🐛 Debug Info (Remove in Production)</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <p><strong>Subscriptions Type:</strong> {typeof subscriptions}</p>
        <p><strong>Is Array:</strong> {String(Array.isArray(subscriptions))}</p>
        <p><strong>Length:</strong> {Array.isArray(subscriptions) ? subscriptions.length : 'N/A'}</p>
        <p><strong>Loading:</strong> {String(isLoading)}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold">Raw API Response</summary>
          <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold">Processed Subscriptions</summary>
          <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto">
            {JSON.stringify(subscriptions, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Ensure subscriptions is always an array
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <DebugPanel />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">اشتراكاتي</h1>
              <p className="text-gray-600">الخدمات والمحتويات المتاحة لك</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {safeSubscriptions.length}
                </p>
                <p className="text-sm text-gray-600">إجمالي الاشتراكات</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(safeSubscriptions.map((s: SubscriptionItem) => s.categoryName)).size}
                </p>
                <p className="text-sm text-gray-600">الفئات المسموحة</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {safeSubscriptions.filter((s: SubscriptionItem) => s.state === "متاح").length}
                </p>
                <p className="text-sm text-gray-600">العناصر المتاحة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {safeSubscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد اشتراكات حالياً
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              لم يتم العثور على أي خدمات أو محتويات متاحة لك في الوقت الحالي.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeSubscriptions.map((item: SubscriptionItem) => (
              <div
                key={`${item._id}-${item.categoryName}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {item.categoryName}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStateColor(item.state)}`}>
                          {item.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Dates */}
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ الإضافة: {formatDate(item.createdAt)}</span>
                    </div>
                    {item.expiredDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>تاريخ الانتهاء: {formatDate(item.expiredDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {item.price && item.price > 0 && (
                    <div className="text-sm font-semibold text-green-600 mb-4">
                      السعر: {item.price} ر.س
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  {item.url ? (
                    <button
                      onClick={() => openUrl(item.url)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
                      disabled={item.state !== "متاح"}
                    >
                      <span>{item.state === "متاح" ? "فتح الخدمة" : "غير متاح"}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 font-medium py-3 px-4 rounded-xl text-center">
                      لا يتوفر رابط
                    </div>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;