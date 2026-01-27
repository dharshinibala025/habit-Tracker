export const triggerConfetti = () => {
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        // Start from center-ish
        particle.style.left = '50%';
        particle.style.top = '20%';
        particle.style.zIndex = '9999';
        particle.style.pointerEvents = 'none';
        particle.style.borderRadius = '50%';

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 5;
        const tx = Math.cos(angle) * velocity * 20; // Spread x
        const ty = Math.sin(angle) * velocity * 20 + 200; // Fall down

        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: Math.random() * 200
        });

        animation.onfinish = () => particle.remove();
    }
};
