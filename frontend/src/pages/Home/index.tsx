import { Brain, Package, Filter, Tag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useMemo, useState } from "react";
import { getCategoriesThunk } from "../../states/category/categoryThunks";
import type { Category } from "../../types";
import CategoriesCard from "../../components/CategoriesCard";
import { sendRequestThunk } from "../../states/request/requestThunk";
import ItemsCard from "../../components/ItemsCard";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryData } = useSelector((state: RootState) => state.category);

  // State for filtering items by category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  useEffect(() => {
    if (!categoryData || categoryData.length === 0) {
      void dispatch(getCategoriesThunk());
    }
  }, [dispatch]);

  const categories = (categoryData ?? []) as (Category & {
    _id?: string;
    items?: any[];
    rank?: number;
    ranking?: number;
  })[];

  const sendRequest = async (data: {
    userId: string;
    categoryName: string;
    itemName: string;
  }) => {
    await dispatch(sendRequestThunk(data)).unwrap();
  };

  const stats = useMemo(() => {
    const numCategories = categories.length;
    const numItems = categories.reduce(
      (sum, c) => sum + ((c.items as any[])?.length || 0),
      0
    );
    const availableItems = categories.reduce((sum, c) => {
      return (
        sum +
        ((c.items as any[])?.filter((it) => it.state === "متاح").length || 0)
      );
    }, 0);
    const subscriptions = 0; // placeholder for now
    return { numCategories, numItems, availableItems, subscriptions };
  }, [categories]);

  // Get all items from all categories
  const allItems = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.items || []).map((item) => ({
        ...item,
        categoryName: cat.name,
        categoryId: (cat as any)._id ?? cat.id,
      }))
    );
  }, [categories]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) return allItems;
    return allItems.filter((item) => item.categoryId === selectedCategoryId);
  }, [allItems, selectedCategoryId]);

  const categoryLimit = 6;
  const itemLimit = 9;

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, categoryLimit);
  const displayedItems = showAllItems
    ? filteredItems
    : filteredItems.slice(0, itemLimit);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setShowAllItems(false); // Reset items pagination when changing category

    // Smooth scroll to items section
    const itemsSection = document.getElementById("items");
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return "جميع الفئات";
    const category = categories.find(
      (cat) => ((cat as any)._id ?? cat.id) === selectedCategoryId
    );
    return category?.name || "جميع الفئات";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple to-brand-pink">
      {/* Header Stats Section */}
      <section id="home" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-purple to-cyan-400 rounded-xl shadow-2xl">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-purple to-cyan-400 bg-clip-text text-transparent">
                  AIDEA
                </h1>
                <p className="text-gray-300">منصة للأفكار والحلول التقنية</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 hover:border-cyan-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.numCategories}
                </div>
                <div className="text-gray-400 text-sm">عدد الفئات</div>
              </div>
              <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 hover:border-cyan-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.numItems}
                </div>
                <div className="text-gray-400 text-sm">عدد العناصر</div>
              </div>
              <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 hover:border-cyan-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.availableItems}
                </div>
                <div className="text-gray-400 text-sm">العناصر المتاحة</div>
              </div>
              <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 hover:border-cyan-400/50 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.subscriptions}
                </div>
                <div className="text-gray-400 text-sm">الاشتراكات</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                الفئات
              </h2>
              <p className="text-gray-400">
                اختر الفئة لعرض العناصر المتعلقة بها
              </p>
            </div>
            {categories.length > categoryLimit && (
              <button
                onClick={() => setShowAllCategories((s) => !s)}
                className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30 hover:border-cyan-400/50 rounded-xl px-6 py-3 text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300"
              >
                <Filter className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                {showAllCategories ? "عرض أقل" : "عرض المزيد"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* All Categories Card */}
            <div
              onClick={() => handleCategoryClick(null)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                selectedCategoryId === null
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-cyan-400/20 shadow-lg"
                  : "bg-white/10 hover:bg-white/15 border-white/20"
              } backdrop-blur-lg rounded-2xl p-6 border`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    selectedCategoryId === null
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "bg-gray-700/50"
                  }`}
                >
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="text-xl font-semibold text-white">
                  جميع الفئات
                </div>
              </div>
              <div className="text-gray-300 mb-3">
                عرض جميع العناصر من كافة الفئات المتاحة
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>العناصر: {allItems.length}</span>
                <span>
                  المتاحة:{" "}
                  {allItems.filter((item) => item.state === "متاح").length}
                </span>
              </div>
            </div>

            {/* Category Cards */}
            {displayedCategories.map((cat, idx) => (
              <CategoriesCard
                key={(cat as any)._id ?? cat.id ?? idx}
                category={cat}
                isSelected={selectedCategoryId === ((cat as any)._id ?? cat.id)}
                onViewItems={() =>
                  handleCategoryClick((cat as any)._id ?? cat.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section id="items" className="py-12 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                العناصر
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Tag className="h-4 w-4" />
                <span>الفئة المحددة: {getSelectedCategoryName()}</span>
                <span className="text-cyan-400">
                  ({filteredItems.length} عنصر)
                </span>
              </div>
            </div>
            {filteredItems.length > itemLimit && (
              <button
                onClick={() => setShowAllItems((s) => !s)}
                className="group flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-400/50 rounded-xl px-6 py-3 text-purple-400 hover:text-purple-300 font-medium transition-all duration-300"
              >
                <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                {showAllItems ? "عرض أقل" : "عرض المزيد"}
              </button>
            )}
          </div>

          {displayedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/40 max-w-md mx-auto">
                <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  لا توجد عناصر
                </h3>
                <p className="text-gray-500">
                  لا توجد عناصر متاحة في هذه الفئة حالياً
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item, idx) => (
                <ItemsCard key={item.id ?? idx} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AIDEA
              </span>
            </div>
            <p className="text-gray-500">© 2024 AIDEA. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
