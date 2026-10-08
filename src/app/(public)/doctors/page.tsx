"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Stethoscope } from "lucide-react";

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, specialization, city });
      const res = await fetch(`/api/public/doctors?${query}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specialization, city]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Doctor Directory</h1>
          <p className="text-lg text-primary/70">Connect with fellow members of the White Coat Club community.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search by name..." 
              className="pl-10 h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Specialization..." 
              className="pl-10 h-12"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="City..." 
              className="pl-10 h-12"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-2xl"></div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/doctors/${doctor.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all overflow-hidden border-none shadow-sm cursor-pointer group">
                    <div className="h-64 bg-gray-100 overflow-hidden relative">
                      {doctor.photoUrl ? (
                        <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <Stethoscope className="w-20 h-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-primary mb-1">Dr. {doctor.name}</h3>
                      <p className="text-accent font-medium mb-4">{doctor.specialization}</p>
                      
                      <div className="space-y-2 text-sm text-primary/70">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {doctor.hospital}, {doctor.city}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/50">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
