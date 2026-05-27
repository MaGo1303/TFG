import { useEffect, useRef, useState } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        revealElements.forEach(el => observer.observe(el));

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches?.('.reveal, .reveal-left, .reveal-right, .reveal-scale')) {
                            observer.observe(node);
                        }
                        node.querySelectorAll?.('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                            observer.observe(el);
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
}

export function useTextReveal(options = {}) {
    const { threshold = 0.2, delay = 0, stagger = 40 } = options;
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !revealed) {
                    setRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, revealed]);

    const splitText = (text) => {
        if (!revealed) return <span style={{ opacity: 0 }}>{text}</span>;
        return text.split('').map((char, i) => (
            <span
                key={i}
                className="split-char"
                style={{
                    animationDelay: `${delay + i * stagger}ms`,
                    display: 'inline-block',
                    minWidth: char === ' ' ? '0.3em' : undefined,
                }}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    return { ref, revealed, splitText };
}

export function useParallax(speed = 0.3) {
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = elementCenter - windowHeight / 2;
            setOffset(distanceFromCenter * speed);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { ref, offset };
}

export function useCountUp(target, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    observer.disconnect();

                    const startTime = performance.now();
                    const step = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { ref, count };
}
