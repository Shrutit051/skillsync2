"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { LoginModal } from './login-modal'
import { useRouter } from 'next/navigation'
import { CreateJobModal } from './create-job-modal'
import { Volume2, VolumeX, Globe } from 'lucide-react'
import { useTTS } from '../contexts/tts-context'
import { TTSWrapper } from './tts-wrapper'
import { SettingsModal } from './settings-modal'
import { useLanguage } from '../contexts/language-context'

export function MainNav() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const { isEnabled, toggleTTS } = useTTS()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' }
  ]

  useEffect(() => {
    // Check for user on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user')
      setUser(updatedUser ? JSON.parse(updatedUser) : null)
    }

    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="flex items-center space-x-4 p-4 bg-[#E8F4FF] border-b-4 border-black">
      <Link href="/" className="text-lg font-bold px-4 py-2 bg-[#FF9F45] border-2 border-black transform rotate-[-1deg] transition-transform hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <TTSWrapper>{t("Home")}</TTSWrapper>
      </Link>
      {user?.type === 'company' && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsCreateJobOpen(true)}
          className="text-lg font-bold px-4 py-2 bg-[#4F9EF8] border-2 border-black transform rotate-[1deg] transition-transform hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <TTSWrapper>{t("Create Job")}</TTSWrapper>
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTTS}
        className="text-lg font-bold px-4 py-2 bg-white border-2 border-black transform rotate-[1deg] transition-transform hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {isEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
        <span className="sr-only">
          {isEnabled ? 'Disable text to speech' : 'Enable text to speech'}
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-lg font-bold px-4 py-2 bg-white border-2 border-black transform rotate-[-1deg] transition-transform hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'mr' | 'ta')}
              className={`text-lg font-medium hover:bg-[#FFB4B4] ${
                language === lang.code ? 'bg-[#E8F4FF]' : ''
              }`}
            >
              <TTSWrapper>{lang.name}</TTSWrapper>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-lg font-bold px-4 py-2 bg-white border-2 border-black transform rotate-[-1deg] transition-transform hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {user ? t("Profile") : t("Login")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          {user ? (
            <>
              <DropdownMenuItem 
                onClick={() => router.push('/profile')}
                className="text-lg font-medium hover:bg-[#FFB4B4]"
              >
                <TTSWrapper>{t("Profile")}</TTSWrapper>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsSettingsOpen(true)}
                className="text-lg font-medium hover:bg-[#FFB4B4]"
              >
                <TTSWrapper>{t("Settings")}</TTSWrapper>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-lg font-medium hover:bg-[#FFB4B4]"
              >
                <TTSWrapper>{t("Logout")}</TTSWrapper>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem 
              onClick={() => setIsLoginOpen(true)}
              className="text-lg font-medium hover:bg-[#FFB4B4]"
            >
              <TTSWrapper>{t("Login")}</TTSWrapper>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      <CreateJobModal 
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </nav>
  )
}

