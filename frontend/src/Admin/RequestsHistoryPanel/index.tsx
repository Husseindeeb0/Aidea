import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsHistoryThunk } from "../../states/request/requestThunk";
import type { AppDispatch, RootState } from "../../store";

const RequestsHistoryPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requestsHistory, isLoading } = useSelector(
    (state: RootState) => state?.request
  );
  const fetchRequestsHistoryData = async () => {
    try {
      await dispatch(getRequestsHistoryThunk()).unwrap();
    } catch (error) {
      console.error("Error getting requests history:", error);
    }
  };

  useEffect(() => {
    // Always fetch courses when component mounts if not already loaded
    if (!requestsHistory || requestsHistory.length === 0) {
      fetchRequestsHistoryData();
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="animate-spin rounded-full  border-4 w-12 h-12 border-blue-500 border-t-transparent mx-auto mb-4"></div>
    );
  }

  return (
    <div className="space-y-6">
      {requestsHistory && requestsHistory.length > 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-sm font-semibold text-gray-200 w-full">
              <div className="min-w-0">اسم المستخدم</div>
              <div className="min-w-0">البريد الإلكتروني</div>
              <div className="min-w-0">اسم العنصر</div>
              <div className="min-w-0">الفئة</div>
              <div className="min-w-0">تاريخ المعالجة</div>
              <div className="min-w-0">تاريخ انتهاء الصلاحية</div>
              <div className="min-w-0">الحالة</div>
            </div>
          </div>

          <div className="divide-y divide-gray-700/50">
            {requestsHistory.map((request, index) => (
              <div
                key={request.id || index}
                className="p-4 hover:bg-white/5 transition-colors duration-300"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center w-full">
                  <div className="text-white font-medium min-w-0 truncate">
                    {request.userName}
                  </div>
                  <div className="text-gray-300 min-w-0 truncate">
                    {request.userEmail}
                  </div>
                  <div className="text-purple-400 min-w-0 truncate">
                    {request.itemName || "NA"}
                  </div>
                  <div className="text-purple-400 min-w-0 truncate">
                    {request.categoryName}
                  </div>
                  <div className="text-gray-400 min-w-0">
                    {new Date(request?.processedAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-400 min-w-0">
                    {new Date(request?.expiredDate).toLocaleDateString()}
                  </div>
                  <div
                    className={`font-medium min-w-0 ${
                      request.state === "accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {request.state === "accepted" ? "مقبول" : "مرفوض"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-2xl text-gray-400">
          لا توجد طلبات سابقة
        </div>
      )}
    </div>
  );
};

export default RequestsHistoryPanel;
