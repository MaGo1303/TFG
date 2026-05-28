import { useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = '', style = {}, as = 'div' }) {
    const ref = useRef(null);
    const isTouchRef = useRef(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
    const scale = useSpring(1, springConfig);

    const handleTouchStart = useCallback(() => {
        isTouchRef.current = true;
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isTouchRef.current || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
        scale.set(1.02);
    }, [mouseX, mouseY, scale]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
        scale.set(1);
    }, [mouseX, mouseY, scale]);

    const Tag = as;

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                ...style,
                willChange: 'transform',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformPerspective: 1000,
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}
            </motion.div>
        </Tag>
    );
}
