"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { milestones } from "@/lib/content";

function TimelineCard({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start gap-4 md:gap-8">
      {/* Desktop: alternate left/right */}
      <div className={`hidden md:block md:w-1/2 ${isEven ? "order-1" : "order-3"}`}>
        {((isEven && true) || (!isEven && false)) && (
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            <CardContent milestone={milestone} index={index} />
          </motion.div>
        )}
      </div>

      {/* Timeline node */}
      <div className="order-2 flex flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
          className="w-10 h-10 rounded-full bg-white shadow-pink flex items-center justify-center border-2 border-blush"
        >
          <span className="text-lg">{milestone.emoji}</span>
        </motion.div>
      </div>

      {/* Mobile: always right; Desktop: alternate */}
      <div className={`flex-1 md:w-1/2 ${isEven ? "md:order-3" : "md:order-1"}`}>
        <motion.div
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="block md:hidden"
        >
          <CardContent milestone={milestone} index={index} />
        </motion.div>
        {/* Desktop right side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40, y: 20 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="hidden md:block"
        >
          {((isEven && false) || (!isEven && true)) ? (
            <CardContent milestone={milestone} index={index} />
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function CardContent({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const rotation = index % 2 === 0 ? -2 : 2;

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: 0 }}
      className="sticker-card p-5 sm:p-6 relative overflow-hidden"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Date sticker */}
      <motion.div
        className="inline-block bg-butter/60 px-3 py-1 rounded-full mb-3"
        style={{ transform: `rotate(${-rotation * 1.5}deg)` }}
      >
        <span className="font-body text-xs font-bold text-ink/70">
          {milestone.date}
        </span>
      </motion.div>

      {/* Title */}
      <h3 className="font-handwritten text-2xl text-deep-rose mb-2">
        {milestone.title}
      </h3>

      {/* Story */}
      <p className="font-body text-sm text-ink/70 leading-relaxed mb-4">
        {milestone.story}
      </p>

      {/* Photo placeholder or image */}
      <div className="washi-tape relative">
        <div className="w-full h-40 sm:h-48 rounded-2xl bg-gradient-to-br from-blush/30 to-lavender/30 flex items-center justify-center relative overflow-hidden">
          {milestone.src ? (
            <Image
              src={milestone.src}
              alt={milestone.title}
              fill
              className="object-cover rounded-2xl"
            />
          ) : (
            <span className="font-body text-sm text-ink/30">
              Foto akan di sini 📸
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:py-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center mb-12"
      >
        <h1 className="font-handwritten text-4xl sm:text-5xl text-deep-rose mb-2">
          Cerita Kita 📖
        </h1>
        <p className="font-body text-sm text-ink/50">
          Perjalanan 2 tahun penuh cinta ✨
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto relative">
        {/* Dotted line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 timeline-line transform md:-translate-x-[1.5px]" />

        {/* Floating hearts along the line */}
        {[20, 40, 60, 80].map((top, i) => (
          <motion.div
            key={i}
            className="absolute left-4 md:left-1/2 text-xs z-0"
            style={{ top: `${top}%` }}
            animate={{
              y: [0, -10, 0],
              x: [-8, 8, -8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            💗
          </motion.div>
        ))}

        {/* Milestone cards */}
        <div className="flex flex-col gap-8 sm:gap-12 relative z-10">
          {milestones.map((milestone, i) => (
            <TimelineCard key={milestone.id} milestone={milestone} index={i} />
          ))}
        </div>

        {/* End marker */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex justify-center mt-12"
        >
          <div className="sticker-card px-6 py-4 text-center">
            <span className="text-3xl">💍</span>
            <p className="font-handwritten text-lg text-deep-rose mt-2">
              Dan cerita kita masih berlanjut...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
