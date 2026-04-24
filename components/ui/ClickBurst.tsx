import { useEffect } from "react";

/**
 * Click anywhere on the page to spawn animated sparks that burst outward.
 * Sparks fade out and disappear after animation completes.
 */
export default function ClickBurst() {
  useEffect(() => {
    const SPARK_COUNT = 12;
    const ANIMATION_DURATION = 600;

    // Inject CSS animation if not already present
    if (!document.getElementById("click-burst-styles")) {
      const style = document.createElement("style");
      style.id = "click-burst-styles";
      style.textContent = `
        @keyframes spark-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty));
          }
        }
        
        .spark {
          position: fixed;
          pointer-events: none;
          width: 4px;
          height: 4px;
          background: currentColor;
          border-radius: 50%;
          animation: spark-burst ${ANIMATION_DURATION}ms ease-out forwards;
          will-change: transform, opacity;
        }
      `;
      document.head.appendChild(style);
    }

    const onClick = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      // Create sparks in all directions
      for (let i = 0; i < SPARK_COUNT; i++) {
        const spark = document.createElement("div");
        spark.className = "spark";

        // Random angle and distance for each spark
        const angle = (Math.random() * Math.PI * 2);
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        // Set CSS variables for the animation
        spark.style.setProperty("--tx", `${tx}px`);
        spark.style.setProperty("--ty", `${ty}px`);
        spark.style.left = `${clientX}px`;
        spark.style.top = `${clientY}px`;
        spark.style.color = `hsl(${Math.random() * 360}, 100%, 60%)`;

        document.body.appendChild(spark);

        // Remove spark after animation completes
        setTimeout(() => {
          spark.remove();
        }, ANIMATION_DURATION);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null; // no visible UI; this just wires up the effect
}