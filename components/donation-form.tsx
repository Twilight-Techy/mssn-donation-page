"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description?: string
}

interface DonationFormProps {
  campaigns?: Campaign[]
  onCampaignSelect?: (campaign: Campaign) => void
  defaultCampaignId?: string
}

export default function DonationForm({ campaigns = [], onCampaignSelect, defaultCampaignId }: DonationFormProps) {
  const [amount, setAmount] = useState<string>("1000")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  // Use mock campaigns if none provided
  const displayCampaigns =
    campaigns.length > 0
      ? campaigns
      : [
          { id: "camp1", title: "Magazine Launch", description: "Help us launch our first Islamic magazine" },
          { id: "camp2", title: "Ramadan Food Drive", description: "Provide iftar meals for students" },
          { id: "camp3", title: "Islamic Library", description: "Help us expand our collection of Islamic books" },
        ]

  // Set initial selected campaign
  useEffect(() => {
    if (displayCampaigns.length > 0 && !selectedCampaign) {
      const defaultCampaign =
        displayCampaigns.find((c) => c.id === defaultCampaignId) || displayCampaigns[0]

      setSelectedCampaign(defaultCampaign.id)

      // Notify parent component about the initially selected campaign
      if (onCampaignSelect) {
        onCampaignSelect(defaultCampaign)
      }
    }
  }, [displayCampaigns, selectedCampaign, onCampaignSelect, defaultCampaignId])

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign(campaignId)

    // Find the selected campaign and notify parent component
    if (onCampaignSelect) {
      const selected = displayCampaigns.find((campaign) => campaign.id === campaignId)
      if (selected) {
        onCampaignSelect(selected)
      }
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setIsCustomAmount(value === "custom")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
  }

  const validateForm = () => {
    if (isCustomAmount && (!customAmount || Number(customAmount) < 100)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount (minimum ₦100)",
        variant: "destructive",
      })
      return false
    }

    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return false
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Mock implementation for preview
  const handlePaystackPayment = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/donate/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          amount: isCustomAmount ? customAmount : amount,
          campaignId: selectedCampaign,
          isAnonymous,
          isSubscribed,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Payment failed")

      toast({
        title: "Redirecting...",
        description: "Taking you to Paystack payment page.",
      })

      window.location.href = data.authorization_url
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment.",
        variant: "destructive",
      })
      window.location.href = "/donation/failed"
    } finally {
      setIsLoading(false)
    }
  }

  // Mock implementation for preview
  const handleOpayPayment = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For preview, just show success and redirect to success page
      toast({
        title: "Payment Initialized",
        description: "Redirecting to Opay...",
      })

      // Simulate redirect delay
      setTimeout(() => {
        window.location.href = "/donation/success?reference=PREVIEW-OPAY-123&payment_method=opay"
      }, 1000)
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "paystack") {
      handlePaystackPayment()
    } else if (paymentMethod === "opay") {
      handleOpayPayment()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="campaign">Select Campaign</Label>
        <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
          <SelectTrigger className="border-green-200">
            <SelectValue placeholder="Select a campaign" />
          </SelectTrigger>
          <SelectContent>
            {displayCampaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="donation-amount">Select Amount (₦)</Label>
        <RadioGroup
          defaultValue="1000"
          value={amount}
          onValueChange={handleAmountChange}
          className="grid grid-cols-3 gap-2"
        >
          <div>
            <RadioGroupItem value="1000" id="amount-1000" className="peer sr-only" />
            <Label
              htmlFor="amount-1000"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              ₦1,000
            </Label>
          </div>
          <div>
            <RadioGroupItem value="5000" id="amount-5000" className="peer sr-only" />
            <Label
              htmlFor="amount-5000"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              ₦5,000
            </Label>
          </div>
          <div>
            <RadioGroupItem value="10000" id="amount-10000" className="peer sr-only" />
            <Label
              htmlFor="amount-10000"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              ₦10,000
            </Label>
          </div>
          <div>
            <RadioGroupItem value="20000" id="amount-20000" className="peer sr-only" />
            <Label
              htmlFor="amount-20000"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              ₦20,000
            </Label>
          </div>
          <div>
            <RadioGroupItem value="50000" id="amount-50000" className="peer sr-only" />
            <Label
              htmlFor="amount-50000"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              ₦50,000
            </Label>
          </div>
          <div>
            <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
            <Label
              htmlFor="amount-custom"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-green-200 bg-white p-2 text-center peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 hover:bg-green-50"
            >
              Custom
            </Label>
          </div>
        </RadioGroup>
      </div>

      {isCustomAmount && (
        <div className="space-y-2">
          <Label htmlFor="custom-amount">Enter Custom Amount (₦)</Label>
          <Input
            id="custom-amount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            min="100"
            className="border-green-200"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          className="border-green-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Your email"
          className="border-green-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Your phone number"
          className="border-green-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Your message or prayer"
          className="border-green-200"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked === true)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="anonymous"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make my donation anonymous
          </Label>
          <p className="text-xs text-muted-foreground">Your name will not be displayed publicly</p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="newsletter"
          defaultChecked
          checked={isSubscribed}
          onCheckedChange={(checked) => setIsSubscribed(checked === true)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Subscribe to newsletter
          </Label>
          <p className="text-xs text-muted-foreground">Receive updates about our campaigns and events</p>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label>Payment Method</Label>
        <Tabs defaultValue="paystack" value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paystack">Paystack</TabsTrigger>
            <TabsTrigger value="opay">Opay Express</TabsTrigger>
          </TabsList>
          <TabsContent value="paystack" className="mt-2">
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 144 39" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.27 22.57h8.84v4.41H4.27v-4.41zm0-8.82h8.84v4.41H4.27v-4.41zm0-8.83h8.84v4.42H4.27V4.92zm106.17 25.91h-8.83V17.25h-4.42v13.58h-8.83V8.42h4.41v4.42h8.84V8.42h4.41v4.42h4.42v18zm-35.33 0h-8.83V17.25h-4.42v13.58h-8.83V17.25h-4.42v13.58h-8.83V8.42h4.41v4.42h8.84V8.42h4.41v4.42h8.84V8.42h4.41v4.42h4.42v18zM48.69 8.42v22h-8.83v-22h8.83zm-13.25 0v4.42h-8.83v17.58h-8.84V12.84h-8.83V8.42h26.5z"
                    fill="#00C3F7"
                  />
                  <path
                    d="M144 8.42v22h-8.83v-22h8.83zm-13.25 0v4.42h-8.83v17.58h-8.84V12.84h-8.83V8.42h26.5z"
                    fill="#00C3F7"
                  />
                </svg>
                <span className="text-sm font-medium">Pay with card, bank transfer, or USSD</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="opay" className="mt-2">
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 512 512" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="512" height="512" rx="256" fill="#0AB068" />
                  <path
                    d="M256 150C198.1 150 151 197.1 151 255C151 312.9 198.1 360 256 360C313.9 360 361 312.9 361 255C361 197.1 313.9 150 256 150ZM256 330C214.7 330 181 296.3 181 255C181 213.7 214.7 180 256 180C297.3 180 331 213.7 331 255C331 296.3 297.3 330 256 330Z"
                    fill="white"
                  />
                  <path
                    d="M256 210C231.7 210 212 229.7 212 254C212 278.3 231.7 298 256 298C280.3 298 300 278.3 300 254C300 229.7 280.3 210 256 210Z"
                    fill="white"
                  />
                </svg>
                <span className="text-sm font-medium">Pay with Opay Express Cashout</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Donate Now with ${paymentMethod === "paystack" ? "Paystack" : "Opay"}`
        )}
      </Button>
    </form>
  )
}
