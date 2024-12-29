"use client"

import { useState } from 'react'
import { MainNav } from "../components/main-nav"
import { Input } from "../components/ui/input"
import { JobList } from '../components/job-list'
import { useJobs } from '../hooks/use-jobs'
import { Chatbot } from "../components/chatbot"
import { Search } from 'lucide-react'
import { TTSWrapper } from "../components/tts-wrapper"
import { useLanguage } from '../contexts/language-context'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([])
  const { jobs, isLoading, error } = useJobs(searchQuery, selectedDisabilities)
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
      <MainNav />
      
      {/* Hero Section with Neo-Brutalism */}
      <div className="relative bg-[#E8F4FF] border-y-4 border-black">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 
                         bg-[#FF9F45] p-6
                         border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TTSWrapper>
              {t("Find inclusive jobs and livelihood opportunities")}
            </TTSWrapper>
          </h1>
          
          {/* Search Box with Neo-Brutalism */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="relative bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Input
                placeholder={t("Search jobs by title, company, or location...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-black 
                          focus:ring-0 focus:border-black"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <main className="flex-1">
        <JobList 
          jobs={jobs}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <Chatbot />
    </div>
  )
}

