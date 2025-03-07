import { Note } from "../../types/notes"
import { Button } from "./button"
import { Archive, Trash } from "lucide-react"

interface NoteCardProps {
  note: Note
  onDelete: (id: number) => void
  onArchive: (id: number, archived: boolean) => void
}

export default function NoteCard({ note, onDelete, onArchive }: NoteCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold mb-2 text-gray-800">{note.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{note.content}</p>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onArchive(note.id, !note.archived)}
          className="text-yellow-500 border-yellow-500"
        >
          <Archive size={16} className="mr-2" />
          {note.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(note.id)}
        >
          <Trash size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  )
}
