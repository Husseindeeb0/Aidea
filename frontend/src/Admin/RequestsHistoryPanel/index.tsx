import { useState } from "react";
import { Download, Eye } from "lucide-react";

const RequestsHistoryPanel = () => {
  const [archivedRequests] = useState([
    {
      id: 1,
      userName: "محمد علي",
      itemName: "موقع شخصي",
      userEmail: "mohamed@example.com",
      requestDate: "2024-01-15",
      processedDate: "2024-01-16",
      status: "approved",
    },
    {
      id: 2,
      userName: "نور الدين",
      itemName: "تطبيق إدارة",
      userEmail: "nour@example.com",
      requestDate: "2024-01-10",
      processedDate: "2024-01-12",
      status: "rejected",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">تاريخ الطلبات</h2>
        <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center">
          <Download className="h-5 w-5 ml-2" />
          تصدير البيانات
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
          <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-200">
            <div>اسم المستخدم</div>
            <div>البريد الإلكتروني</div>
            <div>اسم العنصر</div>
            <div>تاريخ الطلب</div>
            <div>تاريخ المعالجة</div>
            <div>الحالة</div>
            <div>الإجراءات</div>
          </div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {archivedRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="text-white font-medium">{request.userName}</div>
                <div className="text-gray-300">{request.userEmail}</div>
                <div className="text-purple-400">{request.itemName}</div>
                <div className="text-gray-400">{request.requestDate}</div>
                <div className="text-gray-400">{request.processedDate}</div>
                <div
                  className={`font-medium ${
                    request.status === "approved"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {request.status === "approved" ? "مقبول" : "مرفوض"}
                </div>
                <div>
                  <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors duration-300">
                    <Eye className="h-4 w-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestsHistoryPanel;
