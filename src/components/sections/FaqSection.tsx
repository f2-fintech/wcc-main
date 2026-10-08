"use client";

import { Accordion } from "@/components/ui/Accordion";

const faqData = [
  {
    question: "What is White Coat Club?",
    answer: "White Coat Club is a community initiative created especially for doctors, providing a space to connect, learn, exchange experiences and grow beyond the clinic."
  },
  {
    question: "Is White Coat Club a medical conference?",
    answer: "No. White Coat Club is not a medical conference. It is a community experience designed around conversations, networking, learning and meaningful interaction."
  },
  {
    question: "Is White Coat Club a sales event?",
    answer: "No. White Coat Club is not designed as a sales meeting or product-promotion event."
  },
  {
    question: "Who can attend?",
    answer: "White Coat Club is created primarily for doctors and members of the medical community."
  },
  {
    question: "Is there a registration fee?",
    answer: "No. White Coat Club is completely free."
  },
  {
    question: "What topics are discussed?",
    answer: "Topics can include financial literacy and other areas relevant to doctors' personal and professional lives."
  },
  {
    question: "Can I attend with another doctor?",
    answer: "Yes, subject to registration and availability for the particular edition."
  },
  {
    question: "Can my organisation collaborate with White Coat Club?",
    answer: "Yes. We welcome relevant community, knowledge and event partnerships."
  },
  {
    question: "How can I become part of the community?",
    answer: "Register through the website and join us at an upcoming White Coat Club gathering."
  }
];

export function FaqSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-primary mb-4">FAQ — Frequently Asked Questions</h2>
        </div>
        
        <div className="bg-gray-50 p-8 md:p-12 rounded-3xl">
          <Accordion items={faqData} />
        </div>
      </div>
    </section>
  );
}
