import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const [hovering, setHovering] = useState(false);
    const posRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const handleMouseMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isInteractive = target.closest('a, button, input, textarea, [role="button"], .service-card, .listing-card, .team-card, .gallery-item, .showcase-arrow, .showcase-dot, .tab, .btn-gold, .btn-ghost, .btn-listing');
            setHovering(!!isInteractive);
        };

        const animate = () => {
            posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12;
            posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12;
            if (cursorRef.current) {
                cursorRef.current.style.left = `${posRef.current.x}px`;
                cursorRef.current.style.top = `${posRef.current.y}px`;
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        const raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} />
            <div ref={dotRef} className="custom-cursor-dot" />
        </>
    );
}
