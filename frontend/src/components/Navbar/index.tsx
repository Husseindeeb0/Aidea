import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Brain,
  LayoutDashboard,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AuthProps } from "../../types";

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { userData } = useSelector((state: { auth: AuthProps }) => state?.auth);

  // Mock user (replace with actual Google auth data)
  const user = {
    name: "أحمد محمد",
    email: "user@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format", // Better placeholder
  };

  // This open the Google OAuth flow
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    console.log("تسجيل الخروج");
  };

  return (
    <nav
      dir="rtl"
      className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-lg bg-opacity-90 fixed w-full z-50 shadow-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AIDEA
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {true ? (
              <>
                <Link
                  to="/adminpanel"
                  className="flex items-center text-gray-300 hover:text-cyan-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4 ml-2" />
                  لوحة التحكم
                </Link>
                <Link
                  to="/subscriptions"
                  className="flex items-center text-gray-300 hover:text-cyan-400 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/10"
                >
                  <CreditCard className="h-4 w-4 ml-2" />
                  اشتراكاتي
                </Link>

                {/* Profile Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/10 group"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        showProfile ? "rotate-180" : ""
                      }`}
                    />
                    <span className="hidden lg:block">{userData?.name}</span>
                    <div className="relative">
                      <img
                        src={userData?.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/20 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="px-4 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200/20">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userData?.avatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover"
                          />
                          <div className="text-right">
                            <p className="text-gray-900 font-semibold text-sm">
                              {userData?.name}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {userData?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer w-full flex items-center justify-end text-red-600 hover:bg-red-50 px-4 py-3 text-sm transition-all duration-200 group"
                        >
                          <span className="ml-3 font-medium">تسجيل الخروج</span>
                          <LogOut className="h-4 w-4 group-hover:text-red-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200"
              >
                تسجيل الدخول باستخدام جوجل
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button bg-white/10 inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/30 backdrop-blur-lg border-t border-white/10">
            {userData && (
              <>
                <Link
                  to="/adminpanel"
                  className="flex items-center text-gray-300 hover:text-cyan-400 hover:bg-white/10 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 ml-3" />
                  لوحة التحكم
                </Link>
                <Link
                  to="/subscriptions"
                  className="flex items-center text-gray-300 hover:text-cyan-400 hover:bg-white/10 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard className="h-5 w-5 ml-3" />
                  اشتراكاتي
                </Link>

                <div className="border-t border-white/20 my-2"></div>

                {/* Mobile Profile Section */}
                <div className="px-4 py-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={userData.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                    />
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">
                        {userData.name}
                      </p>
                      <p className="text-gray-400 text-xs">{userData.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-end text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 text-sm rounded-lg transition-all duration-200"
                  >
                    <span className="ml-2">تسجيل الخروج</span>
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {!userData && (
              <button
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-base font-medium shadow-md transition-all duration-200"
              >
                تسجيل الدخول باستخدام جوجل
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
