import api from './api';
import { Note } from '../types/notes';
import { Category } from '../types/category';


export const getAllNotes = async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes');
    return response.data;  
  };

  export const getActiveNotes = async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes/active'); 
    return response.data;
  };
  
  // 🟠 get notes
  export const getArchivedNotes = async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes/archived'); 
    return response.data;
  };

export const createNote = async (note: Partial<Note>): Promise<Note> => {  
    try {
      const response = await api.post('/notes', note);
      return response.data as Note; 
    } catch (error) {
      console.error('Error al crear la nota:', error);
      throw error; 
    }
  };

// 🟢 title
export const updateNoteTitle = async (noteId: number, title: string) => {
  const response = await api.patch(`/notes/${noteId}/title`, { title });
  return response.data;
};

// 🟢 update
export const updateNoteContent = async (noteId: number, content: string) => {
  const response = await api.patch(`/notes/${noteId}/content`, { content });
  return response.data;
};

// 🟢 archive
export const archiveNote = async (id: number, archived: boolean = true) => { 
    const endpoint = archived
      ? `/notes/${id}/archive`    
      : `/notes/${id}/unarchive`  
    await api.put(endpoint)
  }
  

// 🟢 unarchive
export const unarchiveNote = async (noteId: number) => {
  const response = await api.put(`/notes/${noteId}/unarchive`);
  return response.data;
};

// 🟢 Toggle 
export const toggleArchiveNote = async (noteId: number) => {
  const response = await api.patch(`/notes/${noteId}/toggle-archive`);
  return response.data;
};

// 🟢Delete
export const deleteNote = async (noteId: number) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
};

export const addCategoryToNote = async (noteId: number, categoryName: string) => {
    const response = await api.post(`/categories/${noteId}/categories`, { name: categoryName })
    return response.data
  }
  // 🟢Delete cat
  export const removeCategoryFromNote = async (noteId: number, categoryName: string) => {
    const response = await api.delete(`/categories/${noteId}/${categoryName}`)
    return response.data
  }
  
// 🟢 Receive cats
export const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const getCategoriesForNote = async (noteId: number): Promise<Category[]> => {
    const response = await api.get<Category[]>(`/categories/${noteId}/categories`);
    return response.data;
  };

  export const getNotesByCategory = async (categoryId: number): Promise<Note[]> => {
    try {
      const response = await api.get<Note[]>(`/categories/${categoryId}/notes`)
      return response.data
    } catch (error) {
      console.error("Failed to fetch notes by category:", error)
      throw error
    }
  }
  
  
