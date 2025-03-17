import { create } from "zustand";


export const useProjectForm = create((set) => ({
  isOpen: false,
  openForm: () => set({ isOpen: true }),
  closeForm: () => set({ isOpen: false }),
}));
