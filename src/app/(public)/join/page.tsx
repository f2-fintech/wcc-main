"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinFormSchema } from "@/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { motion } from "framer-motion";

export default function JoinPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(joinFormSchema),
  });

  const onSubmit = async (data: any) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/public/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error occurred.");
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Membership</h2>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Join White Coat Club</h1>
          <p className="text-lg text-primary/70 max-w-xl mx-auto mb-4">
            Join a growing community of doctors who believe that learning, connection and growth don't stop when the clinic closes.
          </p>
          <p className="text-accent font-medium">It's free. It's for doctors. And it's built around you.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-12"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-3xl font-serif text-primary">Welcome to the community</h3>
              <p className="text-lg text-primary/70 max-w-md">We have received your request. We'll be in touch with you shortly via email with the next steps.</p>
              <Button onClick={() => window.location.href = '/'} variant="outline" className="mt-4">Return to Home</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {status === "error" && (
                <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium">{errorMessage}</div>
              )}
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Medical Council Reg. No. *</Label>
                  <Input id="registrationNumber" {...register("registrationNumber")} className={errors.registrationNumber ? "border-red-500" : ""} />
                  {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input id="specialization" {...register("specialization")} className={errors.specialization ? "border-red-500" : ""} />
                  {errors.specialization && <p className="text-xs text-red-500">{errors.specialization.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience *</Label>
                  <Input id="experienceYears" type="number" {...register("experienceYears")} className={errors.experienceYears ? "border-red-500" : ""} />
                  {errors.experienceYears && <p className="text-xs text-red-500">{errors.experienceYears.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic Name *</Label>
                  <Input id="hospital" {...register("hospital")} className={errors.hospital ? "border-red-500" : ""} />
                  {errors.hospital && <p className="text-xs text-red-500">{errors.hospital.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register("city")} className={errors.city ? "border-red-500" : ""} />
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" rows={4} {...register("message")} />
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <input type="checkbox" required id="consent" className="mt-1" />
                <label htmlFor="consent" className="text-sm text-primary/70 leading-relaxed">
                  I consent to the collection and use of my information by White Coat Club and its partners to process my membership and keep me informed about events and community updates.
                </label>
              </div>

              <Button type="submit" size="lg" disabled={status === "loading"} className="w-full md:w-auto px-12">
                {status === "loading" ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
