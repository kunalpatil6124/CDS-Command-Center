
    // Default configuration
    const defaultConfig = {
      hero_title: 'CDS Preparation Dashboard',
      hero_subtitle: 'Train Like an Officer – Practice, Analyze, Improve',
      footer_tagline: 'Prepare Smart. Serve the Nation.',
      background_color: '#1A1A1A',
      surface_color: '#2D2D2D',
      accent_color: '#4A5D23',
      text_color: '#FFFFFF',
      secondary_text_color: '#9CA3AF'
    };

    let config = { ...defaultConfig };

    // Navigation function
    function navigateTo(page) {
      // Hide all pages
      document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
      
      // Show target page
      const targetPage = document.getElementById(`page-${page}`);
      if (targetPage) {
        targetPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Close mobile menu
      document.getElementById('mobile-menu').classList.add('hidden');
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    }

    // Element SDK integration
    async function onConfigChange(newConfig) {
      config = { ...defaultConfig, ...newConfig };
      
      // Update hero title
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) heroTitle.textContent = config.hero_title || defaultConfig.hero_title;
      
      // Update hero subtitle
      const heroSubtitle = document.getElementById('hero-subtitle');
      if (heroSubtitle) heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
      
      // Update footer tagline
      const footerTagline = document.getElementById('footer-tagline');
      if (footerTagline) footerTagline.textContent = config.footer_tagline || defaultConfig.footer_tagline;
    }

    function mapToCapabilities(config) {
      return {
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.accent_color || defaultConfig.accent_color,
            set: (value) => {
              config.accent_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ accent_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              if (window.elementSdk) window.elementSdk.setConfig({ text_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      };
    }

    function mapToEditPanelValues(config) {
      return new Map([
        ['hero_title', config.hero_title || defaultConfig.hero_title],
        ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
        ['footer_tagline', config.footer_tagline || defaultConfig.footer_tagline]
      ]);
    }

    // Initialize Element SDK
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }
 (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9db346e6b21642ed',t:'MTc3MzMyMzUyMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})()