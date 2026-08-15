"use client"

import { motion, useScroll, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Recoloured from the shipped purple-pink-orange to the one accent, and
        // lifted above the floating navbar rather than sharing its layer.
        "fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-[#2563EB] via-[#3B82F6] to-[#93C5FD]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
