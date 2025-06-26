"use client"

import Image from "next/image"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  imageSrc: string
}

export default function TestimonialCard({ name, role, quote, imageSrc }: TestimonialCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-green-100">
          <Image
            src={
              imageSrc ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" ||
              "/placeholder.svg"
            }
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-4">
          <svg className="mx-auto h-8 w-8 text-green-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="mt-2 text-gray-600">{quote}</p>
          <div className="mt-4">
            <h4 className="font-bold text-green-700">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
