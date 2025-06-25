"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2, Volume2, VolumeX } from "lucide-react"

type Job = {
  id: string
  title: string
  description: string
  image: string
  link: string
  video?: string
}

interface JobCarouselProps {
  title: string
  jobs: Job[]
  isAdmin?: boolean
  onDelete?: (id: string) => void
}

export function JobCarousel({ title, jobs, isAdmin = false, onDelete }: JobCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({})

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title}`)
    if (!container) return

    const scrollAmount = 320 // Approximate card width + gap
    const newPosition =
      direction === "left" ? Math.max(scrollPosition - scrollAmount, 0) : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(id)
    }
  }

  const toggleMute = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const videoElement = event.currentTarget.parentElement?.querySelector('video') as HTMLVideoElement
    if (videoElement) {
      videoElement.muted = !videoElement.muted
      setMutedStates(prev => ({
        ...prev,
        [jobId]: videoElement.muted
      }))
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} disabled={scrollPosition <= 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div id={`carousel-${title}`} className="carousel-container flex gap-4 overflow-x-auto pb-4 snap-x">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="min-w-[300px] max-w-[300px] snap-start bg-black/50 border-white/10 hover:border-white/30 transition-all"
          >
            <Link href={job.link}>
              <div className={`relative ${job.image && job.image.includes('ucaocos_pampeanos') ? 'h-32' : 'h-40'} w-full overflow-hidden rounded-t-lg flex justify-center items-center`}>
                {job.video ? (
                  <div className="flex justify-center items-center h-full w-full">
                    <video
                      src={job.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        display: 'block',
                        margin: 'auto',
                        height: '100%',
                        width: job.id === "7" || job.id === "19" || job.id === "20" ? '100%' : 'auto',
                        objectFit: job.id === "7" || job.id === "19" || job.id === "20" ? 'cover' : 'contain'
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                      onClick={(e) => toggleMute(job.id, e)}
                    >
                      {mutedStates[job.id] ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <Image
                    src={job.image || "/placeholder.svg"}
                    alt={job.title}
                    fill
                    className={`object-cover transition-transform hover:scale-105${job.image && job.image.includes('buyer_persona') ? ' object-top' : ''}`}
                  />
                )}
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => handleDelete(e, job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-sm text-white/70 line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="link" className="p-0 h-auto">
                  Ver más
                </Button>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
