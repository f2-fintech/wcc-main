"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const features = [
  {
    title: "Financial Conversations",
    desc: "Understand important financial concepts, ask questions and gain perspectives from professionals who work in the financial ecosystem.",
    image: "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/d61c3869-e468-4ed7-b63a-1fd72e365275.JPG"
  },
  {
    title: "Doctor-to-Doctor Networking",
    desc: "Meet fellow doctors, exchange experiences and build relationships with people who understand your professional journey.",
    image: "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6895dd15b40670e608f0/photos/6f788fe0-9b3e-4083-b75a-03c96b7ce8fa.JPG"
  },
  {
    title: "Knowledge Sessions",
    desc: "Hear from experienced professionals and experts on subjects relevant to life beyond medicine.",
    image: "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/15104109-6cba-47a2-a1d9-8916d22b577a.JPG"
  },
  {
    title: "Meaningful Conversations",
    desc: "No rigid agenda. No unnecessary formality. Just relevant conversations, useful insights and an opportunity to learn something new.",
    image: "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68cddd15b40670e60906/photos/e6da52a0-ade6-4b0c-94f6-de471d9e5305.JPG"
  },
  {
    title: "Community Experiences",
    desc: "Every edition is an opportunity to meet new people, reconnect with peers and become part of something bigger.",
    image: "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6893dd15b40670e608d4/photos/e176366b-38bf-499f-98ee-e478e63d6497.JPG"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">What Happens At White Coat Club?</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6 text-white">Conversations that go beyond the clinic.</h3>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Every White Coat Club gathering is designed around meaningful interaction rather than formal presentations alone.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 h-full hover:bg-white/10 transition-all duration-300 overflow-hidden group hover:shadow-xl hover:shadow-black/20">
                <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-accent">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Marquee Section */}
        <div className="mt-32 overflow-hidden py-10 relative border-y border-white/10">
          <div className="flex w-[200%] animate-marquee items-center gap-16">
            {/* Repeated for seamless marquee */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 whitespace-nowrap text-2xl font-serif text-white/50">
                <span>Expert conversations</span>
                <span className="text-accent">•</span>
                <span>Peer networking</span>
                <span className="text-accent">•</span>
                <span>Financial literacy</span>
                <span className="text-accent">•</span>
                <span>Knowledge sharing</span>
                <span className="text-accent">•</span>
                <span>Interactive discussions</span>
                <span className="text-accent">•</span>
                <span>Food & refreshments</span>
                <span className="text-accent">•</span>
                <span>New connections</span>
                <span className="text-accent">•</span>
                <span>Good conversations</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
