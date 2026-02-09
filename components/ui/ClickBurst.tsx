import { useEffect } from "react";

/**
 * Click anywhere on the page to spawn a temporary <ul> with 8 <li> "sparks"
 * positioned and animated by CSS. Removed after 250ms.
 */
export default function ClickBurst() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      let ul = document.createElement("ul");
      ul.className = "click-burst";
      
      // Absolutely position at the mouse and center the UL on that point
      ul.style.position = "absolute";
      ul.style.left = `${event.pageX}px`;
      ul.style.top = `${event.pageY}px`;
      ul.style.transform = "translate(-50%, -50%)";

      // Size of the effect area (tweak as you like)
      ul.style.width = "3em";
      ul.style.height = "1.5em";

      // Housekeeping
      ul.style.listStyle = "none";
      ul.style.padding = "0";
      ul.style.margin = "0";           // no margin hacks needed
      ul.style.pointerEvents = "none"; // don't block clicks
      ul.style.zIndex = "9999";        // on top of everything


      // 8 radial “spark” lines (li elements)
      for (let i = 1; i <= 8; i++) {
        let li = document.createElement("li");
        ul.appendChild(li);
      }

      document.body.appendChild(ul);

      // Remove after 250ms (matches animation duration)
      setTimeout(() => {
        ul.remove();
      }, 250);
    };

    document.body.addEventListener("click", onClick);
    return () => document.body.removeEventListener("click", onClick);
  }, []);

  return null; // no visible UI; this just wires up the effect
}