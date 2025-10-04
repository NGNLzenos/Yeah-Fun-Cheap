document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mainHeader = document.querySelector('.main-header');
    
    if (menuToggle && closeMenu && mainHeader) {
        
        // 開啟選單
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainHeader.classList.add('menu-open');
            document.body.style.overflow = 'hidden'; // 鎖定背景滾動
        });

        // 關閉選單
        closeMenu.addEventListener('click', () => {
            mainHeader.classList.remove('menu-open');
            document.body.style.overflow = ''; // 恢復背景滾動
        });
        
        // 可選：點擊選單外部關閉
        document.addEventListener('click', (e) => {
            // 檢查是否為行動版 (簡單判斷是否有側邊選單開啟標記)
            const isMobile = window.matchMedia("(max-width: 576px)").matches;
            
            if (isMobile && mainHeader.classList.contains('menu-open') && !e.target.closest('.side-menu') && !e.target.closest('.menu-toggle')) {
                mainHeader.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    }
});