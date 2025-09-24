import { ArrowRight } from "lucide-react";
import type { CategoriesCardProps } from "../../types";

const CategoriesCard = ({ icon: Icon, title, description, color }: CategoriesCardProps) => {
  return (
    <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 ${color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
        <div className="mt-6 flex items-center text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="ml-2">اكتشف المزيد</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default CategoriesCard;
