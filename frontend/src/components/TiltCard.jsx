import { useRef, useCallback } from 'react';

export default function TiltCard({ children, className = '', style = {}, as = 'div' }) {
    const ref = useRef(null);
    const isTouchRef = useRef(false);

    const handleTouchStart = useCallback(() => {
        isTouchRef.current = true;
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isTouchRef.current || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }, []);

    const Tag = as;

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                ...style,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                willChange: 'transform'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
        >
            {children}
        </Tag>
    );
}
