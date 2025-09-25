import { Tag, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import type { ItemsCardProps } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { sendRequestThunk } from "../../states/request/requestThunk";
import { loginWithGoogle } from "../../states/auth/authAPI";

const ItemsCard = ({ item }: ItemsCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!showNotice) return;
    const t = setTimeout(() => setShowNotice(false), 6000);
    return () => clearTimeout(t);
  }, [showNotice]);

  return (
    <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300">
            {item.title || "عنصر غير مُسمى"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Tag className="h-3 w-3" />
            <span>{item.categoryName}</span>
          </div>
        </div>
        <div className="px-2 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">
          متاح
        </div>
      </div>

      <div className="text-gray-300 mb-4 line-clamp-3">{item.description}</div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-yellow-400" />
          <span className="text-lg font-bold text-yellow-400">
            {item.price}
          </span>
        </div>
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          onClick={async () => {
            if (userData?._id) {
              console.log(userData);
              void await dispatch(
                sendRequestThunk({
                  userId: userData._id as string,
                  categoryName: item.categoryName,
                  itemName: item.title,
                })
              );
              setShowNotice(true);
            } else {
              loginWithGoogle();
            }
          }}
        >
          اشترك الآن
        </button>
      </div>

      {showNotice && (
        <div className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 p-4 text-sm">
          لإكمال عملية الدفع، تواصل معنا عبر الواتساب:{" "}
          <a
            href="https://wa.me/0123456789"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-cyan-400 hover:text-white ml-1"
          >
            0123456789
          </a>
        </div>
      )}
    </div>
  );
};

export default ItemsCard;
