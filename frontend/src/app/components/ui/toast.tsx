import useToast from "./use-toast"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export default function Toast() {
  const { toasts } = useToast()  

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`flex items-center p-3 rounded shadow-md transition-transform ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : toast.variant === "success"
              ? "bg-green-500 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {toast.variant === "destructive" && <XCircle className="mr-2" />}
          {toast.variant === "success" && <CheckCircle className="mr-2" />}
          {toast.variant === "default" && <AlertTriangle className="mr-2" />}
          <div>
            <h4 className="font-bold">{toast.title}</h4>
            <p>{toast.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
