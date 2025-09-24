import { useState } from "react";
import { X, Check } from "lucide-react";
import type { Request } from "../../types";

const RequestsPanel = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      userName: "أحمد محمد",
      itemName: "موقع تجارة إلكترونية",
      userEmail: "ahmed@example.com",
      requestDate: "2024-01-20",
      status: "pending",
    },
    {
      id: 2,
      userName: "سارة أحمد",
      itemName: "تطبيق موبايل",
      userEmail: "sara@example.com",
      requestDate: "2024-01-19",
      status: "pending",
    },
  ]);

  const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);

  const handleApprove = (request: Request) => {
    const archivedRequest: Request = {
      ...request,
      status: "approved",
      processedDate: new Date().toISOString().split("T")[0],
    };
    setArchivedRequests([...archivedRequests, archivedRequest]);
    setRequests(requests.filter((req) => req.id !== request.id));
  };

  const handleReject = (request: Request) => {
    const archivedRequest: Request = {
      ...request,
      status: "rejected",
      processedDate: new Date().toISOString().split("T")[0],
    };
    setArchivedRequests([...archivedRequests, archivedRequest]);
    setRequests(requests.filter((req) => req.id !== request.id));
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
            <div>تاريخ الطلب</div>
            <div>الحالة</div>
            <div>الإجراءات</div>
          </div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="text-white font-medium">{request.userName}</div>
                <div className="text-gray-300">{request.userEmail}</div>
                <div className="text-purple-400">{request.itemName}</div>
                <div className="text-gray-400">{request.requestDate}</div>
                <div className="text-yellow-400 font-medium">قيد المراجعة</div>
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
