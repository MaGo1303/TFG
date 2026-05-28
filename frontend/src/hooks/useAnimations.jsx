import { useEffect, useRef, useState } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.12
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
        const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip';
        const revealElements = document.querySelectorAll(revealSelectors);

        revealElements.forEach(el => observer.observe(el));

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches?.(revealSelectors)) {
                            observer.observe(node);
                        }
                        node.querySelectorAll?.(revealSelectors).forEach(el => {
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

export function useStaggerReveal(selector = '.stagger-item', delay = 50) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const items = entry.target.querySelectorAll(selector);
                        items.forEach((item, i) => {
                            setTimeout(() => {
                                item.classList.add('in');
                            }, i * delay);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        const containers = document.querySelectorAll('[data-stagger]');
        containers.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [selector, delay]);
}
