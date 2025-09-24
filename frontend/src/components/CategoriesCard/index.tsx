import { Eye, CreditCard, Star, Package, Tag } from "lucide-react";

interface CategoriesCardProps {
  category: {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    items?: any[];
  };
  isSelected: boolean;
  onViewItems: () => void;
  onSubscribe: () => void;
  discountPercentage?: number;
  basePrice?: number;
}

const CategoriesCard = ({
  category,
  isSelected,
  onViewItems,
  onSubscribe,
  discountPercentage = 15,
  basePrice = 99
}: CategoriesCardProps) => {
  const itemsCount = (category.items as any[])?.length || 0;
  const availableItems = (category.items as any[])?.filter((it) => it.state === "متاح").length || 0;
  const discountedPrice = Math.round(basePrice * (1 - discountPercentage/100));
  const savedAmount = basePrice - discountedPrice;

  return (
    <div className={`group relative transform transition-all duration-500 hover:-translate-y-3 ${
      isSelected
        ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/60 shadow-cyan-400/25 shadow-2xl scale-105"
        : "bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border-white/20 hover:border-cyan-400/40"
    } backdrop-blur-xl rounded-3xl p-6 border overflow-hidden`}>
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      {/* Discount badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20">
          وفر {discountPercentage}%
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 left-4 bg-cyan-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
          محدد
        </div>
      )}

      <div className="relative z-10">
        {/* Header section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-3 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
              isSelected 
                ? "bg-gradient-to-r from-cyan-400 to-blue-500" 
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}>
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                isSelected ? "text-cyan-400" : "text-white group-hover:text-cyan-400"
              }`}>
                {category.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>العناصر: {itemsCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>المتاحة: {availableItems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300 text-sm">
          {category.description}
        </p>

        {/* Price section */}
        <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 group-hover:border-cyan-400/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">سعر الفئة كاملة</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-cyan-400">${discountedPrice}</span>
                <span className="text-sm text-gray-500 line-through">${basePrice}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-400 font-medium">توفير</div>
              <div className="text-lg font-bold text-green-400">${savedAmount}</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSubscribe();
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 group/btn"
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>اشترك في الفئة كاملة</span>
            </div>
            <div className="text-xs opacity-90 mt-1">ووفر {discountPercentage}% من السعر الإجمالي</div>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewItems();
            }}
            className="w-full bg-gray-700/50 hover:bg-gray-600/60 border border-gray-600/50 hover:border-gray-500/60 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500/50 group/btn"
          >
            <div className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>استعراض عناصر الفئة</span>
            </div>
          </button>
        </div>

        {/* Features list */}
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <div className="flex flex-wrap gap-2">
            {['دعم مجاني', 'تحديثات دورية', 'ضمان الجودة'].map((feature, index) => (
              <span 
                key={feature}
                className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Rating display */}
        <div className="mt-3 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
          {[...Array(5)].map((_, index) => (
            <Star 
              key={index} 
              className={`h-3 w-3 ${index < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
          <span className="text-xs text-gray-400 mr-2">4.8 (120 تقييم)</span>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400/20 rounded-full blur-xl group-hover:animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400/20 rounded-full blur-lg group-hover:animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-blue-400/20 rounded-full blur-md group-hover:animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default CategoriesCard;