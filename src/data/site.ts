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
			search: 'Search',
			theme: 'Toggle theme',
			switch: '简体中文',
		},
		footer: {
			summary: 'Processing notes, filter comparisons, and reproducible workflow records.',
			developerLabel: 'Developer information',
			developerZh: '华中科技大学 国家精密重力测量科学中心 固体地球物理组开发',
			developerEn: 'Huazhong University of Science and Technology, National Gravity Laboratory, Solid Geophysics',
			address: 'Address: 1037 Luoyu Road, Hongshan District, Wuhan, Hubei, China',
			copyright: 'GRACE L2 Notes. Developed by HUST National Gravity Laboratory, Solid Geophysics.',
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
				['Acquire', 'Collect monthly Level-2 GSM Stokes coefficients and product metadata.'],
				['Preprocess', 'Apply low-degree replacement, GIA correction, background-field alignment, and anomaly baseline removal.'],
				['Filter', 'Route de-striping, spatial smoothing, DDK, and HSAF products through explicit product tags.'],
				['Synthesize', 'Transform corrected spherical harmonics into gridded equivalent water height anomalies.'],
				['Validate', 'Check maps, basin averages, leakage correction, trends, and independent product consistency.'],
			],
			pipelineDetailIntro: 'Click any processing node to inspect the scientific contract behind the step.',
			pipelineDetails: [
				{
					principle:
						'Input should be treated as a Level-2 gravity-field solution, usually monthly GSM spherical harmonic coefficients. The product name, processing center, release, maximum degree/order, time stamp, missing month flag, and reference frame must remain explicit.',
					formula: 'S(θ, λ, t) = {ΔCₗₘ(t), ΔSₗₘ(t)}, 0 ≤ m ≤ l ≤ lmax',
					formulaHtml: '<math display=\"block\"><mi>S</mi><mo>(</mo><mi>θ</mi><mo>,</mo><mi>λ</mi><mo>,</mo><mi>t</mi><mo>)</mo><mo>=</mo><mo>{</mo><mi>ΔC</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>,</mo><mi>ΔS</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>}</mo><mo>,</mo><mn>0</mn><mo>≤</mo><mi>m</mi><mo>≤</mo><mi>l</mi><mo>≤</mo><msub><mi>l</mi><mtext>max</mtext></msub></math>',
					config: [['product', 'HUST-Grace2024 / CSR RL06 / GFZ RL06 / JPL RL06'], ['max_degree', '60'], ['monthly_solution', 'true']],
					checks: ['Verify the product release and lmax.', 'Preserve the month identifier before any interpolation.', 'Keep the raw input immutable.'],
				},
				{
					principle:
						'Preprocessing converts monthly coefficients into a consistent anomaly field. Typical operations include degree-1 geocenter replacement, C20/C30 replacement using SLR, GIA correction, optional destriping preconditions, and subtraction of a stated mean field.',
					formula: 'ΔCₗₘ′ = ΔCₗₘ − ΔCₗₘ,mean − ΔCₗₘ,GIA',
					formulaHtml: '<math display=\"block\"><msup><mi>ΔC</mi><mo>′</mo></msup><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>=</mo><mi>ΔC</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>−</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi><mo>,</mo><mtext>mean</mtext></mrow></msub><mo>−</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi><mo>,</mo><mtext>GIA</mtext></mrow></msub></math>',
					config: [['replace_degree1', 'true'], ['replace_c20_c30', 'SLR'], ['gia_model', 'ICE-6G_D'], ['baseline', '2004-01..2009-12']],
					checks: ['State the baseline period.', 'Record all replacement products.', 'Never mix corrected and uncorrected products under one tag.'],
				},
				{
					principle:
						'Filtering reduces correlated north-south striping and random high-degree noise while preserving physically interpretable mass signals. Gaussian, Fan, PnMm decorrelation, DDK, and HSAF should be routed as separate products rather than overwritten arrays.',
					formula: 'x̂ = F{x}; F ∈ {Gaussian(r), Fan(r), PnMm, DDKk, HSAF}',
					formulaHtml: '<math display=\"block\"><mover><mi>x</mi><mo>^</mo></mover><mo>=</mo><mi>F</mi><mo>{</mo><mi>x</mi><mo>}</mo><mo>,</mo><mspace width=\"0.5em\"/><mi>F</mi><mo>∈</mo><mo>{</mo><mtext>Gaussian</mtext><mo>,</mo><mtext>Fan</mtext><mo>,</mo><mtext>PnMm</mtext><mo>,</mo><mtext>DDK</mtext><mo>,</mo><mtext>HSAF</mtext><mo>}</mo></math>',
					config: [['GAUSS_300', 'Gaussian smoothing, 300 km radius'], ['FAN_300_P3M6', 'Fan filter with P3M6 decorrelation'], ['DDK4', 'anisotropic regularization product'], ['HSAF', 'Hankel spectrum analysis filtering']],
					checks: ['Save every filter result with a unique tag.', 'Record all radii and polynomial parameters.', 'Compare signal loss, residual stripes, and leakage behavior.'],
				},
				{
					principle:
						'Spherical harmonic synthesis converts corrected coefficients into equivalent water height. The Love-number correction, Earth radius, water density, grid resolution, land/ocean mask, and units must be consistent across products.',
					formula: 'EWH(θ,λ) = aρₑ/(3ρw) ΣₗΣₘ ((2l+1)/(1+kₗ)) P̄ₗₘ(ΔCₗₘ cos mλ + ΔSₗₘ sin mλ)',
					formulaHtml: '<math display=\"block\"><mtext>EWH</mtext><mo>(</mo><mi>θ</mi><mo>,</mo><mi>λ</mi><mo>)</mo><mo>=</mo><mfrac><mrow><mi>a</mi><msub><mi>ρ</mi><mi>e</mi></msub></mrow><mrow><mn>3</mn><msub><mi>ρ</mi><mi>w</mi></msub></mrow></mfrac><msubsup><mo>Σ</mo><mi>l</mi><msub><mi>l</mi><mtext>max</mtext></msub></msubsup><munderover><mo>Σ</mo><mrow><mi>m</mi><mo>=</mo><mn>0</mn></mrow><mi>l</mi></munderover><mfrac><mrow><mn>2</mn><mi>l</mi><mo>+</mo><mn>1</mn></mrow><mrow><mn>1</mn><mo>+</mo><msub><mi>k</mi><mi>l</mi></msub></mrow></mfrac><msub><mover><mi>P</mi><mo>¯</mo></mover><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mi>cos</mi><mi>mλ</mi><mo>+</mo><msub><mi>ΔS</mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mi>sin</mi><mi>mλ</mi><mo>)</mo></math>',
					config: [['output_unit', 'cmEWH'], ['grid', '1deg or 0.5deg'], ['love_numbers', 'Wahr / Farrell'], ['lmax', '60']],
					checks: ['Confirm cmEWH/mmEWH units.', 'Use one grid convention for comparisons.', 'Keep masks and coastline buffers versioned.'],
				},
				{
					principle:
						'Validation should combine visual quality control with quantitative diagnostics. Basin-mean time series, annual amplitude, trend, leakage-corrected regional products, Mascon comparison, hydrology models, and altimetry are separate evidence layers.',
					formula: 'TWSA_basin(t) = Σᵢ Aᵢ · EWHᵢ(t) / Σᵢ Aᵢ',
					formulaHtml: '<math display=\"block\"><msub><mtext>TWSA</mtext><mtext>basin</mtext></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo><mfrac><mrow><msub><mo>Σ</mo><mi>i</mi></msub><msub><mi>A</mi><mi>i</mi></msub><mo>·</mo><msub><mtext>EWH</mtext><mi>i</mi></msub><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mrow><msub><mo>Σ</mo><mi>i</mi></msub><msub><mi>A</mi><mi>i</mi></msub></mrow></mfrac></math>',
					config: [['diagnostics', 'map_preview, basin_mean, annual_amp, trend, rmse'], ['references', 'CSR_Mascon, GLDAS, Hydroweb']],
					checks: ['Review maps before statistics.', 'Report leakage/scaling assumptions.', 'Compare against at least one independent product when possible.'],
				}
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
		search: {
			placeholder: 'Search pages, methods, and notes...',
			empty: 'No matching result.',
			openLabel: 'Search site',
			closeLabel: 'Close search',
			items: [
				{ title: 'Processing pipeline', text: 'Acquire, preprocess, filter, synthesize, validate.', href: '/#pipeline' },
				{ title: 'Data products', text: 'Gridded EWH, Mascon comparison, metadata, diagnostics.', href: '/#data' },
				{ title: 'Method notes', text: 'HSAF, Gaussian, Fan, DDK, PnMm decorrelation.', href: '/#methods' },
				{ title: 'Blog', text: 'Processing notes and reproducible workflow records.', href: '/blog/' },
				{ title: 'Downloads', text: 'Installer release entry and GitHub Releases guidance.', href: '/downloads/' },
				{ title: 'About', text: 'Project scope and GRACE Level-2 workflow context.', href: '/about/' },
			],
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
				'GRACE Level-2 Processing Software is packaged for local GRACE/GRACE-FO spherical-harmonic processing, filtering experiments, basin analysis, and preview quality control.',
			versionLabel: 'GRACE L2 Processing Software',
			cardTitle: 'Installer and release package',
			cardText:
				'The program provides a desktop-oriented workflow for Level-2 data preparation, Gaussian/Fan/DDK/HSAF filtering, EWH product synthesis, basin statistics, and result preview. Stable packages are distributed through GitHub Releases.',
			button: 'Open download page',
			releaseHint: 'Release assets are hosted outside the static site repository.',
			meta: [
				['Platform', 'Windows desktop'],
				['Scenario', 'GRACE/GRACE-FO Level-2 workflow'],
				['Package', 'Installer or portable archive'],
				['Status', 'Versioned release'],
			],
			features: [
				{ title: 'Data preparation', text: 'Organize monthly GSM coefficients, low-degree replacement products, GIA settings, baseline periods, and processing metadata.' },
				{ title: 'Filtering workflow', text: 'Run and compare Gaussian smoothing, Fan filtering, PnMm decorrelation, DDK products, and HSAF experiments through explicit product tags.' },
				{ title: 'Product output', text: 'Generate gridded equivalent water height products, basin-mean time series, preview maps, and diagnostic outputs for quality control.' },
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
			search: '搜索',
			theme: '切换主题',
			switch: 'English',
		},
		footer: {
			summary: 'GRACE 二级数据处理记录、滤波方法对比与可复现流程说明。',
			developerLabel: '开发者信息',
			developerZh: '华中科技大学 国家精密重力测量科学中心 固体地球物理组开发',
			developerEn: 'Huazhong University of Science and Technology, National Gravity Laboratory, Solid Geophysics',
			address: '地址：武汉市洪山区珞喻路 1037 号',
			copyright: 'GRACE L2 Notes. 华中科技大学国家精密重力测量科学中心固体地球物理组。',
			sections: '站点栏目',
			resources: '相关资源',
			rss: 'RSS 订阅',
			releases: 'GitHub Releases',
			domain: 'myair.info',
		},
		home: {
			eyebrow: '卫星时变重力场',
			title: 'GRACE Level‑2 数据处理流程',
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
				['获取', '获取月尺度 Level-2 GSM Stokes 系数及其产品元数据。'],
				['预处理', '完成低阶项替换、GIA 改正、背景场统一和异常基准扣除。'],
				['滤波', '将去相关、空间平滑、DDK 与 HSAF 作为独立产品路由。'],
				['合成', '将改正后的球谐系数转换为格网等效水高异常。'],
				['验证', '检查图像预览、流域平均、泄漏校正、趋势和独立产品一致性。'],
			],
			pipelineDetailIntro: '点击任一处理节点，可展开查看该步骤对应的科学处理约定。',
			pipelineDetails: [
				{
					principle:
						'输入应被明确视作 Level-2 重力场解，通常为月尺度 GSM 球谐系数。产品名称、处理中心、版本、最高阶次、时间标识、缺失月份和参考框架必须完整保留。',
					formula: 'S(θ, λ, t) = {ΔCₗₘ(t), ΔSₗₘ(t)}, 0 ≤ m ≤ l ≤ lmax',
					formulaHtml: '<math display=\"block\"><mi>S</mi><mo>(</mo><mi>θ</mi><mo>,</mo><mi>λ</mi><mo>,</mo><mi>t</mi><mo>)</mo><mo>=</mo><mo>{</mo><mi>ΔC</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>,</mo><mi>ΔS</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>}</mo><mo>,</mo><mn>0</mn><mo>≤</mo><mi>m</mi><mo>≤</mo><mi>l</mi><mo>≤</mo><msub><mi>l</mi><mtext>max</mtext></msub></math>',
					config: [['产品', 'HUST-Grace2024 / CSR RL06 / GFZ RL06 / JPL RL06'], ['最高阶次', '60'], ['月度解', 'true']],
					checks: ['核对产品版本和最高阶次。', '任何插值前保留原始月份标识。', '原始输入文件不应被覆盖修改。'],
				},
				{
					principle:
						'预处理用于将月尺度系数统一为可比较的异常场。典型操作包括一阶项地心改正、C20/C30 SLR 替换、GIA 改正、必要的去相关前置处理，以及扣除明确基准期的平均场。',
					formula: 'ΔCₗₘ′ = ΔCₗₘ − ΔCₗₘ,mean − ΔCₗₘ,GIA',
					formulaHtml: '<math display=\"block\"><msup><mi>ΔC</mi><mo>′</mo></msup><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>=</mo><mi>ΔC</mi><msub><mi></mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>−</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi><mo>,</mo><mtext>mean</mtext></mrow></msub><mo>−</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi><mo>,</mo><mtext>GIA</mtext></mrow></msub></math>',
					config: [['一阶项替换', 'true'], ['C20/C30', 'SLR'], ['GIA 模型', 'ICE-6G_D'], ['基准期', '2004-01..2009-12']],
					checks: ['明确基准期。', '记录所有替换产品来源。', '不要把已改正和未改正结果混用同一产品标识。'],
				},
				{
					principle:
						'滤波用于削弱南北条带相关噪声和高阶随机噪声，同时尽可能保持真实地表质量信号。Gaussian、Fan、PnMm 去相关、DDK 和 HSAF 应保存为不同产品，而不是互相覆盖。',
					formula: 'x̂ = F{x}; F ∈ {Gaussian(r), Fan(r), PnMm, DDKk, HSAF}',
					formulaHtml: '<math display=\"block\"><mover><mi>x</mi><mo>^</mo></mover><mo>=</mo><mi>F</mi><mo>{</mo><mi>x</mi><mo>}</mo><mo>,</mo><mspace width=\"0.5em\"/><mi>F</mi><mo>∈</mo><mo>{</mo><mtext>Gaussian</mtext><mo>,</mo><mtext>Fan</mtext><mo>,</mo><mtext>PnMm</mtext><mo>,</mo><mtext>DDK</mtext><mo>,</mo><mtext>HSAF</mtext><mo>}</mo></math>',
					config: [['GAUSS_300', '300 km Gaussian 平滑'], ['FAN_300_P3M6', 'Fan 滤波结合 P3M6 去相关'], ['DDK4', '各向异性正则化产品'], ['HSAF', 'Hankel 谱分析滤波']],
					checks: ['每个滤波结果必须有唯一产品标签。', '记录滤波半径、多项式阶数和起始阶次。', '比较信号损失、残余条带和泄漏误差。'],
				},
				{
					principle:
						'球谐合成将改正后的系数转换为等效水高。负荷 Love 数、地球半径、水密度、格网分辨率、掩膜和单位必须在不同产品之间保持一致。',
					formula: 'EWH(θ,λ) = aρₑ/(3ρw) ΣₗΣₘ ((2l+1)/(1+kₗ)) P̄ₗₘ(ΔCₗₘ cos mλ + ΔSₗₘ sin mλ)',
					formulaHtml: '<math display=\"block\"><mtext>EWH</mtext><mo>(</mo><mi>θ</mi><mo>,</mo><mi>λ</mi><mo>)</mo><mo>=</mo><mfrac><mrow><mi>a</mi><msub><mi>ρ</mi><mi>e</mi></msub></mrow><mrow><mn>3</mn><msub><mi>ρ</mi><mi>w</mi></msub></mrow></mfrac><msubsup><mo>Σ</mo><mi>l</mi><msub><mi>l</mi><mtext>max</mtext></msub></msubsup><munderover><mo>Σ</mo><mrow><mi>m</mi><mo>=</mo><mn>0</mn></mrow><mi>l</mi></munderover><mfrac><mrow><mn>2</mn><mi>l</mi><mo>+</mo><mn>1</mn></mrow><mrow><mn>1</mn><mo>+</mo><msub><mi>k</mi><mi>l</mi></msub></mrow></mfrac><msub><mover><mi>P</mi><mo>¯</mo></mover><mrow><mi>l</mi><mi>m</mi></mrow></msub><mo>(</mo><msub><mi>ΔC</mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mi>cos</mi><mi>mλ</mi><mo>+</mo><msub><mi>ΔS</mi><mrow><mi>l</mi><mi>m</mi></mrow></msub><mi>sin</mi><mi>mλ</mi><mo>)</mo></math>',
					config: [['输出单位', 'cmEWH'], ['格网', '1deg 或 0.5deg'], ['Love 数', 'Wahr / Farrell'], ['最高阶次', '60']],
					checks: ['确认 cmEWH/mmEWH 单位。', '对比实验使用同一格网约定。', '掩膜和海岸缓冲区设置需要版本化。'],
				},
				{
					principle:
						'验证应同时包含图像质量控制和定量诊断。流域平均时间序列、年振幅、趋势、泄漏校正、Mascon 对比、水文模型和测高资料是不同层级的证据。',
					formula: 'TWSA_basin(t) = Σᵢ Aᵢ · EWHᵢ(t) / Σᵢ Aᵢ',
					formulaHtml: '<math display=\"block\"><msub><mtext>TWSA</mtext><mtext>basin</mtext></msub><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo><mfrac><mrow><msub><mo>Σ</mo><mi>i</mi></msub><msub><mi>A</mi><mi>i</mi></msub><mo>·</mo><msub><mtext>EWH</mtext><mi>i</mi></msub><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mrow><msub><mo>Σ</mo><mi>i</mi></msub><msub><mi>A</mi><mi>i</mi></msub></mrow></mfrac></math>',
					config: [['诊断项', 'map_preview, basin_mean, annual_amp, trend, rmse'], ['参考数据', 'CSR_Mascon, GLDAS, Hydroweb']],
					checks: ['先检查图像，再进行统计。', '报告泄漏校正和尺度因子假设。', '尽量引入至少一种独立产品进行对照。'],
				}
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
		search: {
			placeholder: '搜索页面、方法和处理笔记...',
			empty: '没有找到匹配结果。',
			openLabel: '搜索站点',
			closeLabel: '关闭搜索',
			items: [
				{ title: '处理流程', text: '获取、预处理、滤波、合成、验证。', href: '/zh/#pipeline' },
				{ title: '数据产品', text: '格网 EWH、Mascon 对比、元数据和诊断信息。', href: '/zh/#data' },
				{ title: '方法记录', text: 'HSAF、Gaussian、Fan、DDK、PnMm 去相关。', href: '/zh/#methods' },
				{ title: '博客', text: '处理笔记和可复现工作流记录。', href: '/zh/blog/' },
				{ title: '下载', text: '安装包发布入口与 GitHub Releases 说明。', href: '/zh/downloads/' },
				{ title: '关于', text: '项目范围和 GRACE Level-2 处理背景。', href: '/zh/about/' },
			],
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
			lead: 'GRACE Level-2 数据处理软件用于本地开展 GRACE/GRACE-FO 球谐系数处理、滤波试验、流域分析和结果预览质检。',
			versionLabel: 'GRACE L2 Processing Software',
			cardTitle: '安装包与版本发布',
			cardText: '该程序面向 Level-2 数据准备、Gaussian/Fan/DDK/HSAF 滤波、等效水高产品合成、流域统计与图像预览等流程。稳定安装包通过 GitHub Releases 发布，本页面提供统一下载入口。',
			button: '打开下载页面',
			releaseHint: '安装包文件通过 Release Asset 分发，不直接存入静态网页仓库。',
			meta: [
				['运行平台', 'Windows 桌面端'],
				['应用场景', 'GRACE/GRACE-FO Level-2 数据处理'],
				['发布形式', '安装包或便携压缩包'],
				['版本状态', '按版本发布'],
			],
			features: [
				{ title: '数据准备', text: '组织月尺度 GSM 球谐系数、低阶项替换产品、GIA 设置、异常基准期和处理元数据。' },
				{ title: '滤波流程', text: '支持 Gaussian 平滑、Fan 滤波、PnMm 去相关、DDK 产品和 HSAF 试验的独立产品路由与对比。' },
				{ title: '产品输出', text: '生成格网等效水高产品、流域平均时间序列、预览图和质量诊断结果。' },
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
