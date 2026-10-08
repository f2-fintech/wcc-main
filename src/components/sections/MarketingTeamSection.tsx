"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Globe, User } from "lucide-react";

export function MarketingTeamSection() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/public/marketing-team");
        const data = await res.json();
        if (data.success) {
          setTeam(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch team", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (loading || team.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Our Team</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-primary">Meet the Marketing Team</h3>
            <p className="text-lg text-primary/70 max-w-2xl mx-auto mt-4">
              The dedicated individuals working behind the scenes to grow the White Coat Club community.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="mx-auto w-32 h-32 mb-6 rounded-full overflow-hidden bg-primary/10 border-4 border-white shadow-sm flex items-center justify-center">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-primary/30" />
                )}
              </div>
              <h4 className="text-2xl font-serif text-primary font-bold mb-1">{member.name}</h4>
              <p className="text-accent font-medium mb-6">{member.role}</p>

              <div className="flex flex-col items-center gap-3 text-sm text-primary/70">
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Phone className="w-4 h-4" /> {member.phone}
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Mail className="w-4 h-4" /> {member.email}
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Globe className="w-4 h-4" /> LinkedIn Profile
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
