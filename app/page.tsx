"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonationForm from "@/components/donation-form"
import CampaignCard from "@/components/campaign-card"
import TestimonialCard from "@/components/testimonial-card"
import SmoothScroll from "@/components/smooth-scroll"
import { differenceInDays } from "date-fns"
import { ChurchIcon as Mosque, Book, GraduationCap, Users, Heart, Calendar, ChevronRight } from "lucide-react"
import Loader from "@/components/loader"

type Campaign = {
  id: string
  title: string
  description: string
  imageSrc: string
  goal: number
  raised: number
  startDate: string | Date
  endDate: string | Date
  isActive: boolean
  isFeatured: boolean
}

type CampaignGroup = {
  activeCampaigns: Campaign[]
  upcomingCampaigns: Campaign[]
  completedCampaigns: Campaign[]
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<CampaignGroup | null>(null)

  const [selectedCampaign, setSelectedCampaign] = useState<{
    id: string
    title: string
    description?: string
  } | null>(null)

  const [activeCampaignDetails, setActiveCampaignDetails] = useState<Campaign | null>(null)

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns")
        const data = await res.json()
        setCampaigns(data)

        const featured =
          data.activeCampaigns.find((c: Campaign) => c.isFeatured) ||
          data.activeCampaigns[0] ||
          null
        
        if (featured) {
          setActiveCampaignDetails(featured)
          setSelectedCampaign({
            id: featured.id,
            title: featured.title,
            description: featured.description,
          })
        }
      } catch (error) {
        console.error("Failed to fetch campaigns", error)
      }
    }

    fetchCampaigns()
  }, [])

  // Get featured campaign for the hero section
  const featuredCampaign =
    campaigns?.activeCampaigns.find((campaign) => campaign.isFeatured) ||
    campaigns?.activeCampaigns[0] ||
    null

  // Handle campaign selection in the donation form
  const handleCampaignSelect = (campaign: { id: string; title: string; description?: string }) => {
    setSelectedCampaign(campaign)

    // Find the full campaign details from the active campaigns
    const fullCampaignDetails = campaigns?.activeCampaigns.find((c) => c.id === campaign.id)
    if (fullCampaignDetails) {
      setActiveCampaignDetails(fullCampaignDetails)
    }
  }

  if (!campaigns || !activeCampaignDetails) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-white">
      <SmoothScroll />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Mosque className="h-6 w-6 text-green-600" />
            <span className="font-arabic text-xl font-bold text-green-700">MSSN LASU</span>
            <span className="hidden text-sm text-green-600 sm:inline-block">Epe Chapter</span>
          </div>
          <nav className="hidden md:flex md:gap-6">
            <Link href="#about" className="text-sm font-medium text-green-700 transition-colors hover:text-green-500">
              About
            </Link>
            <Link href="#donate" className="text-sm font-medium text-green-700 transition-colors hover:text-green-500">
              Donate
            </Link>
            <Link
              href="#campaigns"
              className="text-sm font-medium text-green-700 transition-colors hover:text-green-500"
            >
              Campaigns
            </Link>
            <Link href="#contact" className="text-sm font-medium text-green-700 transition-colors hover:text-green-500">
              Contact
            </Link>
          </nav>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="#donate">Donate Now</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section with Islamic Pattern Background */}
        <section className="relative overflow-hidden bg-gradient-to-r from-green-50 to-green-100 py-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23047857' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="container relative grid gap-6 py-4 md:grid-cols-2 md:gap-10 md:py-8">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-green-200 bg-white px-3 py-1 text-sm text-green-600 shadow-sm">
                <span className="animate-pulse rounded-full bg-green-500 h-2 w-2 mr-2"></span>
                Current Campaign: {featuredCampaign?.title || "Magazine Launch"}
              </div>
              <h1 className="font-arabic text-4xl font-bold tracking-tighter text-green-800 md:text-5xl lg:text-6xl">
                Support Islamic Education & Community
              </h1>
              <p className="text-lg text-green-700 md:text-xl">
                Join us in our mission to promote Islamic knowledge and values through our upcoming magazine launch and
                other initiatives.
              </p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 group" asChild>
                  <Link href="#donate">
                    Donate Now
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  asChild
                >
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-8 border-white shadow-xl transition-all duration-500 hover:scale-105 md:h-[400px] md:w-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop"
                  alt="MSSN LASU Epe Chapter - Islamic Education and Community"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Current Campaign Section */}
        <section id="donate" className="py-16 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-arabic text-3xl font-bold text-green-800 md:text-4xl">
                {selectedCampaign?.title || activeCampaignDetails?.title || "Magazine Launch Campaign"}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {selectedCampaign?.description ||
                  activeCampaignDetails?.description ||
                  "Help us launch our first Islamic magazine to spread knowledge and inspire our community."}
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-green-700">Fundraising Goal</h3>
                    <span className="font-bold text-green-600">
                      ₦{activeCampaignDetails?.goal.toLocaleString() || "500,000"}
                    </span>
                  </div>
                  <Progress
                    value={
                      activeCampaignDetails
                        ? Math.round((activeCampaignDetails.raised / activeCampaignDetails.goal) * 100)
                        : 65
                    }
                    className="h-3 bg-green-100"
                    indicatorClassName="bg-green-600"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-green-700">
                      ₦{activeCampaignDetails?.raised.toLocaleString() || "325,000"} raised
                    </span>
                    <span className="text-gray-500">
                      {activeCampaignDetails
                        ? Math.round((activeCampaignDetails.raised / activeCampaignDetails.goal) * 100)
                        : 65}
                      % of goal
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Campaign Deadline</h4>
                      <p className="text-gray-600">
                        {activeCampaignDetails?.endDate
                          ? `${differenceInDays(new Date(activeCampaignDetails.endDate), new Date())} days remaining`
                          : "30 days remaining"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Supporters</h4>
                      <p className="text-gray-600">78 donors have contributed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-green-50 p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-green-800">Make a Donation</h3>
                <DonationForm
                  campaigns={campaigns.activeCampaigns.map((campaign) => ({
                    id: campaign.id,
                    title: campaign.title,
                    description: campaign.description,
                  }))}
                  onCampaignSelect={handleCampaignSelect}
                  defaultCampaignId={activeCampaignDetails.id}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-green-50">
          <div className="container">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="relative h-[400px] overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop"
                  alt="MSSN LASU Epe Chapter Members"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="font-arabic text-3xl font-bold text-green-800 md:text-4xl">
                  About MSSN LASU Epe Chapter
                </h2>
                <p className="text-gray-600">
                  The Muslim Students' Society of Nigeria (MSSN) at Lagos State University, Epe Campus is dedicated to
                  promoting Islamic values, education, and community service among students.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <Book className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Islamic Education</h4>
                      <p className="text-sm text-gray-600">Promoting Islamic knowledge and values</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Academic Excellence</h4>
                      <p className="text-sm text-gray-600">Supporting students in their academic journey</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Community Building</h4>
                      <p className="text-sm text-gray-600">Creating a supportive Muslim community</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Charity Work</h4>
                      <p className="text-sm text-gray-600">Engaging in charitable activities</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-fit border-green-200 text-green-700 hover:bg-green-100"
                  asChild
                >
                  <Link href="#contact">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Campaigns Section */}
        <section id="campaigns" className="py-16 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-arabic text-3xl font-bold text-green-800 md:text-4xl">Our Campaigns</h2>
              <p className="mt-4 text-lg text-gray-600">
                Support our various initiatives aimed at promoting Islamic education and community development.
              </p>
            </div>

            <Tabs defaultValue="current" className="mt-12">
              <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="current" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {campaigns.activeCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      title={campaign.title}
                      description={campaign.description}
                      imageSrc={campaign.imageSrc}
                      progress={Math.round((campaign.raised / campaign.goal) * 100)}
                      raised={`₦${campaign.raised.toLocaleString()}`}
                      goal={`₦${campaign.goal.toLocaleString()}`}
                      daysLeft={campaign.endDate ? differenceInDays(new Date(campaign.endDate), new Date()) : 30}
                      featured={campaign.isFeatured}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="upcoming" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {campaigns.upcomingCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      title={campaign.title}
                      description={campaign.description}
                      imageSrc={campaign.imageSrc}
                      progress={0}
                      raised={`₦0`}
                      goal={`₦${campaign.goal.toLocaleString()}`}
                      daysLeft={differenceInDays(new Date(campaign.startDate), new Date())}
                      upcoming={true}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {campaigns.completedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      title={campaign.title}
                      description={campaign.description}
                      imageSrc={campaign.imageSrc}
                      progress={100}
                      raised={`₦${campaign.raised.toLocaleString()}`}
                      goal={`₦${campaign.goal.toLocaleString()}`}
                      completed={true}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-green-50">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-arabic text-3xl font-bold text-green-800 md:text-4xl">What Our Supporters Say</h2>
              <p className="mt-4 text-lg text-gray-600">Hear from those who have supported our previous campaigns.</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                name="Ibrahim Abdullah"
                role="Alumni, LASU"
                quote="Supporting MSSN LASU Epe Chapter has been a rewarding experience. Their commitment to Islamic education is commendable."
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              />
              <TestimonialCard
                name="Aisha Mohammed"
                role="Current Student"
                quote="The MSSN has created a supportive community for Muslim students. Their initiatives have greatly enriched my university experience."
                imageSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
              />
              <TestimonialCard
                name="Dr. Yusuf Oladimeji"
                role="Faculty Member"
                quote="The dedication of MSSN LASU Epe Chapter to promoting Islamic values while encouraging academic excellence is truly inspiring."
                imageSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-arabic text-3xl font-bold text-green-800 md:text-4xl">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-gray-600">
                Find answers to common questions about our donation process and campaigns.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-700">How will my donation be used?</h3>
                <p className="mt-2 text-gray-600">
                  Your donation will be used specifically for the campaign you choose to support. For the magazine
                  launch, funds will cover printing costs, design, and distribution.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-700">Is my donation tax-deductible?</h3>
                <p className="mt-2 text-gray-600">
                  As a registered student organization, donations may be tax-deductible. Please consult with a tax
                  professional for advice specific to your situation.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-700">Can I donate anonymously?</h3>
                <p className="mt-2 text-gray-600">
                  Yes, you can choose to make your donation anonymously during the checkout process. Your personal
                  information will not be publicly displayed.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-700">How can I get involved beyond donating?</h3>
                <p className="mt-2 text-gray-600">
                  We welcome volunteers and supporters! Contact us to learn about volunteering opportunities, attending
                  events, or contributing skills and resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-arabic text-3xl font-bold md:text-4xl">Join Us in Making a Difference</h2>
              <p className="mt-4 text-lg text-green-50">
                Your support helps us promote Islamic education and build a stronger community.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50" asChild>
                  <Link href="#donate">Donate Now</Link>
                </Button>
                <Button size="lg" className="bg-green-500 text-white hover:bg-green-400 transition-colors" asChild>
                  <Link href="#contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t bg-green-900 text-white">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Mosque className="h-6 w-6 text-green-300" />
                <span className="font-arabic text-xl font-bold text-white">MSSN LASU</span>
              </div>
              <p className="mt-4 text-green-200">
                Muslim Students' Society of Nigeria
                <br />
                Lagos State University, Epe Campus
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#about" className="text-green-200 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#donate" className="text-green-200 hover:text-white">
                    Donate
                  </Link>
                </li>
                <li>
                  <Link href="#campaigns" className="text-green-200 hover:text-white">
                    Campaigns
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-green-200 hover:text-white">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Us</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-green-200">Email: mssnlasuepe@example.com</li>
                <li className="text-green-200">Phone: +234 123 456 7890</li>
                <li className="text-green-200">Address: LASU Epe Campus, Lagos State</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Connect With Us</h3>
              <div className="mt-4 flex space-x-4">
                <Link href="#" className="text-green-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-green-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-green-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
