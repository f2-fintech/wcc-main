import dbConnect from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { notFound } from "next/navigation";
import { MapPin, Stethoscope, GraduationCap, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const instant = false;

async function getDoctor(slug: string) {
  await dbConnect();
  const doc = await Doctor.findOne({ slug, isPublished: true }).lean();
  if (!doc) return null;
  // Convert _id to string so it can be passed to client components if needed
  return JSON.parse(JSON.stringify(doc));
}

export default async function DoctorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/doctors">← Back to Directory</Link>
        </Button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-primary/5">
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-[500px] object-cover" />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center text-primary/20">
                  <Stethoscope className="w-32 h-32" />
                </div>
              )}
            </div>
            
            <div className="md:col-span-2 p-10 md:p-16">
              <h1 className="font-serif text-4xl md:text-5xl text-primary mb-2">Dr. {doctor.name}</h1>
              <p className="text-xl text-accent font-medium mb-8">{doctor.specialization}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3 text-primary/70">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="block text-primary">Current Hospital/Clinic</strong>
                    {doctor.hospital}<br />
                    {doctor.city}, {doctor.state}
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-primary/70">
                  <GraduationCap className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="block text-primary">Qualifications</strong>
                    {doctor.qualifications}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-primary/70">
                  <Clock className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="block text-primary">Experience</strong>
                    {doctor.experienceYears} Years
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="font-serif text-2xl text-primary mb-4">About Dr. {doctor.name}</h3>
                <div className="text-primary/70 leading-relaxed space-y-4">
                  {doctor.bio.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
              
              {doctor.socialLinks?.linkedin && (
                <div className="mt-8">
                  <Button asChild variant="outline">
                    <a href={doctor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">View LinkedIn Profile</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
