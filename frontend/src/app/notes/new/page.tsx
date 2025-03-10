"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useToast from "../../components/ui/use-toast"
import { Button } from "../../components/ui/button"
import { getAllCategories } from "../../services/noteservice"
import { Plus, X } from "lucide-react"
import { Category } from "../../types/category"
import { Note } from "../../types/notes"
import api from "../../services/api"

export default function CreateNotePage() {
  const [title, setTitle] = useState("Untitled")
  const [content, setContent] = useState("Empty")
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<string>("")
  const [noteCategories, setNoteCategories] = useState<Category[]>([])
  const [tempNoteId, setTempNoteId] = useState<number | null>(Date.now())  // 🟢 ID temporal para la nota
  const { toast } = useToast()
  const router = useRouter()

  // 🟢 Cargar Categorías
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
  const handleAssignCategory = (category: Category) => {
    if (!noteCategories.some((cat) => cat.id === category.id)) {
      setNoteCategories((prev) => [...prev, category])
    }
  }

  // 🟢 Eliminar Categoría
  const handleRemoveCategory = (categoryName: string) => {
    setNoteCategories((prev) => prev.filter((cat) => cat.name !== categoryName))
  }

  // 🟢 Guardar Nueva Nota
  const handleCreateNote = async () => {
    try {
      const response = await api.post<Note>("/notes", { title, content })

      if (response.data && response.data.id) {
        const noteId = response.data.id
        setTempNoteId(noteId)  // 🟢 Actualizar el ID temporal con el real

        // 🟢 Guardar las categorías asociadas
        if (noteCategories.length > 0) {
          await Promise.all(
            noteCategories.map((cat) =>
              api.post(`/categories/${noteId}/categories`, { name: cat.name })
            )
          )
        }

        toast({ title: "Success", description: "Note created successfully!", variant: "success" })
        router.push("/notes")
      } else {
        throw new Error("Failed to create note.")
      }
    } catch {
      toast({ title: "Error", description: "Failed to create note.", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-yellow-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create a New Note 📝</h1>
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

      <Button onClick={handleCreateNote} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 mb-4">
        Create Note
      </Button>
    </div>
  )
}
