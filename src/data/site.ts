export type Lang = 'en' | 'zh';

export const defaultLang: Lang = 'en';

export const paths = {
	en: {
		home: '/',
		pipeline: '/#pipeline',
		data: '/#data',
		methods: '/#methods',
		blog: '/blog/',
		downloads: '/downloads/',
		about: '/about/',
		rss: '/rss.xml',
	},
	zh: {
		home: '/zh/',
		pipeline: '/zh/#pipeline',
		data: '/zh/#data',
		methods: '/zh/#methods',
		blog: '/zh/blog/',
		downloads: '/zh/downloads/',
		about: '/zh/about/',
		rss: '/rss.xml',
	},
} as const;

export const site = {
	en: {
		langCode: 'en',
		locale: 'en_US',
		title: 'GRACE L2 Notes',
		description:
			'Notes on GRACE and GRACE-FO Level-2 processing, filtering, gridded EWH products, and reproducible pipeline practice.',
		nav: {
			home: 'Home',
			pipeline: 'Pipeline',
			data: 'Data',
			methods: 'Methods',
			blog: 'Blog',
			downloads: 'Downloads',
			about: 'About',
			menu: 'Menu',
			switch: '简体中文',
		},
		footer: {
			summary: 'Processing notes, filter comparisons, and reproducible workflow records.',
			sections: 'Sections',
			resources: 'Resources',
			rss: 'RSS Feed',
			releases: 'GitHub Releases',
			domain: 'myair.info',
		},
		home: {
			eyebrow: 'Satellite Gravity Field',
			title: 'GRACE Level-2 Processing Workflow',
			subtitle: 'From GSM spherical harmonics to gridded EWH products',
			text:
				'Technical notes and reproducible workflow records for transforming GRACE and GRACE-FO Level-2 spherical harmonic solutions into physically consistent equivalent water height products.',
			primaryAction: 'Explore pipeline',
			secondaryAction: 'Browse articles',
			stats: [
				['Level-2', 'GSM spherical harmonics'],
				['EWH', 'gridded product target'],
				['HSAF', 'Hankel filtering notes'],
			],
			pipelineTitle: 'Processing Pipeline',
			pipelineLead: 'A traceable path from monthly gravity-field coefficients to validated products.',
			pipelineSteps: [
				['Acquire', 'GRACE/GRACE-FO Level-2 GSM spherical harmonic coefficients'],
				['Correct', 'Low-degree replacement, GIA correction, and mean-field removal'],
				['Filter', 'De-striping, Gaussian/Fan/DDK routing, and HSAF experiments'],
				['Synthesize', 'Convert spherical harmonics to gridded EWH anomalies'],
				['Validate', 'Preview, basin averages, trends, and diagnostic products'],
			],
			dataTitle: 'Data Products',
			dataLead: 'Keep data products explicit, versioned, and auditable.',
			dataCards: [
				{
					title: 'Gridded EWH',
					text: 'Monthly equivalent-water-height anomalies on controlled grids with product metadata and diagnostics.',
					linkText: 'Read preview note',
					href: '/blog/third-post/',
				},
				{
					title: 'Mascon comparison',
					text: 'Independent products for checking spatial patterns, basin averages, and long-term behavior.',
					linkText: 'Read workflow note',
					href: '/blog/first-post/',
				},
			],
			methodTitle: 'Method Notes',
			methodLead: 'A compact record of each filter family and its routing contract.',
			methodCards: [
				{
					title: 'HSAF',
					text: 'Hankel-spectrum filtering for stripe suppression and signal preservation.',
				},
				{
					title: 'Gaussian / Fan / DDK',
					text: 'Baseline filter families for reproducible comparison and controlled product tags.',
				},
			],
			recentTitle: 'Recent Articles',
			recentLead: 'Latest notes from the processing log.',
			allArticles: 'All articles',
			releaseTitle: 'Software releases',
			releaseText:
				'Distribute installers through GitHub Releases and keep this site focused on documentation, notes, and verified download entry points.',
			releaseAction: 'Open downloads',
			quote: 'Good processing is transparent, testable, and reproducible.',
			quoteSub: 'Workflow first, results follow.',
		},
		blog: {
			eyebrow: 'Blog',
			title: 'Processing notes',
			lead:
				'Short records on GRACE Level-2 data flow, filtering choices, runtime behavior, and output validation.',
			featured: 'Featured note',
			latest: 'Latest notes',
			read: 'Read article',
			minutes: 'min read',
			asideTitle: 'About this blog',
			asideText:
				'The notes are written as an engineering record for a GRACE/GRACE-FO Level-2 workflow: what each product means, where it comes from, and how it should be checked.',
			tagsTitle: 'Topics',
			resourcesTitle: 'Resources',
		},
		about: {
			title: 'About GRACE L2 Notes',
			description: 'A technical notebook for GRACE and GRACE-FO Level-2 processing practice.',
			paragraphs: [
				'GRACE L2 Notes is a working blog for a GRACE/GRACE-FO Level-2 processing workspace. It focuses on reproducible runs, filter-product comparisons, output conventions, and the gap between saved scientific data and preview rendering.',
				'The underlying project maintains MATLAB and Python implementations side by side. Both paths are expected to follow the same JSON configuration, data layout, product tags, and output metadata so local GUI runs and HPC submissions can be compared without changing the science contract.',
				'The main topics are spherical-harmonic inversion, low-degree replacement, GIA options, Gaussian smoothing, P4M6 de-striping, FAN filtering, DDK routing, HSAF experiments, EWH stack layout, and preview quality control.',
			],
		},
		downloads: {
			eyebrow: 'Software',
			title: 'Downloads',
			lead:
				'Stable installers and packaged releases should be distributed through GitHub Releases. The website can link to release assets without storing large binary files inside the static site repository.',
			cardTitle: 'GRACE Level-2 Processing Software',
			cardText:
				'Publish each installer as a versioned release asset, then keep this page pointed to the latest stable release or to a specific verified version.',
			button: 'Open GitHub Releases',
			notes: [
				{
					title: 'Recommended distribution rule',
					items: [
						'Use GitHub Releases for .exe, .msi, .zip, or installer packages.',
						'Keep the website repository focused on source code, pages, and small static assets.',
						'Use semantic version labels such as v0.1.0, v0.2.0, or v1.0.0.',
					],
				},
				{
					title: 'Before publishing',
					items: [
						'Record the version, release date, supported Windows version, and checksum.',
						'State whether the package is an installer, portable build, or source archive.',
						'Test the download link after GitHub Pages finishes deployment.',
					],
				},
			],
		},
	},
	zh: {
		langCode: 'zh-CN',
		locale: 'zh_CN',
		title: 'GRACE L2 Notes',
		description: 'GRACE 与 GRACE-FO Level-2 数据处理、滤波、等效水高产品与可复现流程记录。',
		nav: {
			home: '首页',
			pipeline: '流程',
			data: '数据',
			methods: '方法',
			blog: '博客',
			downloads: '下载',
			about: '关于',
			menu: '菜单',
			switch: 'English',
		},
		footer: {
			summary: 'GRACE 二级数据处理记录、滤波方法对比与可复现流程说明。',
			sections: '站点栏目',
			resources: '相关资源',
			rss: 'RSS 订阅',
			releases: 'GitHub Releases',
			domain: 'myair.info',
		},
		home: {
			eyebrow: '卫星时变重力场',
			title: 'GRACE Level-2 数据处理流程',
			subtitle: '从 GSM 球谐系数到格网等效水高产品',
			text:
				'本网站用于记录 GRACE 与 GRACE-FO Level-2 球谐解到等效水高产品的处理流程、滤波方法、产品路由与质量控制经验。',
			primaryAction: '查看处理流程',
			secondaryAction: '浏览博客文章',
			stats: [
				['Level-2', 'GSM 球谐系数'],
				['EWH', '等效水高格网产品'],
				['HSAF', 'Hankel 滤波记录'],
			],
			pipelineTitle: '处理流程',
			pipelineLead: '从月尺度重力场系数到可验证产品的可追溯链条。',
			pipelineSteps: [
				['获取', 'GRACE/GRACE-FO Level-2 GSM 球谐系数'],
				['改正', '低阶项替换、GIA 改正与均值场扣除'],
				['滤波', '去相关、Gaussian/Fan/DDK 路由与 HSAF 试验'],
				['合成', '由球谐系数合成格网等效水高异常'],
				['验证', '预览、流域平均、趋势估计与诊断产品'],
			],
			dataTitle: '数据产品',
			dataLead: '数据产品应具有明确命名、版本和可审计路径。',
			dataCards: [
				{
					title: '格网 EWH',
					text: '带有产品元数据和诊断信息的月尺度等效水高异常格网。',
					linkText: '查看预览说明',
					href: '/zh/blog/third-post/',
				},
				{
					title: 'Mascon 对比',
					text: '用于检查空间形态、流域序列和长期变化的独立参考产品。',
					linkText: '查看流程说明',
					href: '/zh/blog/first-post/',
				},
			],
			methodTitle: '方法记录',
			methodLead: '记录不同滤波方法及其产品路由约束。',
			methodCards: [
				{
					title: 'HSAF',
					text: '用于条带噪声抑制与信号保持的 Hankel 谱分析滤波方法。',
				},
				{
					title: 'Gaussian / Fan / DDK',
					text: '用于可复现实验对比和产品标识管理的基准滤波族。',
				},
			],
			recentTitle: '最新文章',
			recentLead: '来自处理流程记录的近期笔记。',
			allArticles: '全部文章',
			releaseTitle: '软件发布',
			releaseText: '安装包建议通过 GitHub Releases 分发，网站仅保留文档说明、版本信息和可靠下载入口。',
			releaseAction: '打开下载页',
			quote: '可靠的数据处理必须透明、可测试、可复现。',
			quoteSub: '先规范流程，再讨论结果。',
		},
		blog: {
			eyebrow: '博客',
			title: '处理笔记',
			lead: '记录 GRACE Level-2 数据流、滤波选择、运行行为和输出验证。',
			featured: '精选文章',
			latest: '最新笔记',
			read: '阅读全文',
			minutes: '分钟阅读',
			asideTitle: '关于本博客',
			asideText:
				'这些文章不是泛泛的科普记录，而是 GRACE/GRACE-FO Level-2 工作流的工程化记录：每个产品代表什么、从哪里来、应该如何检查。',
			tagsTitle: '主题',
			resourcesTitle: '资源',
		},
		about: {
			title: '关于 GRACE L2 Notes',
			description: '面向 GRACE 与 GRACE-FO Level-2 数据处理实践的技术笔记网站。',
			paragraphs: [
				'GRACE L2 Notes 是一个面向 GRACE/GRACE-FO Level-2 数据处理工作区的技术博客，重点记录可复现运行、滤波产品对比、输出约定，以及科学数据保存与预览渲染之间的边界。',
				'底层项目同时维护 MATLAB 与 Python 实现。两条路径应遵循同一套 JSON 配置、数据目录、产品标识和输出元数据，使本地 GUI 运行与高性能计算提交可以在不改变科学约定的前提下进行对比。',
				'主要主题包括球谐反演、低阶项替换、GIA 选项、Gaussian 平滑、P4M6 去相关、Fan 滤波、DDK 路由、HSAF 试验、EWH 栈结构和预览质量控制。',
			],
		},
		downloads: {
			eyebrow: '软件',
			title: '下载',
			lead: '稳定安装包和打包版本建议通过 GitHub Releases 分发。网站负责提供说明和入口，不应把大型二进制文件长期放入静态网页仓库。',
			cardTitle: 'GRACE Level-2 数据处理软件',
			cardText: '每个安装包应作为带版本号的 Release Asset 发布，本页面指向最新稳定版本或指定验证版本。',
			button: '打开 GitHub Releases',
			notes: [
				{
					title: '推荐分发规则',
					items: [
						'使用 GitHub Releases 分发 .exe、.msi、.zip 或安装包。',
						'网页仓库只保留源码、页面和小型静态资源。',
						'采用 v0.1.0、v0.2.0、v1.0.0 等语义化版本标签。',
					],
				},
				{
					title: '发布前检查',
					items: [
						'记录版本、发布日期、支持的 Windows 版本和校验值。',
						'说明该文件是安装版、便携版还是源码包。',
						'GitHub Pages 部署完成后检查下载入口是否可正常打开。',
					],
				},
			],
		},
	},
} as const;

export function getBlogPath(lang: Lang, slug: string) {
	return lang === 'zh' ? `/zh/blog/${slug}/` : `/blog/${slug}/`;
}

export function getAlternatePath(lang: Lang, route: keyof typeof paths.en, slug?: string) {
	if (slug) return lang === 'zh' ? `/blog/${slug}/` : `/zh/blog/${slug}/`;
	return lang === 'zh' ? paths.en[route] : paths.zh[route];
}
