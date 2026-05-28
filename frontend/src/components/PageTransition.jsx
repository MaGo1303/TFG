import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 12,
        filter: 'blur(4px)',
    },
    enter: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: 'blur(3px)',
        transition: {
            duration: 0.2,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

export default function PageTransition({ children }) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
