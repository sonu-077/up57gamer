document.addEventListener('DOMContentLoaded', () => {
    // --- 1. HERO IMAGE SLIDER ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        
        // Change slide every 4 seconds
        setInterval(nextSlide, 4000);
    }
    // --- 2. PRIZE POOL CALCULATOR ---
    const collectionInput = document.getElementById('totalCollection');
    const firstPrizeEl = document.getElementById('firstPrize');
    const secondPrizeEl = document.getElementById('secondPrize');
    const thirdPrizeEl = document.getElementById('thirdPrize');

    // Format currency
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    function calculatePrizes() {
        // Get value, default to 0 if invalid
        let amount = parseFloat(collectionInput.value) || 0;
        
        let p1 = amount * 0.60;
        let p2 = amount * 0.20;
        let p3 = amount * 0.10;
        
        firstPrizeEl.innerText = formatter.format(p1);
        secondPrizeEl.innerText = formatter.format(p2);
        if (thirdPrizeEl) thirdPrizeEl.innerText = formatter.format(p3);

        // Add small pop animation on calculate
        let elements = [firstPrizeEl, secondPrizeEl, thirdPrizeEl].filter(Boolean);
        elements.forEach(el => {
            el.parentElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                el.parentElement.style.transform = '';
            }, 150);
        });
    }

    if (collectionInput) {
        collectionInput.addEventListener('input', calculatePrizes);
    }

    // Initial calculation with placeholder value if needed
    // collectionInput.value = 10000;
    // calculatePrizes();

    // --- 3. NAVBAR SCROLL EFFECT ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(11, 12, 16, 0.9)';
            header.style.borderBottom = '1px solid var(--neon-blue-dim)';
        } else {
            header.style.background = 'var(--glass-bg)';
            header.style.borderBottom = 'none';
        }
    });

    // --- 4. COPY UPI ID ---
    const copyUpiBtn = document.getElementById('copyUpiBtn');
    const upiText = document.getElementById('upiText');
    
    if (copyUpiBtn && upiText) {
        copyUpiBtn.addEventListener('click', () => {
            const textToCopy = upiText.innerText;

            // Fallback for mobile/local HTTP networks without HTTPS
            const fallbackCopy = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed"; // Avoid scrolling to bottom
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                let success = false;
                try {
                    success = document.execCommand('copy');
                } catch (err) {}
                
                document.body.removeChild(textArea);
                
                return success ? Promise.resolve() : Promise.reject(new Error('Fallback copy failed'));
            };

            const copyPromise = (navigator.clipboard && window.isSecureContext) 
                ? navigator.clipboard.writeText(textToCopy) 
                : fallbackCopy(textToCopy);

            copyPromise.then(() => {
                const icon = copyUpiBtn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                copyUpiBtn.classList.add('copied');
                
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                    copyUpiBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Copy failed, please copy manually: ' + textToCopy);
            });
        });
    }
    // --- 5. COUNTDOWN TIMER ---
    const targetDate = new Date("2026-04-12T00:00:00").getTime();
    
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days < 10 ? "0" + days : days;
            hoursEl.innerText = hours < 10 ? "0" + hours : hours;
            minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
