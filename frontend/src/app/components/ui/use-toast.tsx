import { useState } from "react"

interface Toast {
  title: string
  description: string
  variant?: "default" | "destructive" | "success"
}

export default function useToast() {  
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1))
    }, 3000)
  }

  return { toast, toasts }
}
