"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useToast from "../../components/ui/use-toast"
import { Button } from "../../components/ui/button"
import {
  getAllNotes,
  updateNoteTitle,
  updateNoteContent,
  getAllCategories,
  removeCategoryFromNote,
} from "../../services/noteservice"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Category } from "../../types/category"
import api from "../../services/api"

export default function EditNotePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [noteCategories, setNoteCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const noteId = searchParams.get("id")

  // 🟢 Cargar Nota y Categorías Asociadas
  useEffect(() => {
    const fetchNote = async () => {
      if (noteId) {
        try {
          const notes = await getAllNotes()
          const note = notes.find((n) => n.id === Number(noteId))
          if (note) {
            setTitle(note.title)
            setContent(note.content)

            const response = await api.get<Category[]>(`/categories/${noteId}/categories`)
            const uniqueCategories = Array.from(new Set(response.data.map(cat => JSON.stringify(cat)))).map(cat => JSON.parse(cat))
            setNoteCategories(uniqueCategories)
          } else {
            toast({ title: "Error", description: "Note not found.", variant: "destructive" })
            router.push("/notes")
          }
        } catch {
          toast({ title: "Error", description: "Failed to fetch note or categories.", variant: "destructive" })
        }
      }
    }
    fetchNote()
  }, [noteId])

  // 🟢 Cargar Todas las Categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        const uniqueCategories = Array.from(new Set(data.map(cat => JSON.stringify(cat)))).map(cat => JSON.parse(cat))
        setCategories(uniqueCategories)
      } catch {
        toast({ title: "Error", description: "Failed to fetch categories.", variant: "destructive" })
      }
    }
    fetchCategories()
  }, [])

  // 🟢 Agregar Nueva Categoría
  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    const createdCategory: Category = {
      id: Date.now(),  // 🟢 ID temporal para la categoría
      name: newCategory,
    }

    setNoteCategories((prev) => [...prev, createdCategory])
    setCategories((prev) => [...prev, createdCategory])
    setNewCategory("")
  }

  // 🟢 Asignar Categoría Existente
  const handleAssignCategory = async (category: Category) => {
    if (!noteId) return
    if (!noteCategories.some((cat) => cat.id === category.id)) {
      try {
        await api.post(`/categories/${noteId}/categories`, { name: category.name })
        setNoteCategories((prev) => [...prev, category])
        toast({ title: "Success", description: `Category '${category.name}' assigned successfully!`, variant: "success" })
      } catch {
        toast({ title: "Error", description: `Failed to assign category '${category.name}'.`, variant: "destructive" })
      }
    }
  }

  // 🟢 Eliminar Categoría
  const handleRemoveCategory = async (categoryName: string) => {
    if (!noteId) return
    try {
      await removeCategoryFromNote(Number(noteId), categoryName)
      setNoteCategories((prev) => prev.filter((cat) => cat.name !== categoryName))
      toast({ title: "Success", description: "Category removed successfully!", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Failed to remove category.", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-yellow-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Note 📝</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border mb-4 p-2 w-full rounded text-gray-800"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border mb-4 p-2 w-full rounded h-32 text-gray-800"
      />

      <input
        type="text"
        placeholder="New category name (separate with commas)"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="border mb-2 p-2 rounded w-full text-gray-800"
      />
      <Button onClick={handleAddCategory} className="bg-yellow-500 mb-4">
        <Plus size={16} /> Add Category
      </Button>

      <h2 className="text-xl font-semibold mb-2 text-gray-800">Assigned Categories:</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {noteCategories.map((category) => (
          <span key={category.id} className="bg-yellow-200 text-gray-800 px-2 py-1 rounded flex items-center">
            {category.name}
            <button className="ml-2 text-red-500" onClick={() => handleRemoveCategory(category.name)}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-800">All Categories:</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-2 py-1 rounded ${
              noteCategories.some((cat) => cat.id === category.id)
                ? "bg-green-200 text-gray-800"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => handleAssignCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 mb-4">
        Save Changes
      </Button>
    </div>
  )
}
