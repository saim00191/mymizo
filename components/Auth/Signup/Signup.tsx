"use client"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebase"
import { client } from "@/sanity/lib/client"
import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { FirebaseError } from "firebase/app";


interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [, setShowErrors] = useState(false)
  
  // Helper function to get user-friendly error messages
  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please try signing in instead."
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support."
      case "auth/weak-password":
        return "Password should be at least 6 characters long and contain a mix of letters and numbers."
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  // Form validation function
  const validateForm = (fullName: string, email: string, password: string, confirmPassword: string): FormErrors => {
    const newErrors: FormErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters long"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setShowErrors(false)

    const form = new FormData(e.currentTarget)
    const fullName = form.get("fullName") as string
    const email = form.get("email") as string
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    // Validate form
    const validationErrors = validateForm(fullName, email, password, confirmPassword)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setShowErrors(true)
      setLoading(false)
      return
    }

    try {
      // 1. Create Firebase user
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user

      // 2. Save to Sanity
      await client.createIfNotExists({
        _id: `user.${user.uid}`,
        _type: "user",
        uid: user.uid,
        name: fullName,
        email,
        password, 
        createdAt: new Date().toISOString(),
      })



      console.log(user)
    } catch (err) {
      console.error("Signup Error:", err)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (err  instanceof FirebaseError) {
        errorMessage = getFirebaseErrorMessage(err.code)
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setErrors({ general: errorMessage })
      setShowErrors(true)
    } finally {
      setLoading(false)
    }
  }

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm animate-fadeIn">
      <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  )

  // General error banner component
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-slideDown">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Signup Failed</h3>
          <div className="mt-1 text-sm text-red-700">{message}</div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setErrors({})}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors duration-200"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>

      <div className="max-w-md w-full space-y-8">
        {/* Logo/Site Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-[18px] xs:text-2xl font-bold text-gray-900 text-center">Create an Account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Join us today and get started</p>
          </div>

          {/* General Error Banner */}
          {errors.general && <ErrorBanner message={errors.general} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <ErrorMessage message={errors.fullName} />}
            </div>

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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Create a password (min. 8 characters)"
              />
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none focus:border-teal-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 outline-none border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"}
                focus:outline-none focus:ring-2 focus:ring-teal-500 outline-none focus:ring-offset-2
                transition-colors duration-200 transform ${loading ? "" : "hover:scale-[1.02] active:scale-[0.98]"}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-teal-600 hover:text-teal-500 font-medium transition-colors duration-200"
              >
                Sign in here
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

export default Signup
