"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export function EventsSection() {
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          fetch('/api/public/events/upcoming'),
          fetch('/api/public/events?status=past')
        ]);
        
        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        if (upcomingData.success) setUpcomingEvent(upcomingData.data);
        if (pastData.success) setPastEvents(pastData.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <section id="events" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Our Events</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6 text-primary">Where the community comes together.</h3>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto">
              White Coat Club events are designed to create an environment where doctors can learn, interact and enjoy an evening away from their regular routine.
            </p>
          </motion.div>
        </div>

        {/* Upcoming Event */}
        {!loading && upcomingEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <Card className="overflow-hidden border-none shadow-2xl bg-white">
              <div className="grid md:grid-cols-2">
                <div className="bg-primary p-12 text-white flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold uppercase rounded-full w-max mb-6">Upcoming Event</span>
                  <h4 className="text-3xl font-serif mb-6">{upcomingEvent.editionName}</h4>
                  
                  <div className="space-y-4 mb-8 text-white/80">
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-accent"/> {upcomingEvent.date}</div>
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-accent"/> {upcomingEvent.time}</div>
                    <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-accent"/> {upcomingEvent.venue}, {upcomingEvent.location}</div>
                  </div>

                  <Button asChild variant="accent" size="lg" className="w-max shadow-lg shadow-accent/20 hover:scale-105 transition-transform">
                    <Link href="/join">RESERVE YOUR SEAT</Link>
                  </Button>
                  <p className="text-sm text-white/50 mt-4">Limited seats for doctors.</p>
                </div>
                
                {/* Right Column: Image with Glassmorphism Overlay */}
                <div className="relative p-8 md:p-12 flex flex-col justify-end min-h-[400px]">
                  {upcomingEvent.bannerImageUrl ? (
                    <img 
                      src={upcomingEvent.bannerImageUrl} 
                      alt={upcomingEvent.editionName} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                  )}
                  
                  {/* Overlay Gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  
                  {/* Glassmorphism Card for "What to expect" */}
                  <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                    <h5 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-accent inline-block"></span>
                      What to expect
                    </h5>
                    <ul className="space-y-3">
                      {upcomingEvent.whatToExpect?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-white/90 text-sm">
                          <span className="text-accent mt-1 text-lg leading-none">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : !loading && !upcomingEvent ? (
          <div className="text-center mb-24 p-12 bg-primary/5 rounded-3xl">
            <h4 className="text-2xl font-serif text-primary mb-4">Next edition announced soon</h4>
            <Button variant="default">Join the Community to stay updated</Button>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center mb-24">Loading...</div>
        )}

        {/* Previous Editions */}
        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-3xl font-serif mb-12 text-primary text-center">Previous Editions</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {pastEvents.map((event, i) => (
                <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.bannerImageUrl && (
                    <img src={event.bannerImageUrl} alt={event.editionName} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-6">
                    <h5 className="font-bold text-xl mb-2">{event.editionName}</h5>
                    <p className="text-sm text-primary/60 flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4"/> {event.date}
                    </p>
                    <Button variant="outline" className="w-full">Explore Gallery</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
