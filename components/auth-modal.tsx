"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { CardContent } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { saveFileLocally } from '../lib/file-storage'
import { TTSWrapper } from './tts-wrapper'
import { Textarea } from './ui/textarea'

type UserType = 'company' | 'jobseeker' | null

interface CompanyData {
  id: string
  businessRegNumber: string
  companyName: string
  companyAddress: string
  certificatePath: string
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  isActive: boolean
}

interface JobSeekerData {
  id: string
  name: string
  age: number
  disabilityType: string
  qualifications: string
  certificatePath: string
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  isActive: boolean
}

interface JobSeekerFormData {
  name: string
  age: string
  disabilityType: string
  qualifications: string
  disabilityCertificate: File | null
}

const DISABILITY_TYPES = [
  'Visual Impairment',
  'Hearing Impairment',
  'Physical Disability',
  'Cognitive Disability',
  'Speech Impairment',
  'Multiple Disabilities'
]

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(true)
  const [userType, setUserType] = useState<UserType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyDetails, setCompanyDetails] = useState({
    businessRegNumber: '',
    companyName: '',
    companyAddress: '',
    registrationCertificate: null as File | null
  })
  const [jobSeekerDetails, setJobSeekerDetails] = useState<JobSeekerFormData>({
    name: '',
    age: '',
    disabilityType: '',
    qualifications: '',
    disabilityCertificate: null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Validate file size (max 5MB)
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setCompanyDetails(prev => ({
        ...prev,
        registrationCertificate: e.target.files![0]
      }))
    }
  }

  const handleCompanyRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Validate business registration number
      if (companyDetails.businessRegNumber.length !== 21) {
        alert('Business registration number must be 21 digits')
        return
      }

      if (!companyDetails.registrationCertificate) {
        alert('Please upload a registration certificate')
        return
      }

      // Save file locally and get path
      const certificatePath = await saveFileLocally(
        companyDetails.registrationCertificate,
        `companies/${companyDetails.businessRegNumber}/certificates`
      )

      // Prepare company data
      const companyData: Omit<CompanyData, 'id'> = {
        businessRegNumber: companyDetails.businessRegNumber,
        companyName: companyDetails.companyName,
        companyAddress: companyDetails.companyAddress,
        certificatePath,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
        isActive: true
      }

      // Add to Firestore with optimistic updates
      const companyRef = collection(db, 'companies')
      const docRef = await addDoc(companyRef, {
        ...companyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        searchableFields: [
          companyDetails.companyName.toLowerCase(),
          companyDetails.businessRegNumber,
          companyDetails.companyAddress.toLowerCase()
        ]
      })

      console.log('Company registered with ID:', docRef.id)
      setIsOpen(false)

    } catch (error) {
      console.error("Error registering company:", error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJobSeekerRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      if (!jobSeekerDetails.disabilityCertificate) {
        alert('Please upload your disability certificate')
        return
      }

      // Save certificate locally
      const certificatePath = await saveFileLocally(
        jobSeekerDetails.disabilityCertificate,
        `jobseekers/${jobSeekerDetails.name}/certificates`
      )

      // Prepare job seeker data
      const jobSeekerData: Omit<JobSeekerData, 'id'> = {
        name: jobSeekerDetails.name,
        age: parseInt(jobSeekerDetails.age),
        disabilityType: jobSeekerDetails.disabilityType,
        qualifications: jobSeekerDetails.qualifications,
        certificatePath,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
        isActive: true
      }

      // Add to Firestore
      const jobSeekersRef = collection(db, 'jobseekers')
      const docRef = await addDoc(jobSeekersRef, {
        ...jobSeekerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        searchableFields: [
          jobSeekerDetails.name.toLowerCase(),
          jobSeekerDetails.disabilityType.toLowerCase(),
          jobSeekerDetails.qualifications.toLowerCase()
        ]
      })

      console.log('Job seeker registered with ID:', docRef.id)
      setIsOpen(false)

    } catch (error) {
      console.error("Error registering job seeker:", error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <TTSWrapper>Welcome to SkillSync</TTSWrapper>
          </DialogTitle>
          <DialogDescription>
            <TTSWrapper>Choose how you want to use SkillSync</TTSWrapper>
          </DialogDescription>
        </DialogHeader>

        {!userType ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-32"
              onClick={() => setUserType('company')}
            >
              I'm a Company
              <br />
              Looking to Hire
            </Button>
            <Button
              variant="outline"
              className="h-32"
              onClick={() => setUserType('jobseeker')}
            >
              I'm a Job Seeker
              <br />
              Looking for Work
            </Button>
          </div>
        ) : userType === 'company' ? (
          <form onSubmit={handleCompanyRegistration}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessRegNumber">
                  <TTSWrapper>Business Registration Number</TTSWrapper>
                </Label>
                <Input
                  id="businessRegNumber"
                  placeholder="21-digit registration number"
                  value={companyDetails.businessRegNumber}
                  onChange={(e) => setCompanyDetails(prev => ({
                    ...prev,
                    businessRegNumber: e.target.value
                  }))}
                  maxLength={21}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={companyDetails.companyName}
                  onChange={(e) => setCompanyDetails(prev => ({
                    ...prev,
                    companyName: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  placeholder="Enter company address"
                  value={companyDetails.companyAddress}
                  onChange={(e) => setCompanyDetails(prev => ({
                    ...prev,
                    companyAddress: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificate">Registration Certificate</Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUserType(null)}>
                  Back
                </Button>
                <Button type="submit">
                  Register
                </Button>
              </div>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleJobSeekerRegistration}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <TTSWrapper>Full Name</TTSWrapper>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={jobSeekerDetails.name}
                  onChange={(e) => setJobSeekerDetails(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">
                  <TTSWrapper>Age</TTSWrapper>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={jobSeekerDetails.age}
                  onChange={(e) => setJobSeekerDetails(prev => ({
                    ...prev,
                    age: e.target.value
                  }))}
                  required
                  min="18"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disabilityType">
                  <TTSWrapper>Type of Disability</TTSWrapper>
                </Label>
                <select
                  id="disabilityType"
                  value={jobSeekerDetails.disabilityType}
                  onChange={(e) => setJobSeekerDetails(prev => ({
                    ...prev,
                    disabilityType: e.target.value
                  }))}
                  required
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                >
                  <option value="">Select disability type</option>
                  {DISABILITY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">
                  <TTSWrapper>Educational Qualifications</TTSWrapper>
                </Label>
                <Textarea
                  id="qualifications"
                  placeholder="Enter your educational qualifications"
                  value={jobSeekerDetails.qualifications}
                  onChange={(e) => setJobSeekerDetails(prev => ({
                    ...prev,
                    qualifications: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate">
                  <TTSWrapper>Disability Certificate</TTSWrapper>
                </Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setJobSeekerDetails(prev => ({
                    ...prev,
                    disabilityCertificate: e.target.files?.[0] || null
                  }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUserType(null)}>
                  <TTSWrapper>Back</TTSWrapper>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <TTSWrapper>
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </TTSWrapper>
                </Button>
              </div>
            </CardContent>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 