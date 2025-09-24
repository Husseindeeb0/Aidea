import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { Item } from "../../types";

const ItemsPanel = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "موقع تجارة إلكترونية",
      description: "متجر إلكتروني متكامل مع نظام دفع",
      url: "https://example.com",
      category: "تطوير المواقع",
      state: "متاح",
      price: 2500,
      ranking: 1,
      createdAt: "2024-01-15",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
    state: "",
    price: "",
    ranking: "",
  });

  const categories = ["تطوير المواقع", "التطبيقات الذكية", "التصميم الجرافيكي"];
  const states = ["متاح", "قريباً", "مؤرشف"];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                price: parseFloat(formData.price),
                ranking: parseInt(formData.ranking),
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        ranking: parseInt(formData.ranking),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setItems([...items, newItem]);
    }
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      url: "",
      category: "",
      state: "",
      price: "",
      ranking: "",
    });
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      url: item.url,
      category: item.category,
      state: item.state,
      price: item.price.toString(),
      ranking: item.ranking.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة العناصر</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة عنصر جديد
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
          <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-gray-200">
            <div>العنوان</div>
            <div>الوصف</div>
            <div>الفئة</div>
            <div>الحالة</div>
            <div>السعر</div>
            <div>الترتيب</div>
            <div>التاريخ</div>
            <div>الإجراءات</div>
          </div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-8 gap-4 items-center">
                <div className="text-white font-medium">{item.title}</div>
                <div className="text-gray-300 text-sm">
                  {item.description.substring(0, 30)}...
                </div>
                <div className="text-purple-400">{item.category}</div>
                <div
                  className={`text-sm font-medium ${
                    item.state === "متاح"
                      ? "text-green-400"
                      : item.state === "قريباً"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {item.state}
                </div>
                <div className="text-cyan-400 font-semibold">${item.price}</div>
                <div className="text-gray-300">{item.ranking}</div>
                <div className="text-gray-400 text-sm">{item.createdAt}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? "تعديل العنصر" : "إضافة عنصر جديد"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  setFormData({
                    title: "",
                    description: "",
                    url: "",
                    category: "",
                    state: "",
                    price: "",
                    ranking: "",
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">الرابط</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">الفئة</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">الحالة</label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="">اختر الحالة</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">السعر</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">الترتيب</label>
                  <input
                    type="number"
                    value={formData.ranking}
                    onChange={(e) =>
                      setFormData({ ...formData, ranking: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  {editingItem ? "تحديث" : "إضافة"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({
                      title: "",
                      description: "",
                      url: "",
                      category: "",
                      state: "",
                      price: "",
                      ranking: "",
                    });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPanel;
