import { connection } from "next/server";
import dbConnect from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { notFound } from "next/navigation";
import { DoctorProfileCard } from "@/components/doctor/DoctorProfileCard";
import type { Metadata } from "next";

// Next.js 16: Allow blocking route at request time for dynamic DB lookup
export const instant = false;

async function getDoctor(slug: string) {
  await connection();
  await dbConnect();
  const doc = await Doctor.findOne({ slug, isPublished: true }).lean();
  if (!doc) return null;
  // Convert _id to string so it can be passed to client components
  return JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) {
    return {
      title: "Doctor Profile | White Coat Club",
    };
  }

  const title = `Dr. ${doctor.name} - ${doctor.specialization || "Doctor"} | The White Coat Club`;
  const description = doctor.bio || `View Dr. ${doctor.name}'s verified medical profile and practice credentials on The White Coat Club.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: doctor.photoUrl ? [{ url: doctor.photoUrl, alt: `Dr. ${doctor.name}` }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: doctor.photoUrl ? [doctor.photoUrl] : [],
    },
  };
}

export default async function DoctorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);

  if (!doctor) {
    notFound();
  }

  return <DoctorProfileCard doctor={doctor} />;
}
