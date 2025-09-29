'use client'

import { useEffect, useState } from 'react'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a loading state that matches the expected structure
    return (
      <div className="flex h-screen bg-[#0f0f0f]">
        <div className="flex h-full w-64 flex-col bg-[#171717] border-r border-[#404040]">
          <div className="flex h-16 items-center border-b border-[#404040] px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <div className="h-5 w-5 bg-white rounded-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">DentalCare</span>
                <span className="text-xs text-gray-400">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between border-b border-[#404040] bg-[#1a1a1a] px-6">
            <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex-1 bg-[#0f0f0f] p-6">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-96 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
