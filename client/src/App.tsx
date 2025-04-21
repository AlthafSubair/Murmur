
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import EmailVerificationPage from './pages/EmailVerificationPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import useThemeStore from './store/useTemeStore'

function App() {
 
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(()=>{
   checkAuth()
  },[checkAuth])

 

  if(isCheckingAuth && !authUser ){
    return (
      <div className='flex h-screen w-full justify-center items-center'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  console.log(theme)

  return (
   <div data-theme={theme}>
    <Navbar />
    <Routes>
      <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />}/>
      <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to='/' />}/>
      <Route path='/verify-email' element={ !authUser ? <EmailVerificationPage /> : <Navigate to='/' />}/>
      <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to='/' />}/>
      <Route path='/forgot-password' element={ !authUser ? <ForgotPassword /> : <Navigate to='/' />}/>
      <Route path='/reset-password/:email' element={ !authUser ? <ResetPassword /> : <Navigate to='/' />}/>
      <Route path='/settings' element={<SettingsPage />}/>
      <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to='/login' />}/>
    </Routes>
    <Toaster />
   </div>
  )
}

export default App
