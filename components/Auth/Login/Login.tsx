"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebase"
import { client } from "@/sanity/lib/client"
import { setUserInfo } from "@/redux/user"
import Link from "next/link"
import { FirebaseError } from "firebase/app";

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

const LoginPage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)

  

  // Animate form entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsFormVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Enhanced Firebase error messages
  const getFirebaseErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/user-not-found":
        "We could not find an account with that email address. Please check your email or create a new account.",
      "auth/wrong-password": "The password you entered is incorrect. Please try again or reset your password.",
      "auth/invalid-email": "Please enter a valid email address in the format: example@domain.com",
      "auth/user-disabled":
        "This account has been temporarily disabled. Please contact our support team for assistance.",
      "auth/too-many-requests":
        "Too many unsuccessful login attempts. Please wait a few minutes before trying again or reset your password.",
      "auth/network-request-failed":
        "Unable to connect to our servers. Please check your internet connection and try again.",
      "auth/invalid-credential":
        "The email or password you entered is incorrect. Please double-check your credentials and try again.",
      "auth/operation-not-allowed":
        "Email/password sign-in is currently disabled. Please contact support for assistance.",
      "auth/weak-password": "Your password is too weak. Please choose a stronger password with at least 6 characters.",
      "auth/email-already-in-use":
        "An account with this email already exists. Please sign in instead or use a different email address.",
      "auth/requires-recent-login": "For security reasons, please sign out and sign in again to perform this action.",
      "auth/credential-already-in-use": "This credential is already associated with a different account.",
      "auth/timeout": "The request timed out. Please check your connection and try again.",
    }

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred during sign-in. Please try again or contact support if the problem persists."
    )
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required to sign in"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., john@example.com)"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required to sign in"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear field-specific errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }

    // Clear general errors
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading) return

    // Clear previous errors
    setErrors({})

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // 1. Firebase login
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCred.user

      if (!user.email) {
        throw new Error("Unable to retrieve user email from authentication service")
      }

      // 2. Fetch additional user info from Sanity
      const sanityUser = await client.fetch(`*[_type == "user" && uid == $uid][0]`, { uid: user.uid })

      if (!sanityUser) {
        setErrors({
          general:
            "We found your account but could not retrieve your profile information. Please contact our support team for assistance.",
        })
        return
      }

      // 3. Dispatch to Redux
      const userInfo = {
        uid: user.uid,
        email: user.email,
        fullName: sanityUser.name || "User",
      }

      dispatch(setUserInfo(userInfo))

        router.push("/")

    } catch (err) {
      console.error("Login Error:", err)

      let errorMessage = "We encountered an unexpected error while signing you in. Please try again."

      if (err  instanceof FirebaseError ) {
        errorMessage = getFirebaseErrorMessage(err.code)
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mt-2 flex items-start space-x-2 text-red-600 text-sm animate-slideDown">
      <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="leading-tight">{message}</span>
    </div>
  )

  // General error banner component
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-slideDown">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">Sign In Failed</h3>
          <p className="text-sm text-red-700 leading-relaxed">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setErrors((prev) => ({ ...prev, general: undefined }))}
            className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors duration-200"
            aria-label="Dismiss error message"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>

      <div
        className={`max-w-md w-full space-y-8 transform transition-all duration-700 ease-out ${
          isFormVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Logo/Site Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-slideUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please sign in to your account to continue your journey with us
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && <ErrorBanner message={errors.general} />}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>

            <div className="flex flex-col gap-3 xs:flex-row xs:gap-0 items-start xs:items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-500 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-teal-700 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Signing you in...
                </>
              ) : (
                "Sign In to Your Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to our platform?{" "}
              <Link
                href="/signup"
                className="text-teal-600 hover:text-teal-500 font-medium transition-colors duration-200"
              >
                Create your account here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>&copy; 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
