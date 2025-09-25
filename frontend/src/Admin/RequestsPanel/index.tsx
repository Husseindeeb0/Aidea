import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import type { Request } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { removeRequestThunk } from "../../states/request/requestThunk";
import { getRequestsThunk } from "../../states/request/requestThunk";

const RequestsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests } = useSelector((state: RootState) => state?.request);
  const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);

  const fetchRequestsData = async () => {
    try {
      await dispatch(getRequestsThunk()).unwrap();
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  useEffect(() => {
    // Always fetch courses when component mounts if not already loaded
    if (!requests || requests.length === 0) {
      fetchRequestsData();
    }
  }, [dispatch]);

  const handleApprove = async (request: Request) => {
    const archivedRequest: Request = {
      ...request,
    };

    setArchivedRequests([...archivedRequests, archivedRequest]);
    // remove from backend user.requests (assuming we know userId and requestId)
    const userId = "REPLACE_WITH_USER_ID";
    const requestId = request.id;
    await dispatch(removeRequestThunk({ userId, requestId }));
  };

  const handleReject = async (request: Request) => {
    const archivedRequest: Request = {
      ...request,
    };
    setArchivedRequests([...archivedRequests, archivedRequest]);
    const userId = "REPLACE_WITH_USER_ID";
    const requestId = request.id;
    await dispatch(removeRequestThunk({ userId, requestId }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إدارة طلبات الوصول</h2>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-200">
            <div>اسم المستخدم</div>
            <div>البريد الإلكتروني</div>
            <div>اسم العنصر</div>
            <div>الفئة</div>
            <div>تاريخ الطلب</div>
            <div>الإجراءات</div>
          </div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {(requests ?? []).map((request: Request) => (
            <div
              key={request.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="text-white font-medium">{request.userName}</div>
                <div className="text-gray-300">{request.userEmail}</div>
                <div className="text-purple-400">{request.itemName || "NA"}</div>
                <div className="text-purple-400">{request.categoryName}</div>
                <div className="text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(request)}
                    className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors duration-300"
                  >
                    <Check className="h-4 w-4 text-green-400" />
                  </button>
                  <button
                    onClick={() => handleReject(request)}
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
