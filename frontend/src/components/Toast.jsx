import { useRef, useCallback } from 'react';

export default function Toast({ message, type = 'success', exiting, onDismiss }) {
    const dragRef = useRef({ startX: 0, currentX: 0, dragging: false });
    const elRef = useRef(null);

    const handlePointerDown = useCallback((e) => {
        dragRef.current = { startX: e.clientX, currentX: 0, dragging: true, startTime: Date.now() };
        e.target.setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e) => {
        if (!dragRef.current.dragging) return;
        const dx = e.clientX - dragRef.current.startX;
        dragRef.current.currentX = dx;
        if (elRef.current) {
            elRef.current.style.transform = `translateX(${dx}px)`;
            elRef.current.style.opacity = Math.max(0, 1 - Math.abs(dx) / 200);
        }
    }, []);

    const handlePointerUp = useCallback(() => {
        if (!dragRef.current.dragging) return;
        const elapsed = Date.now() - dragRef.current.startTime;
        const velocity = Math.abs(dragRef.current.currentX) / elapsed;
        if (Math.abs(dragRef.current.currentX) > 100 || velocity > 0.11) {
            onDismiss();
        } else if (elRef.current) {
            elRef.current.style.transform = 'translateX(0)';
            elRef.current.style.opacity = '1';
        }
        dragRef.current.dragging = false;
    }, [onDismiss]);

    const icon = type === 'success'
        ? 'fa-solid fa-circle-check'
        : type === 'error'
            ? 'fa-solid fa-circle-xmark'
            : 'fa-solid fa-circle-info';

    const bg = type === 'success' ? '#1b4a32' : type === 'error' ? '#4a1b1b' : '#1b2e4a';
    const iconColor = type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa';

    return (
        <div
            ref={elRef}
            className={`toast ${exiting ? 'toast-exit' : 'toast-enter'}`}
            style={{ background: bg }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="alert"
        >
            <i className={icon} style={{ color: iconColor }}></i>
            <span>{message}</span>
            <button className="toast-close" onClick={onDismiss} aria-label="Cerrar">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
