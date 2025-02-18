// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '爱声云',
  tagline: '助力开发者构建自然、响应式的实时多模态 AI 交互体验。',
  favicon: 'https://cdn.aishengyun.cn/assets/logo.svg',

  // Set the production url of your site here
  url: 'https://docs.aishengyun.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'aishengyun', // Usually your GitHub org/user name.
  projectName: 'api-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: './sidebars.js',
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Replace with your project's social card
    image: 'https://cdn.aishengyun.cn/assets/logo.svg',
    metadata: [
      {name: 'description', content: '爱声云 TTS API 帮助开发者能够构建自然、响应式的实时多模态AI体验。助力开发者快速实现硬件上的实时语音聊天。'},
      {name: 'keywords', content: '爱声云,TTS,API,响应式,实时,多模态AI,语音聊天'},
      {name: 'publisher', content: '爱声云'},
      {name: 'og:title', content: '爱声云文档'},
      {name: 'og:description', content: '爱声云 TTS API 帮助开发者能够构建自然、响应式的实时多模态AI体验。助力开发者快速实现硬件上的实时语音聊天。'},
      {name: 'og:url', content: 'https://docs.aishengyun.cn'},
      {name: 'og:site_name', content: '爱声云'},
      {name: 'og:image', content: 'https://cdn.aishengyun.cn/assets/logo.svg'},
      {name: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: '爱声云文档'},
      {name: 'twitter:description', content: '爱声云 TTS API 帮助开发者能够构建自然、响应式的实时多模态AI体验。助力开发者快速实现硬件上的实时语音聊天。'},
      {name: 'twitter:image', content: 'https://cdn.aishengyun.cn/assets/logo.svg'},
    ],
    announcementBar: {
      id: 'bonus',
      content:
        '注册爱声云，礼送代金券，<a target="_blank" rel="noopener noreferrer" href="https://console.aishengyun.cn">了解详情</a>',
      backgroundColor: '#086acd',
      textColor: '#fff',
      isCloseable: false,
    },
    docs:{
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      }
    },
    navbar: {
      title: '爱声云',
      logo: {
        alt: '爱声云',
        href: 'https://aishengyun.cn/',
        src: 'https://cdn.aishengyun.cn/assets/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'api',
          label: 'API 文档',
        },
        /*
        {
          type: 'localeDropdown',
          position: 'right',
        },
        */
        {
          href: 'https://console.aishengyun.cn',
          label: '控制台 ',
          target: '_blank',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
      ],
      copyright: `©  2024 - ${new Date().getFullYear()} 爱声云, <a className="text-gray-400" target='_blank' href='https://beian.miit.gov.cn/'>京 ICP 备 19058380 号 -5</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "ruby",
        "csharp",
        "php",
        "java",
        "powershell",
        "json",
        "bash",
        "dart",
        "objectivec",
        "r",
      ],
    },
    languageTabs: [
      {
        highlight: "bash",
        language: "curl",
        logoClass: "curl",
      },
      {
        highlight: "python",
        language: "python",
        logoClass: "python",
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
      },
      {
        highlight: "go",
        language: "go",
        logoClass: "go",
      },
      {
        highlight: "csharp",
        language: "csharp",
        logoClass: "csharp",
      },
      {
        highlight: "php",
        language: "php",
        logoClass: "php",
      },
      {
        highlight: "java",
        language: "java",
        logoClass: "java",
      },
      {
        highlight: "c",
        language: "c",
        logoClass: "c",
      },
      {
        highlight: "rust",
        language: "rust",
        logoClass: "rust",
      },
    ]
  }),
  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          speech: {
            specPath: "api-reference/speech/openapi.yaml",
            outputDir: "docs/api/speech",
            disableCompression: true
          },
          voices: {
            specPath: "api-reference/voices/openapi.yaml",
            outputDir: "docs/api/voices",
          },
          user: {
            specPath: "api-reference/user/openapi.yaml",
            outputDir: "docs/api/user",
          }
        }
      },

    ],
  ],
  themes: [
    "docusaurus-theme-openapi-docs",
    [
      "@easyops-cn/docusaurus-search-local",
      ({
        indexBlog: false,
        indexDocs: true,
        docsRouteBasePath: "/",
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,

        // For Docs using Chinese, it is recomended to set:
        language: ["en", "zh"],

        // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
        forceIgnoreNoIndex: true,
      }),
    ],
  ],
};

export default config;
