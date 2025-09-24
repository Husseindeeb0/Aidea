import { useState, useEffect } from "react";
import { Package, Users, Settings, List, History } from "lucide-react";
import CategoriesPanel from "../../Admin/CategoriesPanel";
import ItemsPanel from "../../Admin/ItemsPanel";
import RequestsPanel from "../../Admin/RequestsPanel";
import RequestsHistoryPanel from "../../Admin/RequestsHistoryPanel";

// Main Admin Panel Component
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const tabs = [
    { id: "categories", label: "الفئات", icon: List },
    { id: "items", label: "العناصر", icon: Package },
    { id: "requests", label: "طلبات الوصول", icon: Users },
    { id: "history", label: "تاريخ الطلبات", icon: History },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoriesPanel />;
      case "items":
        return <ItemsPanel />;
      case "requests":
        return <RequestsPanel />;
      case "history":
        return <RequestsHistoryPanel />;
      default:
        return <CategoriesPanel />;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-brand-purple to-brand-pink">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink backdrop-blur-lg bg-opacity-90 shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-brand-purple to-cyan-400 p-3 rounded-xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-cyan-400 bg-clip-text text-transparent">
                  لوحة التحكم الإدارية
                </h1>
                <p className="text-gray-400">إدارة شاملة لجميع عناصر الموقع</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5 ml-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdminPanel;
