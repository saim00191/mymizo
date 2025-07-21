"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Package,
  X,
  Truck,
  LogOut,
  Menu,
} from "lucide-react";
import Logo from '@/images/logo.png'
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation"
import {signOutUser} from '@/redux/user'
export default function Header() {

  const dispatch = useDispatch()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);


    const cart = useSelector(
      (state: RootState) => state.cart.items
    );
    
    const wishlist = useSelector(
      (state: RootState) => state.wishlist.WishList
    );
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

  

    
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileMenuItems = [
    { icon: Package, label: "Orders", href: "/orders" },
    { icon: X, label: "Cancelled Orders", href: "/orders/cancelled" },
    { icon: Truck, label: "Delivered Orders", href: "/orders/delivered" },
    { icon: User, label: "Profile Settings", href: "/profile" },
    { icon: Heart, label: "My Wishlist", href: "/wishlist" },
    { icon: LogOut, label: "Logout", href: "/logout", isLogout: true },
  ];


  const handleLogout = async () => {
    try {
      await signOut(auth)             // Firebase logout
      dispatch(signOutUser())         // Clear Redux user state
      router.push("/login")           // Redirect to login
    } catch (err: any) {
      console.error("Logout error:", err.message)
      alert("Failed to log out. Try again.")
    }
  }
  

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4">
            {/* Hamburger Menu */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              onClick={() => setIsSidenavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700 group-hover:text-teal-700 transition-colors duration-200" />
            </button>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src={Logo} alt="Logo" className="xs:h-[70px] w-[120px] xs:w-[160px]"/>
            </Link>

            {/* Search Bar */}
            <div
              className={`flex-1 max-w-md lg:max-w-lg mx-4 sm:mx-8 hidden md:block transition-all duration-300 ${
                searchFocused ? "transform scale-102" : ""
              }`}
            >
              <div className="relative w-full">
                <Search
                  className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-300 ${
                    searchFocused ? "text-sky-600 scale-110" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-full text-sm sm:text-base outline-none transition-all duration-300 bg-gray-50 hover:bg-white hover:shadow-md focus:border-sky-600 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-sky-100 ${
                    searchFocused ? "transform scale-102" : ""
                  }`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2.5 sm:p-3 border-none bg-transparent rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-red-50 hover:-translate-y-0.5 group">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-bounce">
                 {wishlist.length}
                </span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 sm:p-3 border-none bg-transparent rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-sky-50 hover:-translate-y-0.5 group">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-300 group-hover:text-sky-600 group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              </Link>

              {/* Profile */}
              {userInfo && (

              <div className="relative" ref={profileRef}>
                <button
                  className="relative p-2.5 sm:p-3 border-none bg-transparent rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-teal-50 hover:-translate-y-0.5 group"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-300 group-hover:text-teal-700 group-hover:scale-110" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute top-full mt-2 right-0 sm:-right-4 bg-white border border-gray-200 rounded-xl shadow-xl min-w-72 z-50 overflow-hidden animate-slideDown">
                    {/* Profile Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-teal-50 to-sky-50">
                      <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white">
                        <User size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm mb-1">
                          {userInfo.fullName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile Menu */}
                    <div className="py-2">
                     {profileMenuItems.map((item, index) => {
  const isLogout = item.isLogout

  return isLogout ? (
    <button
      key={index}
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 text-red-600 hover:bg-red-50 border-t border-gray-100 mt-2 hover:translate-x-1"
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </button>
  ) : (
    <Link
      key={index}
      href={item.href}
      className="flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-teal-700 hover:translate-x-1"
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </Link>
  )
})}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
          {/* Search Bar */}
          <div
            className={`w-full mt-3 transition-all duration-300 md:hidden ${
              searchFocused ? "transform scale-102" : ""
            }`}
          >
            <div className="relative w-full">
              <Search
                className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-300 ${
                  searchFocused ? "text-sky-600 scale-110" : ""
                }`}
              />
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-full text-sm sm:text-base outline-none transition-all duration-300 bg-gray-50 hover:bg-white hover:shadow-md focus:border-sky-600 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-sky-100 ${
                  searchFocused ? "transform scale-102" : ""
                }`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidenav Overlay */}
      {isSidenavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setIsSidenavOpen(false)}
        />
      )}

      {/* Sidenav */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidenav Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-sky-50">
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <button
            onClick={() => setIsSidenavOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 group"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
          </button>
        </div>

        {/* Sidenav Content */}
        <nav className="h-full overflow-y-auto pb-20">
          <ul className="p-4 space-y-1">
            {[
              "Electronics",
              "Fashion & Apparel",
              "Home & Kitchen",
              "Health & Beauty",
              "Sports & Outdoors",
              "Toys & Games",
              "Books & Stationery",
              "Automotive & Tools",
              "Grocery & Gourmet Foods",
              "Furniture",
              "Jewelry & Accessories",
              "Pet Supplies",
              "Baby Products",
              "Garden & Outdoor",
              "Footwear",
              "Watches",
              "Bags & Luggage",
              "Mobile Phones & Accessories",
              "Computers & Laptops",
              "Office Supplies",
              "Music & Instruments",
              "Movies & TV Shows",
              "Home Decor",
              "Art & Craft Supplies",
              "Cleaning & Household Essentials",
            ].map((category, index) => (
              <li key={category}>
                <a
                  href={`/category/${category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 group"
                  onClick={() => setIsSidenavOpen(false)}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className="font-medium">{category}</span>
                  <svg
                    className="w-4 h-4 ml-auto transform rotate-180 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>

       
      </div>

      {/* Custom CSS for animations not available in Tailwind */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}
