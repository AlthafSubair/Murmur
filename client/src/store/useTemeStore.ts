import {create} from 'zustand'

const useThemeStore = create((set) => ({
    theme: localStorage.getItem('chat-theme') || 'night',
    setTheme: (theme: string) => {
        localStorage.setItem('chat-theme', theme)
        set({theme})
    }

}))

export default useThemeStore