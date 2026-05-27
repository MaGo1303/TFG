import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(() => children);
    const [stage, setStage] = useState('enter');
    const prevPath = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname === prevPath.current) return;
        prevPath.current = location.pathname;

        setStage('exit');

        const snapshot = children;

        const timeout = setTimeout(() => {
            setDisplayChildren(snapshot);
            requestAnimationFrame(() => {
                setStage('enter');
            });
        }, 280);

        return () => clearTimeout(timeout);
    }, [location.pathname, children]);

    return (
        <div className={`page-transition page-${stage}`}>
            {displayChildren}
        </div>
    );
}
