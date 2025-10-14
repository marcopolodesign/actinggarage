import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedMarqueeProps {
  text: string;
  className?: string;
}

const AnimatedMarquee: React.FC<AnimatedMarqueeProps> = ({ text, className = "" }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current && containerRef.current) {
      const marquee = marqueeRef.current;
      const container = containerRef.current;
      
      // Set initial content
      marquee.innerHTML = text;
      
      // Get the width of a single text element
      const textWidth = marquee.scrollWidth;
      const containerWidth = container.clientWidth;
      
      // Calculate how many copies we need for seamless loop
      const copiesNeeded = Math.ceil((containerWidth * 2) / textWidth) + 2;
      
      // Create multiple copies of the text
      const textContent = text.repeat(copiesNeeded);
      marquee.innerHTML = textContent;
      
      // Calculate total width and duration
      const totalWidth = textWidth * copiesNeeded;
      const duration = totalWidth / 50; // Adjust speed by changing divisor (lower = faster)
      
      // Set initial position (start from right)
      gsap.set(marquee, { x: containerWidth });
      
      // Create infinite loop animation from right to left
      const tl = gsap.timeline({ repeat: -1, ease: "none" });
      tl.to(marquee, {
        x: -totalWidth + containerWidth,
        duration: duration,
        ease: "none"
      });
    }
  }, [text]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      style={{ width: '100%' }}
    >
      <div 
        ref={marqueeRef}
        className="inline-block font-druk uppercase text-black"
        style={{ 
          fontSize: 'clamp(2rem, 8vw, 6rem)',
          lineHeight: '1',
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default AnimatedMarquee;
