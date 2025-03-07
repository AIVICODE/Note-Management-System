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


export default function CreateOrEditNotePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<string>("")
  const [noteCategories, setNoteCategories] = useState<Category[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const noteId = searchParams.get("id")


  // 🟢 load notes and cat
  useEffect(() => {
    const fetchNote = async () => {
      if (noteId) {
        try {
          setLoading(true)
          const notes = await getAllNotes()
          const note = notes.find((n) => n.id === Number(noteId))
          if (note) {
            setTitle(note.title)
            setContent(note.content)


            // 🟢 get categories
            const response = await api.get<Category[]>(`/categories/${noteId}/categories`)
            const associatedCategories = response.data ?? []
            setNoteCategories(associatedCategories)
          } else {
            toast({
              title: "Error",
              description: "Note not found.",
              variant: "destructive",
            })
            router.push("/notes")
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch note or categories.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    fetchNote()
  }, [noteId])


  // 🟢 load cat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch categories.",
          variant: "destructive",
        })
      }
    }
    fetchCategories()
  }, [])


  // 🟢 multiple categories
  const handleAddMultipleCategories = async () => {
    if (!noteId || !newCategory.trim()) return


    const categoriesArray = newCategory.split(",").map(cat => cat.trim()).filter(Boolean)


    try {
      const response = await api.post<Category[]>(`/categories/${noteId}/categories`, {
        name: categoriesArray,
      })
     
      const createdCategories = Array.isArray(response.data) ? response.data : []
     
      setNoteCategories((prev) => {
        const combined = [...prev, ...createdCategories];
        const uniqueCategories = combined.filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c.id === cat.id)
        );
        return uniqueCategories;
      });
      
      setCategories((prev) => {
        const combined = [...prev, ...createdCategories];
        const uniqueCategories = combined.filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c.id === cat.id) 
        );
        return uniqueCategories;
      });
      
      setNewCategory("")
      setErrorMessage("")
      toast({
        title: "Success",
        description: "Categories created and added successfully!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add categories to the note.",
        variant: "destructive",
      })
    }
  }


  // 🟢 delete category
  const handleRemoveCategory = async (categoryName: string) => {
    if (!noteId) return


    try {
      await removeCategoryFromNote(Number(noteId), categoryName)
      setNoteCategories((prev) => prev.filter((cat) => cat.name !== categoryName))
      toast({
        title: "Success",
        description: "Category removed successfully!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove category.",
        variant: "destructive",
      })
    }
  }


  // 🟢 save note
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content cannot be empty.",
        variant: "destructive",
      })
      return
    }


    try {
      if (noteId) {
        await updateNoteTitle(Number(noteId), title)
        await updateNoteContent(Number(noteId), content)
        toast({
          title: "Success",
          description: "Note updated successfully!",
          variant: "success",
        })
      } else {
        const response = await api.post(`/notes`, { title, content })
        if (!response) throw new Error("Failed to create note.")
        toast({
          title: "Success",
          description: "Note created successfully!",
          variant: "success",
        })
      }
      router.push("/notes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note.",
        variant: "destructive",
      })
    }
  }

  const handleAssignCategory = async (categoryId: number) => {
    if (!noteId) return;
  
    try {
      const response = await api.post<Category[]>(`/categories/${noteId}/categories`, {
        name: [categories.find((cat) => cat.id === categoryId)?.name],
      });
  
      const createdCategories = Array.isArray(response.data) ? response.data : [];
      
      setNoteCategories((prev) => {
        const combined = [...prev, ...createdCategories];
        const uniqueCategories = combined.filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c.id === cat.id)
        );
        return uniqueCategories;
      });
  
      toast({
        title: "Success",
        description: "Category assigned successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign category to the note.",
        variant: "destructive",
      });
    }
  };
  
  
<Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800">
  {noteId ? "Save Changes" : "Save Note"}
</Button>

  return (
    <div className="container mx-auto px-4 py-10 bg-yellow-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {noteId ? "Edit Note 📝" : "Create a New Note 📝"}
      </h1>
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
      <Button onClick={handleAddMultipleCategories} className="bg-yellow-500 mb-4">
        <Plus size={16} /> Add Categories to Note
      </Button>
      <Button
  onClick={() => router.back()}
  className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 mb-4 flex items-center"
>
  <ArrowLeft size={16} className="mr-2" />
  Back
</Button>

      {errorMessage && (
        <div className="text-red-600 mb-4">
          {errorMessage}
        </div>
      )}


      <h2 className="text-xl font-semibold mb-2 text-gray-800">Assigned Categories:</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {noteCategories.map((category) => (
          <span key={category.id} className="bg-yellow-200 text-gray-800 px-2 py-1 rounded flex items-center">
            {category.name}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveCategory(category.name)}
            >
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
      onClick={() => handleAssignCategory(category.id)}
      className={`px-2 py-1 rounded ${
        noteCategories.some((cat) => cat.id === category.id)
          ? "bg-green-200 text-gray-800"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {category.name}
    </button>
  ))}
</div>


      <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800">
        {noteId ? "Save Changes" : "Save Note"}
      </Button>
    </div>
  )
  
}



