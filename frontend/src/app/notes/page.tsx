"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getActiveNotes,
  getArchivedNotes,
  deleteNote,
  archiveNote,
} from "../services/noteservice"
import useToast from "../components/ui/use-toast"
import { Button } from "../components/ui/button"
import { FileText, Trash, Archive, Plus, Loader2, ArrowLeft } from "lucide-react"
import { isAuthenticated } from "../services/authservice"


interface Note {
  id: number
  title: string
  content: string
  archived: boolean
}


export default function ViewNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "active" | "archived">(
    "active"
  )
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [activeTab])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      let data: Note[] = []
        if (activeTab === "active") {
        data = await getActiveNotes()
      } else if (activeTab === "archived") {
        data = await getArchivedNotes()
      }
      setNotes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated()
      if (!auth) {
        router.push("/login")  // 🟢 Redirect to login
      }
    }
    checkAuth()
  }, [])
  const handleDelete = async (id: number,event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    try {
      await deleteNote(id)
      toast({
        title: "Success",
        description: "Note deleted successfully!",
        variant: "success",
      })
      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const handleArchive = async (id: number, archived: boolean,event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    try {
      await archiveNote(id, archived)
      toast({
        title: "Success",
        description: archived ? "Note archived" : "Note unarchived",
        variant: "success",
      })
      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note status",
        variant: "destructive",
      })
    }
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Notes 📝
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <Button
            className={`${
              activeTab === "active" ? "bg-yellow-600 text-gray-800" : "bg-text-gray-800"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Notes
          </Button>
          <Button
            className={`${
              activeTab === "archived" ? "bg-yellow-600 text-gray-800" : "text-gray-800"
            }`}
            onClick={() => setActiveTab("archived")}
            
          >
            Archived Notes
          </Button>
          
        </div>
        <div className="flex justify-between mb-6">
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 gap-2"
            onClick={() => router.push("/notes/new")}
            >
            <Plus size={20} />
            New Note
          </Button>
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 gap-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Button>
        </div>
      </div>
      {notes.length === 0 ? (
        <div className="text-center text-gray-800">
          <p>No notes available. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border rounded-lg p-4 shadow bg-white transition-transform hover:scale-105"
              onClick={() => router.push(`/notes/edit?id=${note.id}`)}  // 🟢 Redirect to home

            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
              <p className="text-gray-700 mb-4">{note.content}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-white hover:bg-red-600"
                  onClick={(e) => handleDelete(note.id, e)}
                  >
                  <Trash size={16} />
                </Button>
                <Button
                  variant="outline"
                  className={`text-gray-300 hover:text-white ${
                    note.archived
                      ? "hover:bg-green-600"
                      : "hover:bg-yellow-500"
                  }`}
                  onClick={(e) => handleArchive(note.id, !note.archived,e)}
                >
                  <Archive size={16} />
                  {note.archived ? "Unarchive" : "Archive"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
