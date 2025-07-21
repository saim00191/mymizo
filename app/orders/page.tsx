"use client"

import { useState, useMemo } from "react"
import type { SortOption, FilterOption, ToastMessage, Order } from "./types"
import { mockOrders } from "./mockOrder"
import OrderCard from "./OrderCard"
import Toast from "./Toast"
import ConfirmationModal from "./ConfirmationModal"

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      message,
    }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    })
  }

  const hideConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
    })
  }

  const handleUpdateOrder = (orderId: string, updatedOrder : Order) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, deliveryStatus: "Cancelled" as const } : order)),
    )
  }

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders

    // Filter by status
    if (filterBy !== "all") {
      filtered = filtered.filter((order) => order.deliveryStatus.toLowerCase().replace(" ", "-") === filterBy)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.products.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Sort orders
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        case "date-asc":
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        case "amount-desc":
          return b.totalAmount - a.totalAmount
        case "amount-asc":
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })

    return sorted
  }, [orders, sortBy, filterBy, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="mt-1 text-sm text-gray-600">Track and manage your order history</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedOrders.length} {filteredAndSortedOrders.length === 1 ? "order" : "orders"} found
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="sr-only">
                Search orders
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="filter"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Orders</option>
                  <option value="delivered">Delivered</option>
                  <option value="in-transit">In Transit</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't placed any orders yet. Start shopping to see your orders here!"}
            </p>
            {(searchTerm || filterBy !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFilterBy("all")
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateOrder={handleUpdateOrder}
                onCancelOrder={handleCancelOrder}
                onShowToast={showToast}
                onShowConfirmation={showConfirmation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        onConfirm={() => {
          confirmationModal.onConfirm()
          hideConfirmation()
        }}
        onCancel={hideConfirmation}
        type="danger"
      />
    </div>
  )
}
