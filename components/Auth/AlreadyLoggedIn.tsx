"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"


export default function AlreadyLoggedInMessage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)
  const [isVisible, setIsVisible] = useState(false)

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsVisible(false)
          setTimeout(() => {
            router.push("/")
          }, 500) 
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-md w-full transform transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Animated Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 animate-pulse" />

          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className={`h-10 w-10 text-white transform transition-all duration-1000 ${
                  isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-full border-2 border-teal-300 animate-ping opacity-30 animation-delay-200" />
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userInfo?.fullName}!</h2>

            <div className="space-y-2">
              <p className="text-gray-600">You're already signed in with</p>
              <p className="text-teal-600 font-medium">{userInfo?.email}</p>
            </div>

            {/* Animated Divider */}
            <div className="flex items-center justify-center my-6">
              <div
                className={`h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-all duration-1000 ${
                  isVisible ? "w-full" : "w-0"
                }`}
              />
            </div>

            {/* Redirect Message with Countdown */}
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <p className="text-teal-800 text-sm">Redirecting you to the home page in</p>
              <div className="flex items-center justify-center mt-2">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full border-4 border-teal-200 flex items-center justify-center transition-all duration-300 ${
                      countdown <= 1 ? "border-teal-500 bg-teal-50" : ""
                    }`}
                  >
                    <span className="text-xl font-bold text-teal-600">{countdown}</span>
                  </div>

                  {/* Animated Progress Ring */}
                  <svg className="absolute inset-0 w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-teal-500"
                      strokeDasharray={`${(4 - countdown) * 31.4} 125.6`}
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-dasharray 1s ease-in-out",
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => router.push("/"), 300)
              }}
              className="mt-4 text-sm text-teal-600 hover:text-teal-700 cursor-pointer font-medium transition-colors duration-200 underline underline-offset-2"
            >
              Skip and go now
            </button>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-2 h-2 bg-teal-300 rounded-full animate-bounce opacity-60"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-20 right-16 w-1 h-1 bg-blue-300 rounded-full animate-bounce opacity-40"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce opacity-50"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-32 right-12 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-30"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
