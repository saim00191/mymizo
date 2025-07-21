export interface Product {
  id: string
  name: string
  description?: string
  thumbnail: string
  quantity: number
  price: number
  totalPrice: number
}

export interface Order {
  id: string
  orderDate: string
  estimatedDelivery: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  deliveryStatus: "Delivered" | "In Transit" | "Pending" | "Cancelled"
  products: Product[]
  paymentMethod: string
  paymentStatus: "Paid" | "Pending" | "Failed"
  totalAmount: number
}

export type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
export type FilterOption = "all" | "delivered" | "in-transit" | "pending" | "cancelled"

export interface ToastMessage {
  id: string
  type: "success" | "error" | "info"
  message: string
}
