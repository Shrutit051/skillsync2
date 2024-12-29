"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TTSWrapper } from '../../components/tts-wrapper'
import { MainNav } from '../../components/main-nav'
import { useLanguage } from '../../contexts/language-context'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#E8F4FF]">
      <MainNav />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-[#FF9F45] p-4 inline-block 
                       border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <TTSWrapper>
            {user.type === 'company' ? t("Company Profile") : t("Job Seeker Profile")}
          </TTSWrapper>
        </h1>
        
        <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid md:grid-cols-2 gap-8">
            {user.type === 'company' ? (
              // Company Profile Fields
              <>
                <ProfileSection title="Company Name" content={user.companyName} />
                <ProfileSection title="Business Registration Number" content={user.businessRegNumber} />
                <ProfileSection title="Address" content={user.companyAddress} />
                <ProfileSection title="Registration Status" content={user.status} isCapitalize />
              </>
            ) : (
              // Job Seeker Profile Fields
              <>
                <ProfileSection title="Full Name" content={user.name} />
                <ProfileSection title="Age" content={user.age.toString()} />
                <ProfileSection title="Disability Type" content={user.disabilityType} />
                <ProfileSection title="Qualifications" content={user.qualifications} />
                <ProfileSection title="Account Status" content={user.status} isCapitalize />
              </>
            )}
          </div>
          
          {user.type === 'company' && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4 bg-[#4F9EF8] p-2 inline-block 
                            border-2 border-black">
                <TTSWrapper>Registration Certificate</TTSWrapper>
              </h3>
              <div className="border-4 border-black p-4 mt-4 bg-[#F8F7F4] 
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <img 
                  src={`/${user.certificatePath}`} 
                  alt="Registration Certificate" 
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ProfileSection({ title, content, isCapitalize = false }) {
  const { t } = useLanguage()
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-2 bg-[#4F9EF8] p-2 inline-block 
                     border-2 border-black">
        <TTSWrapper>{t(title)}</TTSWrapper>
      </h3>
      <TTSWrapper>
        <p className={`bg-white p-4 border-2 border-black ${isCapitalize ? 'capitalize' : ''}`}>
          {content}
        </p>
      </TTSWrapper>
    </div>
  )
}

