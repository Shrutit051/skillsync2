"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Slider } from './ui/slider'
import { TTSWrapper } from './tts-wrapper'

interface Settings {
  contrast: number
  saturation: number
  textSize: number
  letterSpacing: number
  cursorSize: number
}

const DEFAULT_SETTINGS: Settings = {
  contrast: 100,
  saturation: 100,
  textSize: 100,
  letterSpacing: 0,
  cursorSize: 16
}

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Apply settings whenever they change
  useEffect(() => {
    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))

    // Apply settings to document root
    document.documentElement.style.filter = `contrast(${settings.contrast}%) saturate(${settings.saturation}%)`
    document.documentElement.style.fontSize = `${settings.textSize}%`
    document.documentElement.style.letterSpacing = `${settings.letterSpacing}px`
    
    // Add cursor size styles
    const cursorStyle = document.createElement('style')
    cursorStyle.innerHTML = `
      * {
        cursor: default !important;
        cursor: url("data:image/svg+xml,<svg height='${settings.cursorSize}' width='${settings.cursorSize}' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M12 0L14 19L18 15L23 26L26 24L21 13L26 12L12 0Z' fill='black' stroke='white'/></svg>") ${settings.cursorSize/4} ${settings.cursorSize/4}, auto !important;
      }
      a, button, [role="button"] {
        cursor: pointer !important;
        cursor: url("data:image/svg+xml,<svg height='${settings.cursorSize}' width='${settings.cursorSize}' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M16 0 C14 0 12 2 12 4 L12 16 C12 18 14 20 16 20 C18 20 20 18 20 16 L20 4 C20 2 18 0 16 0 Z M16 24 C13 24 8 26 8 28 L24 28 C24 26 19 24 16 24 Z' fill='%23FF9F45' stroke='white'/></svg>") ${settings.cursorSize/4} 0, pointer !important;
      }
    `
    document.head.appendChild(cursorStyle)

    return () => {
      document.head.removeChild(cursorStyle)
    }
  }, [settings])

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <TTSWrapper>Accessibility Settings</TTSWrapper>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                <TTSWrapper>High Contrast</TTSWrapper>
              </Label>
              <Slider
                value={[settings.contrast]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, contrast: value[0] }))}
                min={100}
                max={200}
                step={10}
                className="w-[60%]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>
                <TTSWrapper>Saturation</TTSWrapper>
              </Label>
              <Slider
                value={[settings.saturation]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, saturation: value[0] }))}
                min={100}
                max={200}
                step={10}
                className="w-[60%]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>
                <TTSWrapper>Text Size</TTSWrapper>
              </Label>
              <Slider
                value={[settings.textSize]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, textSize: value[0] }))}
                min={100}
                max={200}
                step={10}
                className="w-[60%]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>
                <TTSWrapper>Letter Spacing</TTSWrapper>
              </Label>
              <Slider
                value={[settings.letterSpacing]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, letterSpacing: value[0] }))}
                min={0}
                max={10}
                step={1}
                className="w-[60%]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>
                <TTSWrapper>Cursor Size</TTSWrapper>
              </Label>
              <Slider
                value={[settings.cursorSize]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, cursorSize: value[0] }))}
                min={16}
                max={64}
                step={4}
                className="w-[60%]"
              />
            </div>
          </div>

          <Button 
            onClick={handleReset}
            variant="outline" 
            className="w-full border-2 border-black hover:bg-[#FF9F45] transition-transform hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <TTSWrapper>Reset All Settings</TTSWrapper>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 