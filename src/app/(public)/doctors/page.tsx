"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Stethoscope, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SmartDoctorImage } from "@/components/ui/SmartDoctorImage";

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        specialization,
        city,
      });
      const res = await fetch(`/api/public/doctors?${query}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, specialization, city, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages || newPage === page) return;
    setPage(newPage);
    if (resultsRef.current) {
      const yOffset = -120;
      const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSpecialization("");
    setCity("");
    setPage(1);
  };

  // Helper to generate page pills with ellipsis
  const getPageNumbers = () => {
    const totalPages = pagination.pages;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (page <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  const startCount = pagination.total === 0 ? 0 : (page - 1) * limit + 1;
  const endCount = Math.min(page * limit, pagination.total);
  const hasActiveFilters = Boolean(search || specialization || city);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Doctor Directory</h1>
          <p className="text-lg text-primary/70">Connect with fellow members of the White Coat Club community.</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search by name..." 
                className="pl-10 h-12"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative flex-1">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Specialization..." 
                className="pl-10 h-12"
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="City..." 
                className="pl-10 h-12"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-primary/60">
                Filtered results for active search criteria
              </span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Directory Controls Header: Count and Limit Selector */}
        <div ref={resultsRef} className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-sm">
          <div className="text-primary/70">
            {loading ? (
              <span className="inline-block h-4 w-36 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              <span>
                Showing <strong className="text-primary">{startCount}–{endCount}</strong> of <strong className="text-primary">{pagination.total}</strong> doctors
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="limit-select" className="text-primary/70 text-sm whitespace-nowrap">
              Show:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-primary font-medium shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
              <option value={18}>18 per page</option>
              <option value={24}>24 per page</option>
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-gray-200 h-72 sm:h-80 w-full"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/doctors/${doctor.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 shadow-sm cursor-pointer group bg-white rounded-2xl flex flex-col">
                    {/* Image container with object-top and fixed aspect ratio so faces are never cropped */}
                    <div className="h-72 sm:h-80 bg-gray-100 overflow-hidden relative shrink-0">
                      {doctor.photoUrl ? (
                        <SmartDoctorImage 
                          src={doctor.photoUrl} 
                          alt={doctor.name} 
                          focalPoint={doctor.focalPoint}
                          className="group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <Stethoscope className="w-20 h-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                          Dr. {doctor.name}
                        </h3>
                        {doctor.specialization && (
                          <p className="text-accent font-medium mb-3">{doctor.specialization}</p>
                        )}
                      </div>
                      
                      {(doctor.hospital || doctor.city || doctor.state) && (
                        <div className="space-y-2 text-sm text-primary/70 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 shrink-0 text-accent/80" /> 
                            <span className="truncate">
                              {[doctor.hospital, doctor.city, doctor.state].filter(Boolean).join(", ")}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/50 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-primary/80 mb-2">No doctors found</p>
            <p className="text-sm text-primary/60 max-w-md mx-auto mb-6">
              No doctor profiles matched your current search criteria. Try modifying your search or clearing the filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.pages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
            <p className="text-sm text-primary/70">
              Page <strong className="text-primary">{pagination.page}</strong> of <strong className="text-primary">{pagination.pages}</strong>
            </p>

            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(p)}
                      className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center ${
                        p === page
                          ? "bg-primary text-white border border-primary font-semibold"
                          : "bg-white text-primary/80 border border-gray-200 hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1.5 text-gray-400 select-none">
                      {p}
                    </span>
                  )
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Next Page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
