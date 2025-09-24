import { CheckCircle } from "lucide-react";
import type { ItemsCardProps } from "../../types";

const ItemsCard = ({ icon: Icon, title, features, color }: ItemsCardProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
        {title}
      </h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
          >
            <CheckCircle className="h-4 w-4 text-green-400 ml-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsCard;
