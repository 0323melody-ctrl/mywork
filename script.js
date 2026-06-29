document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. 客製化閃爍星芒游標
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .art-card, .cute-sticker-btn, .nav-item-sticker').forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('active'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    /* ==========================================================================
       2. 導覽列貼紙按鈕高級平滑慢進滾動
       ========================================================================== */
    const navButtons = document.querySelectorAll('.nav-item-sticker');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ==========================================================================
       3. 滾動淡入流暢度控制 (Intersection Observer API)
       ========================================================================== */
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const sectionObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);

    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       4. 信封開場翻開動態（已完美加入 pointerEvents 穿透修復）
       ========================================================================== */
    const openBtn = document.getElementById('open-btn');
    const envelopeContainer = document.getElementById('envelope-container');
    const mainSite = document.getElementById('main-site');

    if (openBtn && envelopeContainer && mainSite) {
        openBtn.addEventListener('click', () => {
            envelopeContainer.classList.add('open');
            
            setTimeout(() => {
                envelopeContainer.classList.add('fade-out');
                mainSite.classList.remove('hidden');
                
                // 這裡幫你補上了穿透點擊，信封開了之後按鈕才點得到
                envelopeContainer.style.pointerEvents = 'none'; 
                
                setTimeout(() => {
                    envelopeContainer.style.display = 'none';
                }, 600);
            }, 1000);
        });
    }

    /* ==========================================================================
       5. 繪本作品翻頁控制（images/ 資料夾 ＋ 圖片自動串接修正版）
       ========================================================================== */
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const leftPage = document.getElementById('left-page');
    const rightPage = document.getElementById('right-page');
    const pageIndicator = document.getElementById('page-indicator');

    let currentBookState = 0; 
    const maxStates = 12; // 👈 如果繪本不含封面封底是24頁，這裡維持 12。如果是 16 頁，請改成 8

    function updateBookUI() {
        leftPage.style.opacity = '0.3';
        rightPage.style.opacity = '0.3';
        leftPage.style.transform = 'rotateY(15deg)';
        rightPage.style.transform = 'rotateY(-15deg)';
        
        setTimeout(() => {
            // 狀態 0：顯示封面與第 1 頁
            if (currentBookState === 0) {
                leftPage.innerHTML = `<img src="images/book-cover.jpg" alt="封面" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                rightPage.innerHTML = `<img src="images/book-p1.jpg" alt="第1頁" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                pageIndicator.innerText = "封面 / 第 1 頁";
            } 
            // 最終狀態：顯示最後一頁與封底
            else if (currentBookState === maxStates) {
                let pLeft = currentBookState * 2;
                leftPage.innerHTML = `<img src="images/book-p${pLeft}.jpg" alt="第${pLeft}頁" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                rightPage.innerHTML = `<img src="images/book-back.jpg" alt="封底" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                pageIndicator.innerText = `第 ${pLeft} 頁 / 封底`;
            } 
            // 中間頁數：自動計算頁碼
            else {
                let pLeft = currentBookState * 2;
                let pRight = pLeft + 1;
                leftPage.innerHTML = `<img src="images/book-p${pLeft}.jpg" alt="第${pLeft}頁" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                rightPage.innerHTML = `<img src="images/book-p${pRight}.jpg" alt="第${pRight}頁" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                pageIndicator.innerText = `第 ${pLeft} 頁 / 第 ${pRight} 頁`;
            }
            
            leftPage.style.opacity = '1';
            rightPage.style.opacity = '1';
            leftPage.style.transform = 'none';
            rightPage.style.transform = 'none';
        }, 180);
    }

    if (prevPageBtn && nextPageBtn && leftPage && rightPage && pageIndicator) {
        leftPage.style.transition = 'all 0.2s ease-out';
        rightPage.style.transition = 'all 0.2s ease-out';

        nextPageBtn.addEventListener('click', () => {
            if (currentBookState < maxStates) {
                currentBookState++;
                updateBookUI();
            }
        });

        prevPageBtn.addEventListener('click', () => {
            if (currentBookState > 0) {
                currentBookState--;
                updateBookUI();
            }
        });
    }
}); // 
