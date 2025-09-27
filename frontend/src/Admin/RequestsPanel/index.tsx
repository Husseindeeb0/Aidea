import { useEffect } from "react";
import { X, Check } from "lucide-react";
import type { Request } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  getRequestsThunk,
  allowRequestThunk,
  rejectRequestThunk,
} from "../../states/request/requestThunk";

const RequestsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, isLoading } = useSelector(
    (state: RootState) => state?.request
  );

  const fetchRequestsData = async () => {
    try {
      await dispatch(getRequestsThunk()).unwrap();
    } catch (error) {
      console.error("Error getting requests:", error);
    }
  };

  useEffect(() => {
    // Always fetch courses when component mounts if not already loaded
    if (!requests || requests.length === 0) {
      fetchRequestsData();
    }
  }, [dispatch]);

  const handleApprove = async (request: { userId: string; id: string }) => {
    try {
      await dispatch(allowRequestThunk(request)).unwrap();
      await fetchRequestsData();
    } catch (error) {
      console.error("Error allowing request:", error);
    }
  };

  const handleReject = async (request: { userId: string; id: string }) => {
    try {
      await dispatch(rejectRequestThunk(request)).unwrap();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-spin rounded-full  border-4 w-12 h-12 border-blue-500 border-t-transparent mx-auto mb-4"></div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة طلبات الوصول</h2>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-sm font-semibold text-gray-200 w-full">
            <div className="min-w-0">اسم المستخدم</div>
            <div className="min-w-0">البريد الإلكتروني</div>
            <div className="min-w-0">اسم العنصر</div>
            <div className="min-w-0">الفئة</div>
            <div className="min-w-0">تاريخ الطلب</div>
            <div className="min-w-0">الإجراءات</div>
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {(requests ?? []).map((request: Request) => (
            <div
              key={request.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 items-center w-full">
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
                <div className="text-gray-400 min-w-0 text-sm">
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2 min-w-0">
                  <button
                    onClick={() =>
                      handleApprove({ userId: request.userId, id: request.id })
                    }
                    className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors duration-300"
                  >
                    <Check className="h-4 w-4 text-green-400" />
                  </button>
                  <button
                    onClick={() =>
                      handleReject({ userId: request.userId, id: request.id })
                    }
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors duration-300"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              لا توجد طلبات جديدة
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPanel;
