import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { Item, Category } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import type { CategoryProps } from "../../types";
import {
  updateCategoryThunk,
  getCategoriesThunk,
} from "../../states/category/categoryThunks";

const ItemsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryData, isLoading } = useSelector(
    (state: { category: CategoryProps }) => state?.category
  );

  // Ensure categories are loaded once on mount
  useEffect(() => {
    if (!categoryData || categoryData.length === 0) {
      void dispatch(getCategoriesThunk());
    }
  }, [dispatch]);

  // Local copy of categories for optimistic UI updates
  const [localCategories, setLocalCategories] = useState<
    | (Category & {
        _id?: string;
        items?: any[];
        rank?: number;
        ranking?: number;
      })[]
    | null
  >(null);

  // Seed localCategories once categoryData arrives (first load)
  useEffect(() => {
    if (categoryData && categoryData.length > 0 && localCategories === null) {
      // shallow clone is sufficient since we replace items arrays on edit
      setLocalCategories(
        (categoryData as (Category & { _id?: string; items?: any[] })[]).map(
          (c) => ({ ...c })
        )
      );
    }
  }, [categoryData, localCategories]);

  // Flatten items from categories
  const items = useMemo(() => {
    const list: (Item & { _categoryId?: string })[] = [];
    (localCategories ?? categoryData ?? []).forEach(
      (cat: Category & { _id?: string; items?: any[] }) => {
        const catId = (cat as unknown as { _id?: string })._id;
        (cat.items ?? []).forEach((it: any) => {
          list.push({
            id: (it as { _id?: string })._id ?? "",
            title: it.title,
            description: it.description,
            url: it.url,
            categoryName: cat.name,
            state: it.state,
            price: it.price,
            ranking: it.rank ?? it.ranking ?? 0,
            createdAt: it.createdAt,
            _categoryId: catId,
          });
        });
      }
    );
    return list;
  }, [localCategories, categoryData]);

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

  const categories = useMemo(() => {
    const names = new Set<string>();
    (localCategories ?? categoryData ?? []).forEach((c: Category) => {
      if (c?.name) names.add(c.name);
    });
    return Array.from(names);
  }, [localCategories, categoryData]);
  const states = ["متاح", "قريباً", "مؤرشف"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Determine target category to update (by name)
    const targetCategory = (localCategories ?? categoryData ?? []).find(
      (c: Category) => c.name === formData.category
    ) as (Category & { _id?: string; items?: any[] }) | undefined;

    if (!targetCategory || !targetCategory._id) {
      setShowModal(false);
      setEditingItem(null);
      return;
    }

    // Build new items array for the category
    const categoryItems = [...((targetCategory.items as any[]) ?? [])];
    if (editingItem) {
      const idx = categoryItems.findIndex(
        (it) => (it as { _id?: string })._id === editingItem.id
      );
      if (idx >= 0) {
        categoryItems[idx] = {
          ...(categoryItems[idx] ?? {}),
          title: formData.title,
          description: formData.description,
          url: formData.url,
          state: formData.state,
          price: parseFloat(formData.price),
          rank: parseInt(formData.ranking),
        };
      }
    } else {
      categoryItems.push({
        title: formData.title,
        description: formData.description,
        url: formData.url,
        state: formData.state,
        price: parseFloat(formData.price),
        rank: parseInt(formData.ranking),
      });
    }

    // Optimistically update local categories
    setLocalCategories((prev) => {
      const source = (prev ?? (categoryData as any[])) as (Category & {
        _id?: string;
        items?: any[];
      })[];
      if (!source) return prev;
      const updated = source.map((c) =>
        (c._id ?? (c as any).id) ===
        (targetCategory._id ?? (targetCategory as any).id)
          ? { ...c, items: categoryItems }
          : c
      );
      return updated as any;
    });

    // Persist by updating the category with new items
    await dispatch(
      updateCategoryThunk({
        ...(targetCategory as unknown as { _id?: string; id?: string }),
        name: targetCategory.name,
        description: targetCategory.description,
        ranking:
          (targetCategory as unknown as { ranking?: number; rank?: number })
            .ranking ??
          (targetCategory as unknown as { ranking?: number; rank?: number })
            .rank ??
          0,
        // attach items to category body
        items: categoryItems,
      } as unknown as Category)
    ).unwrap();

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
      category: item.categoryName,
      state: item.state,
      price: item.price.toString(),
      ranking: item.ranking.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    // Find the category that owns this item
    const owningCategory = (localCategories ?? categoryData ?? []).find(
      (cat: any) =>
        (cat.items ?? []).some((it: any) => (it as { _id?: string })._id === id)
    ) as (Category & { _id?: string; items?: any[] }) | undefined;

    if (!owningCategory || !owningCategory._id) return;

    const newItems = (owningCategory.items ?? []).filter(
      (it: any) => (it as { _id?: string })._id !== id
    );

    // Optimistically update local categories
    setLocalCategories((prev) => {
      const source = (prev ?? (categoryData as any[])) as (Category & {
        _id?: string;
        items?: any[];
      })[];
      if (!source) return prev;
      const updated = source.map((c) =>
        (c._id ?? (c as any).id) ===
        (owningCategory._id ?? (owningCategory as any).id)
          ? { ...c, items: newItems }
          : c
      );
      return updated as any;
    });

    await dispatch(
      updateCategoryThunk({
        ...(owningCategory as unknown as { _id?: string; id?: string }),
        name: owningCategory.name,
        description: owningCategory.description,
        ranking:
          (owningCategory as unknown as { ranking?: number; rank?: number })
            .ranking ??
          (owningCategory as unknown as { ranking?: number; rank?: number })
            .rank ??
          0,
        items: newItems,
      } as unknown as Category)
    ).unwrap();
  };

  if (isLoading) {
    return (
      <div className="animate-spin rounded-full  border-4 w-12 h-12 border-blue-500 border-t-transparent mx-auto mb-4"></div>
    );
  }

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
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-sm font-semibold text-gray-200 w-full">
            <div className="min-w-0">العنوان</div>
            <div className="min-w-0">الوصف</div>
            <div className="min-w-0">الفئة</div>
            <div className="min-w-0">الحالة</div>
            <div className="min-w-0">السعر</div>
            <div className="min-w-0">التاريخ</div>
            <div className="min-w-0">الإجراءات</div>
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center w-full">
                <div className="text-white font-medium min-w-0 truncate">
                  {item.title}
                </div>
                <div className="text-gray-300 min-w-0 truncate">
                  {item.description.substring(0, 30)}...
                </div>
                <div className="text-purple-400 min-w-0 truncate">
                  {item.categoryName}
                </div>
                <div
                  className={`text-sm font-medium min-w-0 ${
                    item.state === "متاح"
                      ? "text-green-400"
                      : item.state === "قريباً"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {item.state}
                </div>
                <div className="text-cyan-400 font-semibold min-w-0">
                  ${item.price}
                </div>
                <div className="text-gray-400 text-sm min-w-0">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2 min-w-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => void handleDelete(item.id)}
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
