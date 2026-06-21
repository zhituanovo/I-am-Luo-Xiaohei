/**
 * Header模块加载器
 * 用于在所有页面动态加载统一的header模块
 */

class HeaderLoader {
    constructor() {
        this.headerPath = '../components/header.html';
        this.containerId = 'header-container';
    }
    
    async loadHeader() {
        try {
            const response = await fetch(this.headerPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const headerHTML = await response.text();
            
            // 查找header容器
            let container = document.getElementById(this.containerId);
            if (!container) {
                // 如果没有找到容器，创建一个新的header元素
                container = document.createElement('div');
                container.id = this.containerId;
                document.body.insertBefore(container, document.body.firstChild);
            }
            
            container.innerHTML = headerHTML;

            // 小屏幕：绑定移动菜单开关
            const mobileBtn = container.querySelector('#mobile-menu-btn');
            const mobileNav = container.querySelector('#mobile-nav');
            if (mobileBtn && mobileNav) {
                const closeMobileMenu = () => {
                    mobileNav.classList.remove('open');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                    mobileNav.setAttribute('aria-hidden', 'true');
                };

                mobileBtn.addEventListener('click', () => {
                    const opened = mobileNav.classList.toggle('open');
                    mobileBtn.setAttribute('aria-expanded', opened);
                    mobileNav.setAttribute('aria-hidden', !opened);
                });
                // 点击移动端链接后自动关闭菜单
                mobileNav.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        closeMobileMenu();
                    });
                });
                // 初始化时关闭移动菜单，避免桌面或切换时残留
                closeMobileMenu();
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768) {
                        closeMobileMenu();
                    }
                });
            }

            // 设置当前页面高亮（支持桌面和移动菜单）
            this.setActiveNav();

            console.log('Header模块加载成功');
        } catch (error) {
            console.error('加载header模块失败:', error);
        }
    }

    /**
     * 设置当前页面导航高亮
     */
    setActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '/' && currentPath === '/') {
                if (link.parentElement) link.parentElement.classList.add('current-nav');
            } else if (href !== '/' && currentPath.includes(href.replace('../', '').replace('pages/', ''))) {
                if (link.parentElement) link.parentElement.classList.add('current-nav');
            }
        });
    }

    /**
     * 初始化header加载器
     */
    static init() {
        const loader = new HeaderLoader();
        
        // 如果DOM已加载完成，立即加载header
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => loader.loadHeader());
        } else {
            loader.loadHeader();
        }
        
        return loader;
    }
}

// 导出供全局使用
window.HeaderLoader = HeaderLoader;