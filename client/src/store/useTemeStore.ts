import {create} from 'zustand'

interface themeData {
    theme: string,
    setTheme: (theme: string) => void
} 

const useThemeStore = create<themeData>((set) => ({
    theme: localStorage.getItem('chat-theme') || 'night',
    setTheme: (theme: string) => {
        localStorage.setItem('chat-theme', theme)
        set({theme})
    }

}))

export default useThemeStore