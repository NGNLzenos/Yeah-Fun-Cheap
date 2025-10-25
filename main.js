import './assets/scss/all.scss';
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
console.log('Hello world');


// main.js

// 引入 Bootstrap 的 JS
import 'bootstrap';

// 全局變數用於儲存主要文章區塊和標題
let mainContentSections = [];
let progressNavLinks = [];
let progressBarFill;
let articleContentSection;

// 初始化 AOS 庫
const initAOS = () => {
    AOS.init({
        duration: 800, // 動畫持續時間 (毫秒)
        easing: 'ease-out-quad', // 動畫緩動函數
        once: true, // 動畫只播放一次
        offset: 120, // 觸發動畫前，元素距離視窗底部的距離 (像素)
    });
};

// 生成文章目錄導覽
const generateTableOfContents = () => {
    const navList = document.querySelector('#article-progress-nav ul');
    if (!navList) return; // 如果導覽容器不存在，則不執行

    mainContentSections = document.querySelectorAll('.article-content-section section[id^="section-"]'); // 選擇所有帶有 id="section-X" 的 section

    mainContentSections.forEach(section => {
        const title = section.querySelector('.section-title').textContent;
        const id = section.id;

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = title;
        link.classList.add('scroll-link'); // 添加 class 方便事件監聽

        listItem.appendChild(link);
        navList.appendChild(listItem);
    });

    progressNavLinks = document.querySelectorAll('#article-progress-nav .scroll-link');
};

// 更新閱讀進度條和活躍連結
const updateReadProgress = () => {
    if (!articleContentSection || !progressBarFill || mainContentSections.length === 0) return;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 計算整體閱讀進度
    const totalScrollableHeight = docHeight - viewportHeight;
    let progress = 0;
    if (totalScrollableHeight > 0) {
        progress = (scrollY / totalScrollableHeight) * 100;
        if (progress > 100) progress = 100; // 防止超過100%
    }
    progressBarFill.style.width = `${progress}%`;

    // 判斷當前活躍的章節
    let activeSectionId = '';
    for (let i = mainContentSections.length - 1; i >= 0; i--) {
        const section = mainContentSections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // 當章節頂部進入視窗的 1/3 或底部還在視窗內時，視為活躍
        // 調整這個閾值可以改變活躍狀態的敏感度
        if (scrollY >= sectionTop - viewportHeight / 3 && scrollY < sectionTop + sectionHeight - viewportHeight / 3) {
            activeSectionId = section.id;
            break;
        }
    }

    // 更新導覽列的 active 狀態
    progressNavLinks.forEach(link => {
        if (link.href.includes(activeSectionId) && activeSectionId !== '') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// 處理平滑滾動
const handleSmoothScroll = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        // 使用 window.scrollTo 結合 behavior: 'smooth' 實現平滑滾動
        // 考慮到 sticky header/nav bar 的高度，可能需要調整滾動位置
        const headerOffset = 70; // 假設 header 高度為 70px, 需要根據實際情況調整
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};


document.addEventListener('DOMContentLoaded', () => {
    initAOS(); // 初始化 AOS

    progressBarFill = document.querySelector('.progress-bar-fill');
    articleContentSection = document.querySelector('.article-content-section');

    generateTableOfContents(); // 生成文章目錄
    updateReadProgress(); // 初始載入時更新一次進度

    // 監聽滾動事件
    window.addEventListener('scroll', () => {
        updateReadProgress();
    });

    // 監聽導覽連結的點擊事件，實現平滑滾動
    progressNavLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // 處理頁面resize，可能影響進度計算
    window.addEventListener('resize', () => {
        updateReadProgress();
    });

    // 為 Accordion 設置默認展開第一個項目
    const firstAccordionButton = document.querySelector('#equipmentAccordion .accordion-button');
    if (firstAccordionButton) {
        // 檢查它是否已經是 collapsed 狀態
        if (firstAccordionButton.classList.contains('collapsed')) {
            firstAccordionButton.click(); // 模擬點擊，展開第一個
        }
    }
});

// 獲取導航欄和按鈕
const toggleBtn = document.getElementById('toggle-nav');
const nav = document.getElementById('article-progress-nav');
const contentSection = document.querySelector('.article-content-section');

// 當按鈕被點擊時，切換導航欄的顯示/隱藏
toggleBtn.addEventListener('click', () => {
    // 切換隱藏類別
    nav.classList.toggle('hidden');
    contentSection.classList.toggle('nav-hidden');
});
// 建議：整個檔案都放在 DOMContentLoaded 後再跑
document.addEventListener('DOMContentLoaded', () => {
    // 如果你想完全交給 Bootstrap 的 data-bs-* 來切換：
    // 什麼都不用寫，刪掉你原本對 .navbar-toggler 的 addEventListener。

    // 如果你硬要用 JS 自己控制，再這樣寫：
    const toggler = document.querySelector('.navbar-toggler');
    const target = document.querySelector('#navbarNav');

    if (toggler && target && window.bootstrap?.Collapse) {
        const bsCollapse = new bootstrap.Collapse(target, { toggle: false });
        toggler.addEventListener('click', () => bsCollapse.toggle());
    } else {
        // 在沒有 navbar 的頁面不要報錯
        console.debug('[navbar] skip binding: toggler/target not found or bootstrap missing');
    }
});