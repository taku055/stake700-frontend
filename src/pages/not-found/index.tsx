import { useEffect, useRef, useState } from "preact/hooks";
import { motion } from "framer-motion";
import { Link } from "@/components/common";
import styles from "./NotFound.module.scss";
import {
  EYE_CONFIG,
  DOLL_ANIMATION,
  SVG_VIEWBOX,
  TEXT_CONTENT,
  TRANSITIONS,
  COLORS,
} from "./data";

export default function NotFound404() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dollSvgRef = useRef<SVGSVGElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Smooth interpolation function (lerp)
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setEyePosition(prev => {
        const newX = lerp(prev.x, targetPositionRef.current.x, EYE_CONFIG.lerpFactor);
        const newY = lerp(prev.y, targetPositionRef.current.y, EYE_CONFIG.lerpFactor);
        
        // Continue animation loop continuously for smooth movement
        animationFrameRef.current = requestAnimationFrame(animate);
        
        return { x: newX, y: newY };
      });
    };

    // Start continuous animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Track mouse movement for eye following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dollSvg = dollSvgRef.current;
      
      if (dollSvg) {
        const svgPoint = dollSvg.createSVGPoint();
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        const ctm = dollSvg.getScreenCTM();
        
        if (ctm) {
          const svgCoordinates = svgPoint.matrixTransform(ctm.inverse());
          
          // Calculate relative position from eye center
          const relativeX = svgCoordinates.x - EYE_CONFIG.centerX;
          const relativeY = svgCoordinates.y - EYE_CONFIG.centerY;
          
          // Calculate distance and constrain to circle
          const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY) / EYE_CONFIG.distanceDivisor;
          const constrainedDistance = Math.min(distance, EYE_CONFIG.maxRadius);
          
          // Calculate angle
          const angle = Math.atan2(relativeY, relativeX);
          
          // Calculate final circular position (target)
          const eyeX = Math.cos(angle) * constrainedDistance;
          const eyeY = Math.sin(angle) * constrainedDistance;
          
          // Update target position (animation loop will smoothly interpolate)
          targetPositionRef.current = { x: eyeX, y: eyeY };
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.content}>
        {/* Large 404 text in background */}
        <div className={styles.fourZeroFour}>{TEXT_CONTENT.errorCode}</div>

        {/* Alien/Doll SVG with animations */}
        <motion.div
          className={styles.dollContainer}
          animate={{
            y: DOLL_ANIMATION.floatingRange,
          }}
          transition={{
            duration: DOLL_ANIMATION.duration,
            repeat: Infinity,
            ease: DOLL_ANIMATION.ease,
          }}
        >
          <svg
            ref={dollSvgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={SVG_VIEWBOX.doll}
            className={styles.dollSvg}
          >
            <g id="Layer_3" data-name="Layer 3">
              <path
                fill="#2d4454"
                d="M275.92,220.92,265.62,210c5.41-5.12,19.28-21,18.47-32.9-.26-3.85-2.14-6.91-5.91-9.62l8.75-12.18c7.38,5.3,11.57,12.5,12.13,20.82C300.46,197.13,278.43,218.55,275.92,220.92Z"
              />
              <path
                fill="#2d4454"
                d="M258.45,176.9s21.77,13.39,23.16,41.3c.58,11.49-60.71,84.85-71.66,84.29s-45.32-37.41-45.32-37.41Z"
              />
              <path
                fill="#597182"
                d="M126.08,88.18S89,85,88.88,48.8c0,0,2.57-9.46-4.44-8.66-4.36.49-.87,3.24-5.29-3.23s-20.21-2.13-24,11.2C42.38,93.57,80,125.88,112.38,137,125.67,141.6,126.08,88.18,126.08,88.18Z"
              />
              <path
                fill="#597182"
                d="M245.55,59.19a3.13,3.13,0,0,0,1.85.81l17.13,1.49a3.14,3.14,0,0,0,3-4.71l-6-10.29L275.2,47a3.14,3.14,0,1,0,.21-6.28L256.09,40a3.14,3.14,0,0,0-2.82,4.72l5.78,10-11.1-1a3.14,3.14,0,0,0-3.41,2.86A3.18,3.18,0,0,0,245.55,59.19Z"
              />
              <circle
                className="cls-3"
                fill="#597182"
                cx="277.17"
                cy="44.09"
                r="5.91"
              />
              <path
                fill="#597182"
                d="M135.75,63.27S174,3.69,186.58.19,199,42.63,199,42.63,158.1,73.15,135.75,63.27Z"
              />
              <path
                fill="#597182"
                d="M276.41,171.25s48.48-64.65,49.31-81.14-55,.63-55,.63S258.37,162.56,276.41,171.25Z"
              />
              <path
                fill="#597182"
                d="M89.47,138.53s-36.24-31.14-78.74,10.81c-25.42,25.08-.26,63.28,19.57,70.83s31.94-6.71,55.71,3c30.59,12.53,65.8-15.81,65.8-15.81Z"
              />
              <path
                style={{ opacity: 0.2 }}
                fill="#2d4454"
                d="M14.26,161.27C3.36,164.09.35,171.46.51,180.66l.05.35c3,17.89,17.4,34.46,29.74,39.16a34.55,34.55,0,0,0,8.21,2c3.8-.81,6.69-3.57,7.75-9.41C50.73,188.25,28.77,158.48,14.26,161.27Z"
              />
              <rect
                fill="#2d4454"
                x="21.82"
                y="159.9"
                width="2"
                height="25.25"
                transform="translate(-138.48 107.19) rotate(-60.41)"
              />
              <rect
                fill="#2d4454"
                x="21.63"
                y="164.76"
                width="2"
                height="37.11"
                transform="translate(-146.9 110.01) rotate(-59.58)"
              />
              <rect
                fill="#2d4454"
                x="23.49"
                y="174.49"
                width="2"
                height="38.68"
                transform="translate(-155.59 118.07) rotate(-59.98)"
              />
              <rect
                fill="#2d4454"
                x="23.87"
                y="188.37"
                width="2"
                height="31.57"
                transform="translate(-165.36 125.98) rotate(-60.72)"
              />
              <rect
                fill="#2d4454"
                x="25.17"
                y="202.8"
                width="2"
                height="19.64"
                transform="translate(-175.09 139.23) rotate(-62.95)"
              />
              <rect
                fill="#597182"
                x="55.43"
                y="62.02"
                width="244.93"
                height="186.88"
                rx="93.44"
                transform="translate(-50.31 216.6) rotate(-56.15)"
              />
              <path
                fill="#597182"
                d="M127.29,208.15s-51.15,8.93-66.7,45.12c-14.1,32.81,30.7,48.65,51.9,49.21s35.75-27,61.4-25.68c33,1.7,49-26.6,49-26.6Z"
              />
              <path
                style={{ opacity: 0.2 }}
                fill="#2d4454"
                d="M209.33,214.29s3.91,21.21-6.42,33.21-25.11,3.92-29.58,14c-2.06,4.63-1.44,10.4.61,15.35,33,1.65,49-26.61,49-26.61h0a94,94,0,0,0,16.4-18.58l8-12,.5-2.87Z"
              />
              <g style={{ opacity: 0.2 }}>
                <path
                  fill="#2d4454"
                  d="M233.76,89.23a39.9,39.9,0,0,1-2.95,17.11,31.09,31.09,0,0,0,10.52-25.15c-.78-16.7-13.83-29.65-29.15-28.93a25.25,25.25,0,0,0-7.69,1.58C220.37,56.53,232.91,71.1,233.76,89.23Z"
                />
              </g>
              <path
                fill="#1b2c38"
                d="M154.53,134.22s16.19,11.17,17,19.77c1.07,11.55,18.16-8.56-.09-24-20.9-17.7-28.69-11.35-32.92-5.05C135.12,130,144.15,125.27,154.53,134.22Z"
              />
              <path
                fill="#597182"
                d="M154.27,110.93l-3.91,4.88a4.16,4.16,0,0,0,0,5.17c.18.24.38.45.57.69a2.69,2.69,0,0,1,3.56-.18,2.71,2.71,0,0,1,.42,3.81,3,3,0,0,1-.49.46,73,73,0,0,0,23.66,17.5,4.16,4.16,0,0,0,5-1.16l3.95-4.92A72,72,0,0,1,154.27,110.93Z"
              />
              <g style={{ opacity: 0.2 }}>
                <circle fill="#2d4454" cx="190.62" cy="91.46" r="33.96" />
              </g>
              {/* Eye container - the outer circle */}
              <circle fill={COLORS.eyeOuter} cx="195.17" cy="89.47" r="33.96" />
              <circle fill={COLORS.eyeBackground} cx={EYE_CONFIG.centerX} cy={EYE_CONFIG.centerY} r="30.73" />
              {/* Small static pupil */}
              <circle
                fill={COLORS.doll}
                cx={EYE_CONFIG.smallPupilPosition.x}
                cy={EYE_CONFIG.smallPupilPosition.y}
                r={EYE_CONFIG.smallPupilRadius}
              />
              {/* Big moving pupil - follows mouse */}
              <circle
                fill={COLORS.doll}
                cx={EYE_CONFIG.centerX + eyePosition.x}
                cy={EYE_CONFIG.centerY + eyePosition.y}
                r={EYE_CONFIG.bigPupilRadius}
              />
              <path
                fill="#597182"
                d="M254.61,173.83s21.61,61.39,2.57,95.44-41.93,23.44-48.07,18.42,0-14.79-1.39-15.91-9.09-9.87,5.78-14.84-7.18-44.32-7.18-44.32S228.63,164.34,254.61,173.83Z"
              />
            </g>
          </svg>
        </motion.div>

        {/* Decorative elements */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={SVG_VIEWBOX.decorative}
          className={styles.decorativeSvg}
        >
          <g id="Layer_3" data-name="Layer 3">
            <circle fill="#2d4454" cx="658.2" cy="350.72" r="57.11" />
            <path
              fill="#2d4454"
              d="M697.39,309.17a57.49,57.49,0,0,1,4.77,5.08c20.78-4.36,30.51-1.52,32.5,2.57,2.25,4.62-3.2,13.75-14.23,23.81-12.38,11.31-30.52,23-51.06,33s-41,17-57.51,19.79c-14.72,2.47-25.27,1.13-27.52-3.5-2-4.09,1.78-13.5,18-27.16a55.68,55.68,0,0,1-1.06-6.89C576.21,376,576.46,387.48,579,392.58c8.11,16.68,54,5.48,93-13.52s76.18-48.19,68.06-64.87C737.57,309.09,728.71,301.81,697.39,309.17Z"
            />
            <path
              fill="#2d4454"
              d="M133.19,278.42A109.9,109.9,0,0,0,102.37,202a15.42,15.42,0,0,1,2-4.68s-6.92-7.58-7.79-6.49c-.49.61-2.7,1.28-4.53,1.76a110.12,110.12,0,0,0-29.88-17.22C46.83,184.26,24.37,202.92,13.32,239c-17.75,58,13.84,93.9,0,127.66A58.81,58.81,0,0,1,0,386.39,110.41,110.41,0,0,0,97.19,360l2.07,1.22a4.16,4.16,0,0,0,5-.63c3.6-3.58,10.23-10.27,10.7-11.37s-1.22-4.57-2.33-6.72A109.77,109.77,0,0,0,133.19,278.42ZM114,281c.34-4.35,2-7.77,3.68-7.64s2.8,3.76,2.46,8.11-2,7.77-3.67,7.64S113.71,285.38,114,281ZM41.23,343.35c-2.24.63-4.36.1-4.72-1.18s1.16-2.84,3.41-3.48,4.36-.11,4.73,1.18S43.48,342.71,41.23,343.35Zm7.49-67.22c-3.34-.25-5.77-4-5.44-8.33s3.31-7.67,6.64-7.42,5.78,4,5.44,8.34S52.06,276.39,48.72,276.13ZM63.94,344c5.76-2.77,9.13,2.36,9.09,4A15.12,15.12,0,0,0,63.94,344Zm10.6-129.43a10,10,0,0,0,6.42.36C81,215.68,76.34,217.92,74.54,214.55Zm14.12,132c-5.84,3.94-11.83,5.3-13.36,3s1.94-7.32,7.79-11.27,11.82-5.3,13.36-3S94.5,342.64,88.66,346.59Zm4.52-103c-3.49-5.17,1.2-7.3,2-7A8.31,8.31,0,0,0,93.18,243.62ZM95.94,333c-1.15,0-5.13-4.65-1.51-9.37A16.29,16.29,0,0,0,95.94,333Zm1.63-97.75c-2.38,1.38-7.17-2.46-10.7-8.56s-4.45-12.17-2.07-13.55,7.17,2.46,10.69,8.57S100,233.86,97.57,235.23Z"
            />
            <circle fill="#2d4454" cx="588.58" cy="130.12" r="4.75" />
            <circle fill="#2d4454" cx="723.94" cy="105.04" r="12.57" />
            <circle fill="#2d4454" cx="639.74" cy="198.32" r="4.12" />
            <circle fill="#2d4454" cx="263.37" cy="383.4" r="4.12" />
            <path
              fill="#2d4454"
              d="M94.49,106.42c-.61.68-.33,1.92.62,2.78s2.23,1,2.84.32.33-1.93-.63-2.79S95.1,105.73,94.49,106.42Z"
            />
            <path
              fill="#2d4454"
              d="M86.37,99.76c-1.1-.34-2.38.64-2.85,2.18s0,3.06,1.13,3.4,2.37-.64,2.85-2.18S87.46,100.09,86.37,99.76Z"
            />
            <path
              fill="#2d4454"
              d="M165.25,39.29S139,46,122.84,59.85l2.57-11.57S56.86,87.83,75.79,115C91.83,138,145,99.67,147,89l-12.3-.31S162,54.52,165.25,39.29ZM96,117.72c-2.87.2-4.93-3-6-3.56s-3.59,1.63-5.75.71-5.65-8.05-6.06-10.8,4.42-6.28,4.42-6.28-2.26-5.7-1.23-6.92S95.74,91.08,97.8,93s.2,5.59,0,7.62,6.46,7.12,6.66,8.65S98.82,117.52,96,117.72Z"
            />
            <path
              fill="#2d4454"
              d="M191.55,42.14s-22.82,11.49-19.16,16.62C176.85,65,191.55,42.14,191.55,42.14Z"
            />
            <path
              fill="#2d4454"
              d="M189.23,0S159.8,15.61,163.46,20.74C167.92,27,189.23,0,189.23,0Z"
            />
          </g>
        </svg>

        {/* Text content */}
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TRANSITIONS.textContent.delay, duration: TRANSITIONS.textContent.duration }}
        >
          <h1 className={styles.title}>
            {TEXT_CONTENT.title}
          </h1>
          <p className={styles.description}>
            {TEXT_CONTENT.description.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < TEXT_CONTENT.description.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>

          <Link href="/" scrollToTop className={styles.button}>
            {TEXT_CONTENT.buttonText}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}