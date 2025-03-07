"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, logout } from "./services/authservice"
import { Button } from "./components/ui/button"
import { ArrowRight, LogOut, FileText, Loader2, Plus } from "lucide-react"
import Toast from "./components/ui/toast"
import useToast from "./components/ui/use-toast"  

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()  

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated()
      if (!auth) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully!",
      variant: "success",
    })
    await logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <Loader2 className="animate-spin text-yellow-600 w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-yellow-50 min-h-screen">
      <Toast /> 
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Esolvers Notes! 📝
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Manage and organize your notes quickly and easily.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 gap-2"
            onClick={() => router.push("/notes")}
          >
            <FileText size={20} />
            View Notes
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 gap-2"
            onClick={() => router.push("/notes/new")}
          >
            <Plus size={20} />
            New Note
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
