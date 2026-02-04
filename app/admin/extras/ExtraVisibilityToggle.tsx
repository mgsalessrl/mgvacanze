'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toggleExtraVisibility } from './actions'
import { useRouter } from 'next/navigation'

interface ExtraVisibilityToggleProps {
  id: string
  initialIsVisible: boolean
}

export default function ExtraVisibilityToggle({ id, initialIsVisible }: ExtraVisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(initialIsVisible)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const newState = !isVisible
      await toggleExtraVisibility(id, newState)
      setIsVisible(newState)
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      alert('Failed to update visibility')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isVisible 
          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      title={isVisible ? "Visible (Click to hide)" : "Hidden (Click to show)"}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isVisible ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  )
}
