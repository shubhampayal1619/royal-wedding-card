// Scratch Canvas Setup
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const scratchCover = document.getElementById('scratchCover');
const weddingCard = document.getElementById('weddingCard');
const confettiContainer = document.getElementById('confettiContainer');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');

let isScratched = false;
let scratchPercentage = 0;

// Initialize Canvas
function initCanvas() {
    canvas.width = scratchCover.offsetWidth;
    canvas.height = scratchCover.offsetHeight;
    
    // Draw scratch cover pattern
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 50, 50);
    }
}

// Scratch Effect
function scratch(e) {
    if (isScratched) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Use destination-out to erase
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate scratched percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) transparent++;
    }
    
    scratchPercentage = (transparent / (data.length / 4)) * 100;
    
    // Reveal card when 40% scratched
    if (scratchPercentage > 40) {
        revealCard();
    }
}

// Touch scratch support
function touchScratch(e) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    scratch(mouseEvent);
}

// Reveal Card with Animation
function revealCard() {
    if (isScratched) return;
    isScratched = true;
    
    // Hide scratch cover
    scratchCover.style.display = 'none';
    
    // Show wedding card
    weddingCard.style.display = 'block';
    
    // Trigger confetti explosion
    createConfettiExplosion();
    
    // Start countdown
    startCountdown();
    
    // Auto-play music
    playMusic();
}

// Confetti Explosion
function createConfettiExplosion() {
    const colors = ['#ffd700', '#ff69b4', '#00bfff', '#ff6347', '#32cd32', '#9370db'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 3 + 2;
        
        confetti.style.cssText = `
            left: ${left}%;
            top: -10px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size}px ${color};
            animation: confettiFall ${duration}s linear ${delay}s forwards;
        `;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

// Countdown Timer
function startCountdown() {
    const weddingDate = new Date('2024-11-27T19:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Music Control
function playMusic() {
    backgroundMusic.play().catch(err => console.log('Auto-play prevented:', err));
    musicToggle.classList.add('playing');
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.classList.add('playing');
    } else {
        backgroundMusic.pause();
        musicToggle.classList.remove('playing');
    }
}

// Event Listeners
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchmove', touchScratch);
musicToggle.addEventListener('click', toggleMusic);

// Blessing Cards Animation
function addBlessingAnimation() {
    const blessingCards = document.querySelectorAll('.blessing-card');
    blessingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
            this.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
            this.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.15)';
        });
    });
}

// Event Card Click Animation
function addEventCardAnimation() {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', function() {
            const event = this.dataset.event;
            showEventDetails(event);
        });
    });
}

// Show Event Details
function showEventDetails(eventType) {
    const eventDetails = {
        haldi: 'Golden moments of joy! Join us for the vibrant Haldi ceremony where tradition meets celebration.',
        sangeet: 'Music and dance fill the air! Celebrate love with songs and performances that will leave you enchanted.',
        wedding: 'Two souls unite in eternal bond! Witness the sacred wedding ceremony that brings two families together.',
        reception: 'Let\'s celebrate! Join us for an evening of food, dance, and joy as we celebrate our beautiful union.'
    };
    
    alert(eventDetails[eventType]);
}

// Initialize on page load
window.addEventListener('load', function() {
    initCanvas();
    addBlessingAnimation();
    addEventCardAnimation();
});

// Handle window resize
window.addEventListener('resize', function() {
    if (!isScratched) {
        initCanvas();
    }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add parallax effect to particles
window.addEventListener('scroll', function() {
    const particles = document.querySelectorAll('.particle');
    let scrollPosition = window.pageYOffset;
    
    particles.forEach((particle, index) => {
        particle.style.transform = `translateY(${scrollPosition * (index + 1) * 0.05}px)`;
    });
});

// Premium animations for countdown items
const countdownItems = document.querySelectorAll('.countdown-item');
setInterval(() => {
    countdownItems.forEach(item => {
        const value = item.querySelector('.countdown-value');
        if (value && Math.random() > 0.7) {
            value.style.color = '#ff1493';
            setTimeout(() => {
                value.style.color = '#d4af37';
            }, 200);
        }
    });
}, 1000);

// Blessing cards shimmer effect
function addShimmerEffect() {
    const blessingCards = document.querySelectorAll('.blessing-card');
    blessingCards.forEach(card => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer-${Math.random().toString(36).substr(2, 9)} {
                0%, 100% { background: white; }
                50% { background: linear-gradient(90deg, white 0%, #fffacd 50%, white 100%); }
            }
        `;
        document.head.appendChild(style);
    });
}

// Adaptive confetti based on screen size
function createConfettiExplosionAdaptive() {
    const screenWidth = window.innerWidth;
    let confettiCount = 100;
    
    if (screenWidth < 768) {
        confettiCount = 50;
    }
    if (screenWidth < 480) {
        confettiCount = 30;
    }
    
    const colors = ['#ffd700', '#ff69b4', '#00bfff', '#ff6347', '#32cd32', '#9370db'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 3 + 2;
        
        confetti.style.cssText = `
            left: ${left}%;
            top: -10px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size}px ${color};
            animation: confettiFall ${duration}s linear ${delay}s forwards;
        `;
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

// Override original function
const originalCreateConfetti = createConfettiExplosion;
createConfettiExplosion = createConfettiExplosionAdaptive;

// Add luxury glow effect on hover for entire card
if (weddingCard) {
    weddingCard.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 30px 80px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
    });
    
    weddingCard.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
    });
}

// Loading animation for blessing messages
function animateBlessingMessages() {
    const messages = document.querySelectorAll('.blessing-card p');
    messages.forEach((msg, index) => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            msg.style.transition = 'all 0.6s ease-out';
            msg.style.opacity = '1';
            msg.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Call on card reveal
const originalRevealCard = revealCard;
revealCard = function() {
    originalRevealCard.call(this);
    setTimeout(() => {
        animateBlessingMessages();
        addShimmerEffect();
    }, 500);
};

console.log('✨ Royal Wedding Card Loaded Successfully! ✨');
