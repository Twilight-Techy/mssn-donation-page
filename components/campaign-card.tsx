"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle, Clock } from "lucide-react"

interface CampaignCardProps {
  title: string
  description: string
  imageSrc: string
  progress: number
  raised: string
  goal: string
  daysLeft?: number
  featured?: boolean
  upcoming?: boolean
  completed?: boolean
}

export default function CampaignCard({
  title,
  description,
  imageSrc,
  progress,
  raised,
  goal,
  daysLeft,
  featured = false,
  upcoming = false,
  completed = false,
}: CampaignCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-xl border bg-white shadow-md transition-all duration-300 hover:shadow-xl ${featured ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
    >
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              imageSrc || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
            }
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {featured && (
          <div className="absolute left-0 top-0 bg-green-600 px-3 py-1 text-xs font-medium text-white">Featured</div>
        )}
        {upcoming && (
          <div className="absolute left-0 top-0 bg-blue-600 px-3 py-1 text-xs font-medium text-white">Upcoming</div>
        )}
        {completed && (
          <div className="absolute left-0 top-0 bg-green-600 px-3 py-1 text-xs font-medium text-white">Completed</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-green-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-4 space-y-2">
          <Progress value={progress} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-green-700">{raised} raised</span>
            <span className="text-gray-500">
              {progress}% of {goal}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {daysLeft && !completed && (
            <div className="flex items-center gap-1 text-gray-600">
              {upcoming ? <Clock className="h-4 w-4 text-blue-500" /> : <Calendar className="h-4 w-4 text-green-500" />}
              <span>{daysLeft} days left</span>
            </div>
          )}
          {completed && (
            <div className="flex items-center gap-1 text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Campaign completed</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          {!completed && !upcoming && (
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="#donate">Donate Now</Link>
            </Button>
          )}
          {upcoming && (
            <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
              Remind Me
            </Button>
          )}
          {completed && (
            <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
              View Results
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
