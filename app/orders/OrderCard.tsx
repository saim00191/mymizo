"use client"

import { useState } from "react"
import type { Order } from "./types"
import ProductItem from "./ProductItems"

interface OrderCardProps {
  order: Order
  onUpdateOrder: (orderId: string, updatedOrder: Order) => void
  onCancelOrder: (orderId: string) => void
  onShowToast: (message: string, type: "success" | "error" | "info") => void
  onShowConfirmation: (title: string, message: string, onConfirm: () => void) => void
}

export default function OrderCard({
  order,
  onUpdateOrder,
  onCancelOrder,
  onShowToast,
  onShowConfirmation,
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate if order can be edited (within 2 days)
  const orderDate = new Date(order.orderDate)
  const currentDate = new Date()
  const timeDifference = currentDate.getTime() - orderDate.getTime()
  const daysDifference = timeDifference / (1000 * 3600 * 24)
  const canEdit = daysDifference <= 2 && order.deliveryStatus !== "Delivered" && order.deliveryStatus !== "Cancelled"

  // Calculate deadline for modifications
  const modificationDeadline = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000)
  const timeLeft = modificationDeadline.getTime() - currentDate.getTime()
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))

  const getStatusColor = (status: Order["deliveryStatus"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return "text-green-600"
      case "Pending":
        return "text-yellow-600"
      case "Failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (!canEdit) {
      onShowToast(
        "Order changes are only allowed within 2 days of purchase. This order can no longer be modified.",
        "error",
      )
      return
    }

    const updatedProducts = order.products.map((product) => {
      if (product.id === productId) {
        const totalPrice = product.price * newQuantity
        return { ...product, quantity: newQuantity, totalPrice }
      }
      return product
    })

    const newTotalAmount = updatedProducts.reduce((sum, product) => sum + product.totalPrice, 0)
    const updatedOrder = { ...order, products: updatedProducts, totalAmount: newTotalAmount }

    onUpdateOrder(order.id, updatedOrder)
    onShowToast("Your order was successfully updated.", "success")
  }

  const handleCancelOrder = () => {
    if (!canEdit) {
      onShowToast(
        "Order changes are only allowed within 2 days of purchase. This order can no longer be modified.",
        "error",
      )
      return
    }

    onShowConfirmation(
      "Cancel Order",
      `Are you sure you want to cancel order ${order.id}? This action cannot be undone.`,
      () => {
        onCancelOrder(order.id)
        onShowToast("Your order was successfully canceled.", "success")
      },
    )
  }

  const handleReorder = () => {
    console.log("Reordering:", order.id)
    onShowToast("Reorder functionality would be implemented here.", "info")
  }

  const handleDownloadInvoice = () => {
    console.log("Downloading invoice for:", order.id)
    onShowToast("Invoice download would be implemented here.", "info")
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Order Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.deliveryStatus)}`}
              >
                {order.deliveryStatus}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            </div>

            {/* Modification deadline badge */}
            {canEdit && timeLeft > 0 && (
              <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m left to modify` : `${minutesLeft}m left to modify`}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
            <div className={`text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200"
            aria-expanded={isExpanded}
            aria-controls={`order-details-${order.id}`}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>

          {canEdit && (
            <button
              onClick={handleCancelOrder}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              🗑 Cancel Order
            </button>
          )}

          <button
            onClick={handleReorder}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Reorder
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Download Invoice
          </button>
        </div>
      </div>

      {/* Expandable Order Details */}
      <div
        id={`order-details-${order.id}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="p-4 sm:p-6 space-y-6">
          {/* Shipping Address */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Products ({order.products.length} {order.products.length === 1 ? "item" : "items"})
            </h4>
            <div className="space-y-3">
              {order.products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  canEdit={canEdit}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Information</h4>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-semibold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
