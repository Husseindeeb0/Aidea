import {
  Brain,
  Lightbulb,
  Target,
  Users,
  Sparkles,
  Code,
  Palette,
  Database,
  ArrowRight,
  Star,
} from "lucide-react";
import CategoriesCard from "../../components/CategoriesCard";
import ItemsCard from "../../components/ItemsCard";

const HomePage = () => {
  const fe2atData = [
    {
      icon: Lightbulb,
      title: "الأفكار الإبداعية",
      description:
        "منصة شاملة لتطوير وتنمية الأفكار الإبداعية باستخدام أحدث تقنيات الذكاء الاصطناعي والتفكير النقدي المبتكر.",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    },
    {
      icon: Target,
      title: "الحلول المتقدمة",
      description:
        "نقدم حلولاً متطورة ومخصصة لمختلف التحديات التقنية والإبداعية مع التركيز على الجودة والابتكار والفعالية.",
      color: "bg-gradient-to-br from-green-400 to-teal-500",
    },
    {
      icon: Users,
      title: "التعاون والشراكة",
      description:
        "بيئة تفاعلية تشجع على التعاون المثمر والشراكات الاستراتيجية لتحقيق أفضل النتائج وأعلى معايير الجودة.",
      color: "bg-gradient-to-br from-purple-400 to-pink-500",
    },
  ];

  const anasrData = [
    {
      icon: Code,
      title: "التطوير التقني",
      features: [
        "برمجة متقدمة",
        "تطبيقات ذكية",
        "واجهات تفاعلية",
        "أنظمة مدمجة",
      ],
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      icon: Palette,
      title: "التصميم الإبداعي",
      features: ["تصميم جرافيك", "هوية بصرية", "تجربة مستخدم", "واجهات حديثة"],
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      icon: Database,
      title: "إدارة البيانات",
      features: ["قواعد بيانات", "تحليل ذكي", "تقارير متقدمة", "أمان معلومات"],
      color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    },
    {
      icon: Sparkles,
      title: "الذكاء الاصطناعي",
      features: ["تعلم آلي", "معالجة لغة", "رؤية حاسوبية", "تحليل ذكي"],
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center pt-20 pb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-6 shadow-2xl animate-pulse">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              AIDEA
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              منصة رائدة للأفكار الإبداعية والحلول التقنية المتطورة
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              نحول أفكارك إلى واقع رقمي مبتكر باستخدام أحدث التقنيات والأدوات
              المتطورة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/25 flex items-center">
                <span className="ml-2">ابدأ الآن</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1">
                تعرف علينا أكثر
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fe2at Section */}
      <section id="fe2at" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              الفئات الرئيسية
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              اكتشف مجموعتنا المتنوعة من الخدمات والحلول الإبداعية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fe2atData.map((item, index) => (
              <CategoriesCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3anaser Section */}
      <section
        id="3anaser"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-purple-900/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              عناصرنا المتطورة
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              مجموعة شاملة من الأدوات والتقنيات لتحقيق أهدافك
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {anasrData.map((item, index) => (
              <ItemsCard
                key={index}
                icon={item.icon}
                title={item.title}
                features={item.features}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "مشروع مكتمل" },
              { number: "150+", label: "عميل راضي" },
              { number: "50+", label: "شريك تقني" },
              { number: "24/7", label: "دعم فني" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              نحن هنا لتحويل أفكارك إلى واقع رقمي مبتكر ومتطور
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Star
                  key={index}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-500">© 2024 AIDEA. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
