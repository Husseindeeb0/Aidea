import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { Category } from "../../types";
import {
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../states/category/categoryThunks";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesThunk } from "../../states/category/categoryThunks";
import type { CategoryProps } from "../../types";
import type { AppDispatch } from "../../store";

const CategoriesPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryData } = useSelector(
    (state: { category: CategoryProps }) => state?.category
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    ranking: 0,
  });

  const formatDate = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const fetchCategoriesData = async () => {
    try {
      await dispatch(getCategoriesThunk()).unwrap();
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  useEffect(() => {
    // Always fetch courses when component mounts if not already loaded
    if (!categoryData || categoryData.length === 0) {
      fetchCategoriesData();
    }
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await dispatch(
          updateCategoryThunk({
            // send identifier (supports either _id or id downstream)
            ...(editingCategory as unknown as { _id?: string; id?: string }),
            name: formData.name,
            description: formData.description,
            ranking: formData.ranking,
          } as unknown as Category)
        ).unwrap();
      } else {
        await dispatch(
          createCategoryThunk(formData as unknown as Category)
        ).unwrap();
      }
      await dispatch(getCategoriesThunk()).unwrap();
    } catch (error) {
      console.error("Error creating course:", error);
    }
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", ranking: 0, price: 0 });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      price: category.price,
      ranking: Number(
        (category as unknown as { ranking?: number; rank?: number }).ranking ??
          (category as unknown as { ranking?: number; rank?: number }).rank ??
          0
      ),
    });
    setShowModal(true);
  };

  const handleDelete = async (idOrObjectId: string) => {
    try {
      await dispatch(deleteCategoryThunk(idOrObjectId)).unwrap();
      await dispatch(getCategoriesThunk()).unwrap();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة الفئات</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-brand-purple to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة فئة جديدة
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-200">
            <div>الاسم</div>
            <div className="col-span-2">الوصف</div>
            <div>السعر</div>
            <div>تاريخ الإنشاء</div>
            <div>الإجراءات</div>
          </div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {((categoryData ?? []) as (Category & { _id?: string })[]).map(
            (category: Category & { _id?: string }, index) => (
              <div
                key={category.id || index}
                className="p-4 hover:bg-white/5 transition-colors duration-300"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="text-white font-medium">{category.name}</div>
                  <div className="col-span-2 text-gray-300">
                    {category.description}
                  </div>
                  <div className="text-cyan-400 font-semibold">
                    {category.price}
                  </div>
                  <div className="text-gray-400">
                    {formatDate(category.createdAt as unknown as string)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors duration-300"
                    >
                      <Edit className="h-4 w-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => {
                        const objectId = (
                          category as unknown as { _id?: string }
                        )._id;
                        if (objectId) {
                          void handleDelete(objectId);
                        }
                      }}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                  setFormData({ name: "", description: "", ranking: 0, price: 0 });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">اسم الفئة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
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
              <div>
                <label className="block text-gray-300 mb-2">السعر</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
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
                    setFormData({
                      ...formData,
                      ranking: Number(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  {editingCategory ? "تحديث" : "إضافة"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: "", description: "", ranking: 0, price: 0 });
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

export default CategoriesPanel;
