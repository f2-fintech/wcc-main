"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: any) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/public/contact", {
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
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Contact</h2>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Let's start a conversation.</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="md:col-span-2 bg-primary p-12 text-white">
            <h3 className="font-serif text-2xl mb-8">Get in touch</h3>
            
            <div className="space-y-6 text-white/70">
              <div>
                <strong className="block text-white mb-1">Email</strong>
                contact@whitecoatclub.com
              </div>
              <div>
                <strong className="block text-white mb-1">Phone</strong>
                +91 98765 43210
              </div>
              <div>
                <strong className="block text-white mb-1">Location</strong>
                Mumbai, India
              </div>
            </div>
            
            <div className="mt-16 text-sm text-white/50">
              <p>Have a question about White Coat Club?</p>
              <p>Want to collaborate?</p>
              <p>Want to speak at an upcoming edition?</p>
            </div>
          </div>
          
          <div className="md:col-span-3 p-12">
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-serif text-primary">Message Sent Successfully!</h3>
                <p className="text-primary/70">Thank you for reaching out. Our team will get back to you shortly.</p>
                <Button onClick={() => setStatus("idle")} variant="outline" className="mt-4">Send another message</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">{errorMessage}</div>
                )}
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject / Enquiry Type</Label>
                  <select 
                    id="subject" 
                    {...register("subject")}
                    className="flex h-12 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="General">General Enquiry</option>
                    <option value="Partner">Partner with us</option>
                    <option value="Speaker">Become a speaker</option>
                    <option value="Bring to my city">Bring to my city</option>
                  </select>
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} {...register("message")} className={errors.message ? "border-red-500" : ""} />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message as string}</p>}
                </div>

                <Button type="submit" disabled={status === "loading"} className="w-full h-12">
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
