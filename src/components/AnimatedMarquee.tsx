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
      
      // Get the width of the text content
      const textWidth = marquee.scrollWidth;
      const containerWidth = container.clientWidth;
      
      // Calculate how many copies we need to fill the screen + some buffer
      const copiesNeeded = Math.ceil((containerWidth * 2) / textWidth) + 2;
      
      // Create multiple copies of the text for seamless looping
      const textContent = text.repeat(copiesNeeded);
      marquee.innerHTML = textContent;
      
      // Set up the animation
      const totalWidth = textWidth * copiesNeeded;
      const duration = totalWidth / 50; // Adjust speed by changing divisor (lower = faster)
      
      // Create infinite loop animation
      const tl = gsap.timeline({ repeat: -1, ease: "none" });
      tl.fromTo(marquee, 
        { x: containerWidth }, 
        { x: -totalWidth + containerWidth, duration: duration }
      );
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
