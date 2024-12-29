"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainNav } from '../../../../components/main-nav'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Button } from '../../../../components/ui/button'
import { Textarea } from '../../../../components/ui/textarea'
import { db } from '../../../../lib/firebase'
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore'
import { saveFileLocally } from '../../../../lib/file-storage'
import { TTSWrapper } from '../../../../components/tts-wrapper'
import { useLanguage } from '../../../../contexts/language-context'

interface ApplicationFormData {
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  currentAddress: string
  permanentAddress: string
  highestQualification: string
  disability: string
  resume: File | null
}

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    currentAddress: '',
    permanentAddress: '',
    highestQualification: '',
    disability: '',
    resume: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/')
      return
    }

    // Pre-fill form with user data if available
    const userData = JSON.parse(user)
    if (userData.type === 'jobseeker') {
      setFormData(prev => ({
        ...prev,
        firstName: userData.name.split(' ')[0] || '',
        disability: userData.disabilityType || '',
        highestQualification: userData.qualifications || ''
      }))
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      if (!formData.resume) {
        alert('Please upload your resume')
        return
      }

      // Get job details
      const jobDoc = await getDoc(doc(db, 'jobs', params.id))
      if (!jobDoc.exists()) {
        alert('Job not found')
        return
      }
      const jobData = jobDoc.data()

      // Get user data
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) {
        alert('Please login again')
        router.push('/')
        return
      }

      try {
        // Save resume locally first
        const resumePath = await saveFileLocally(
          formData.resume,
          `applications/${params.id}/resumes`
        )

        // Prepare application data
        const applicationData = {
          jobId: params.id,
          jobTitle: jobData.title,
          companyId: jobData.companyId,
          companyName: jobData.companyName,
          applicantId: user.id,
          applicantName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          currentAddress: formData.currentAddress,
          permanentAddress: formData.permanentAddress,
          highestQualification: formData.highestQualification,
          disability: formData.disability,
          resumePath,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          searchableFields: [
            formData.firstName.toLowerCase(),
            formData.lastName.toLowerCase(),
            formData.email.toLowerCase(),
            jobData.title.toLowerCase(),
            jobData.companyName.toLowerCase()
          ]
        }

        // Add to Firestore
        const applicationsRef = collection(db, 'applications')
        await addDoc(applicationsRef, applicationData)

        // Show success message
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 2000)

      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        throw new Error('Failed to upload resume')
      }

    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8F4FF]">
      <MainNav />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-[#FF9F45] p-4 inline-block 
                       border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <TTSWrapper>{t("Job Application Form")}</TTSWrapper>
        </h1>

        <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  <TTSWrapper>{t("First Name")}</TTSWrapper>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">
                  <TTSWrapper>{t("Middle Name")}</TTSWrapper>
                </Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  <TTSWrapper>Last Name</TTSWrapper>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <TTSWrapper>Email Address</TTSWrapper>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <TTSWrapper>Phone Number</TTSWrapper>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-2">
              <Label htmlFor="currentAddress">
                <TTSWrapper>Current Address</TTSWrapper>
              </Label>
              <Textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAddress: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="permanentAddress">
                <TTSWrapper>Permanent Address</TTSWrapper>
              </Label>
              <Textarea
                id="permanentAddress"
                value={formData.permanentAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, permanentAddress: e.target.value }))}
                required
              />
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <Label htmlFor="highestQualification">
                <TTSWrapper>Highest Qualification</TTSWrapper>
              </Label>
              <Input
                id="highestQualification"
                value={formData.highestQualification}
                onChange={(e) => setFormData(prev => ({ ...prev, highestQualification: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disability">
                <TTSWrapper>Disability Type</TTSWrapper>
              </Label>
              <Input
                id="disability"
                value={formData.disability}
                onChange={(e) => setFormData(prev => ({ ...prev, disability: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">
                <TTSWrapper>Resume (PDF only)</TTSWrapper>
              </Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  resume: e.target.files?.[0] || null
                }))}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF9F45] hover:bg-[#FF8B2B] text-white flex items-center justify-center gap-2"
            >
              <TTSWrapper>
                {isSubmitting ? t("Submitting...") : t("Submit Application")}
              </TTSWrapper>
            </Button>
          </form>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <TTSWrapper>
                <p className="text-xl font-bold text-center">
                  {t("Application Submitted Successfully!")}
                </p>
              </TTSWrapper>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 