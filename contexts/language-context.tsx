"use client"

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

type Language = 'en' | 'hi' | 'mr' | 'ta'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (text: string) => string
}

const translations = {
  en: {
    "Find inclusive jobs and livelihood opportunities": "Find inclusive jobs and livelihood opportunities",
    "Search jobs by title, company, or location...": "Search jobs by title, company, or location...",
    "Company Profile": "Company Profile",
    "Job Seeker Profile": "Job Seeker Profile",
    "Create Job": "Create Job",
    "Settings": "Settings",
    "Login": "Login",
    "Logout": "Logout",
    "Home": "Home",
    "Profile": "Profile",
    "Apply Now": "Apply Now",
    "Full Name": "Full Name",
    "Age": "Age",
    "Disability Type": "Disability Type",
    "Qualifications": "Qualifications",
    "Account Status": "Account Status",
    "Company Name": "Company Name",
    "Business Registration Number": "Business Registration Number",
    "Address": "Address",
    "Registration Status": "Registration Status",
    "Registration Certificate": "Registration Certificate",
    "Job Application Form": "Job Application Form",
    "Middle Name": "Middle Name",
    "Last Name": "Last Name",
    "Email Address": "Email Address",
    "Phone Number": "Phone Number",
    "Current Address": "Current Address",
    "Permanent Address": "Permanent Address",
    "Resume": "Resume",
    "Submit Application": "Submit Application",
    "Submitting...": "Submitting...",
    "Application Submitted Successfully!": "Application Submitted Successfully!",
  },
  hi: {
    "Find inclusive jobs and livelihood opportunities": "समावेशी नौकरियां और आजीविका के अवसर खोजें",
    "Search jobs by title, company, or location...": "शीर्षक, कंपनी या स्थान द्वारा नौकरियां खोजें...",
    "Company Profile": "कंपनी प्रोफ़ाइल",
    "Job Seeker Profile": "नौकरी खोजने वाले का प्रोफ़ाइल",
    "Create Job": "नौकरी बनाएं",
    "Settings": "सेटिंग्स",
    "Login": "लॉग इन करें",
    "Logout": "लॉग आउट",
    "Home": "होम",
    "Profile": "प्रोफ़ाइल",
    "Apply Now": "अभी आवेदन करें",
    "Full Name": "पूरा नाम",
    "Age": "आयु",
    "Disability Type": "विकलांगता का प्रकार",
    "Qualifications": "योग्यता",
    "Account Status": "खाता स्थिति",
    "Company Name": "कंपनी का नाम",
    "Business Registration Number": "व्यवसाय पंजीकरण संख्या",
    "Address": "पता",
    "Registration Status": "पंजीकरण स्थिति",
    "Registration Certificate": "पंजीकरण प्रमाणपत्र",
    "Job Application Form": "नौकरी आवेदन पत्र",
    "Middle Name": "मध्य नाम",
    "Last Name": "उपनाम",
    "Email Address": "ईमेल पता",
    "Phone Number": "फ़ोन नंबर",
    "Current Address": "वर्तमान पता",
    "Permanent Address": "स्थायी पता",
    "Resume": "बायोडाटा",
    "Submit Application": "आवेदन जमा करें",
    "Submitting...": "जमा किया जा रहा है...",
    "Application Submitted Successfully!": "आवेदन सफलतापूर्वक जमा किया गया!",
  },
  mr: {
    "Find inclusive jobs and livelihood opportunities": "समावेशक नोकऱ्या आणि उपजीविकेच्या संधी शोधा",
    "Search jobs by title, company, or location...": "शीर्षक, कंपनी किंवा स्थानानुसार नोकऱ्या शोधा...",
    "Company Profile": "कंपनी प्रोफाइल",
    "Job Seeker Profile": "नोकरी शोधकर्त्याचे प्रोफाइल",
    "Create Job": "नोकरी तयार करा",
    "Settings": "सेटिंग्ज",
    "Login": "लॉगिन करा",
    "Logout": "लॉगआउट करा",
    "Home": "मुख्यपृष्ठ",
    "Profile": "प्रोफाइल",
    "Apply Now": "आता अर्ज करा",
    "Full Name": "पूर्ण नाव",
    "Age": "वय",
    "Disability Type": "अपंगत्वाचा प्रकार",
    "Qualifications": "शैक्षणिक पात्रता",
    "Account Status": "खाते स्थिती",
    "Company Name": "कंपनीचे नाव",
    "Business Registration Number": "व्यवसाय नोंदणी क्रमांक",
    "Address": "पत्ता",
    "Registration Status": "नोंदणी स्थिती",
    "Registration Certificate": "नोंदणी प्रमाणपत्र",
    "Job Application Form": "नोकरी अर्ज फॉर्म",
    "Middle Name": "वडिलांचे नाव",
    "Last Name": "आडनाव",
    "Email Address": "ईमेल पत्ता",
    "Phone Number": "फोन नंबर",
    "Current Address": "सध्याचा पत्ता",
    "Permanent Address": "कायमचा पत्ता",
    "Resume": "बायोडाटा",
    "Submit Application": "अर्ज सबमिट करा",
    "Submitting...": "सबमिट करत आहे...",
    "Application Submitted Successfully!": "अर्ज यशस्वीरित्या सबमिट केला!",
  },
  ta: {
    "Find inclusive jobs and livelihood opportunities": "உள்ளடக்கிய வேலைகள் மற்றும் வாழ்வாதார வாய்ப்புகளைக் கண்டறியவும்",
    "Search jobs by title, company, or location...": "தலைப்பு, நிறுவனம் அல்லது இடத்தால் வேலைகளைத் தேடுங்கள்...",
    "Company Profile": "நிறுவன சுயவிவரம்",
    "Job Seeker Profile": "வேலை தேடுபவர் சுயவிவரம்",
    "Create Job": "வேலையை உருவாக்கவும்",
    "Settings": "அமைப்புகள்",
    "Login": "உள்நுழைய",
    "Logout": "வெளியேறு",
    "Home": "முகப்பு",
    "Profile": "சுயவிவரம்",
    "Apply Now": "இப்போது விண்ணப்பிக்கவும்",
    "Full Name": "முழு பெயர்",
    "Age": "வயது",
    "Disability Type": "இயலாமை வகை",
    "Qualifications": "கல்வித் தகுதிகள்",
    "Account Status": "கணக்கு நிலை",
    "Company Name": "நிறுவனத்தின் பெயர்",
    "Business Registration Number": "வணிகப் பதிவு எண்",
    "Address": "முகவரி",
    "Registration Status": "பதிவு நிலை",
    "Registration Certificate": "பதிவுச் சான்றிதழ்",
    "Job Application Form": "வேலை விண்ணப்பப் படிவம்",
    "Middle Name": "நடு பெயர்",
    "Last Name": "கடைசி பெயர்",
    "Email Address": "மின்னஞ்சல் முகவரி",
    "Phone Number": "தொலைபேசி எண்",
    "Current Address": "தற்போதைய முகவரி",
    "Permanent Address": "நிரந்தர முகவரி",
    "Resume": "சுயவிவரம்",
    "Submit Application": "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
    "Submitting...": "சமர்ப்பிக்கிறது...",
    "Application Submitted Successfully!": "விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && ['en', 'hi', 'mr', 'ta'].includes(savedLanguage)) {
      setLanguage(savedLanguage as Language)
    }
  }, [])

  // Save language preference when it changes
  const handleLanguageChange = useCallback((newLang: Language) => {
    setLanguage(newLang)
    localStorage.setItem('preferred-language', newLang)
  }, [])

  const t = useCallback((text: string) => {
    return translations[language][text] || text
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 