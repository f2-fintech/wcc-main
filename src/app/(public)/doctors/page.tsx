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
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-2 sm:mb-4">Doctor Directory</h1>
          <p className="text-sm sm:text-base md:text-lg text-primary/70">Connect with fellow members of the White Coat Club community.</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 sm:mb-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              <Input 
                placeholder="Search by name..." 
                className="pl-9 sm:pl-10 pr-8 h-11 sm:h-12 text-sm sm:text-base rounded-xl"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Clear name search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              <Input 
                placeholder="Specialization..." 
                className="pl-9 sm:pl-10 pr-8 h-11 sm:h-12 text-sm sm:text-base rounded-xl"
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                }}
              />
              {specialization && (
                <button
                  type="button"
                  onClick={() => {
                    setSpecialization("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Clear specialization search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              <Input 
                placeholder="City..." 
                className="pl-9 sm:pl-10 pr-8 h-11 sm:h-12 text-sm sm:text-base rounded-xl"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
              />
              {city && (
                <button
                  type="button"
                  onClick={() => {
                    setCity("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Clear city search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-primary/60">
                Filtered results for active search criteria
              </span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Directory Controls Header: Count and Limit Selector */}
        <div ref={resultsRef} className="flex items-center justify-between gap-3 mb-5 sm:mb-6 text-xs sm:text-sm">
          <div className="text-primary/70">
            {loading ? (
              <span className="inline-block h-4 w-28 sm:w-36 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              <span>
                Showing <strong className="text-primary">{startCount}–{endCount}</strong> of <strong className="text-primary">{pagination.total}</strong> <span className="hidden sm:inline">doctors</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="limit-select" className="text-primary/70 whitespace-nowrap">
              Show:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-primary font-medium shadow-xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <div className="bg-gray-200 h-64 sm:h-72 md:h-80 w-full"></div>
                <div className="p-4 sm:p-5 md:p-6 space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link href={`/doctors/${doctor.slug}`} className="block h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 shadow-xs cursor-pointer group bg-white rounded-2xl flex flex-col">
                    {/* Image container with responsive heights and face detection */}
                    <div className="h-64 sm:h-72 md:h-80 bg-gray-100 overflow-hidden relative shrink-0">
                      {doctor.photoUrl ? (
                        <SmartDoctorImage 
                          src={doctor.photoUrl} 
                          alt={doctor.name} 
                          focalPoint={doctor.focalPoint}
                          className="group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <Stethoscope className="w-16 h-16 sm:w-20 sm:h-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors line-clamp-1">
                          Dr. {doctor.name}
                        </h3>
                        {doctor.specialization && (
                          <p className="text-accent text-xs sm:text-sm font-medium mb-2.5 line-clamp-1">
                            {doctor.specialization}
                          </p>
                        )}
                      </div>
                      
                      {(doctor.hospital || doctor.city || doctor.state) && (
                        <div className="space-y-1.5 text-xs sm:text-sm text-primary/70 mt-2.5 pt-2.5 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-accent/80" /> 
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
          <div className="text-center py-16 sm:py-24 px-4 sm:px-6 text-primary/50 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-2xl mx-auto">
            <Stethoscope className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg sm:text-xl font-medium text-primary/80 mb-2">No doctors found</p>
            <p className="text-xs sm:text-sm text-primary/60 max-w-md mx-auto mb-6">
              No doctor profiles matched your current search criteria. Try modifying your search or clearing the filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.pages > 1 && (
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-primary/70 order-2 sm:order-1">
              Page <strong className="text-primary">{pagination.page}</strong> of <strong className="text-primary">{pagination.pages}</strong>
            </p>

            <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border border-gray-200 bg-white text-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Mobile Compact Page Pill */}
              <div className="sm:hidden px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-primary shadow-xs">
                {pagination.page} / {pagination.pages}
              </div>

              {/* Tablet & Desktop Numbered Page Buttons */}
              <div className="hidden sm:flex items-center gap-1.5">
                {getPageNumbers().map((p, idx) => (
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(p)}
                      className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-all shadow-xs flex items-center justify-center cursor-pointer ${
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
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border border-gray-200 bg-white text-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
