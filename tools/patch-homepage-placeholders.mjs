import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const patches = [
	{
		file: 'src/pages/index.astro',
		replacements: [
			[
`const capabilityCards = [
	['Input management', 'Placeholder: batch import Level-2 GSM products, preserve product-center, release, month, lmax, and replacement metadata.'],
	['Filter comparison', 'Placeholder: run Gaussian, decorrelation, DDK, and HSAF routes side by side with explicit product tags and diagnostics.'],
	['Product preview', 'Placeholder: inspect global maps, basin averages, anomaly time series, and residual stripe patterns before export.'],
	['Basin analysis', 'Placeholder: compute area-weighted TWSA, annual/semi-annual amplitudes, linear trends, leakage-corrected series, and comparison tables.'],
	['Reproducible export', 'Placeholder: write outputs with configuration snapshots, figure previews, processing logs, and checksum-ready release folders.'],
	['Quality control', 'Placeholder: collect map checks, spectral checks, unit checks, reference-product comparison, and missing-month audit results.'],
];`,
`const capabilityCards = [
	['Input management', 'Batch import monthly Level-2 GSM products and keep processing center, release, lmax, month, and replacement metadata explicit.'],
	['Filter comparison', 'Run Gaussian, Fan, decorrelation, DDK, and HSAF product routes side by side with stable product tags and diagnostic outputs.'],
	['Product preview', 'Inspect global EWH maps, basin averages, anomaly time series, and residual stripe patterns before export.'],
	['Basin analysis', 'Compute area-weighted TWSA, annual and semi-annual amplitudes, linear trends, leakage-corrected series, and comparison tables.'],
	['Reproducible export', 'Write outputs with configuration snapshots, figure previews, processing logs, and versioned release folders.'],
	['Quality control', 'Collect map checks, spectral checks, unit checks, reference-product comparison, and missing-month audit results.'],
];`
			],
			[
`const interfacePlaceholders = [
	['Workflow dashboard', 'Reserved for a screenshot of the desktop processing workspace, including dataset selection, filter routing, and export status.'],
	['Map preview panel', 'Reserved for a figure or short animation showing gridded EWH preview, color scale control, and product comparison.'],
	['Basin diagnostics', 'Reserved for time-series plots, annual amplitude maps, trend summaries, and leakage-correction reports.'],
];`,
`const interfacePlaceholders = [
	['Workflow dashboard', 'Software workspace for dataset selection, correction settings, filter routing, product tags, and export status.'],
	['Map preview panel', 'Preview area for gridded EWH maps, color-scale control, coastline display, and product comparison.'],
	['Basin diagnostics', 'Diagnostic report area for TWSA time series, annual amplitude, trend summaries, and leakage-correction records.'],
];`
			],
			[
`<p>Placeholder copy for the GRACE Level-2 desktop workflow software. The section can later be replaced with real screenshots, versioned feature descriptions, and release-specific notes.</p>`,
`<p>This section summarizes the GRACE Level-2 desktop workflow software, including data import, correction configuration, filter comparison, EWH preview, basin analysis, and reproducible export.</p>`
			],
		],
	},
	{
		file: 'src/pages/zh/index.astro',
		replacements: [
			[
`const capabilityCards = [
	['数据导入管理', '占位说明：批量导入 Level-2 GSM 球谐产品，并保留处理中心、版本、月份、最高阶次和低阶项替换元数据。'],
	['滤波路线对比', '占位说明：并行生成 Gaussian、去相关、DDK 与 HSAF 产品，并通过明确标签管理各类诊断结果。'],
	['产品快速预览', '占位说明：在导出前检查全球格网图、流域平均、异常时间序列和残余条带结构。'],
	['流域尺度分析', '占位说明：计算面积加权 TWSA、年/半年振幅、线性趋势、泄漏校正序列和对比表格。'],
	['可复现输出', '占位说明：输出配置快照、图像预览、处理日志和便于版本归档的结果目录。'],
	['质量控制记录', '占位说明：汇总图像检查、谱域检查、单位检查、参考产品对比和缺失月份审计结果。'],
];`,
`const capabilityCards = [
	['数据导入管理', '批量导入 Level-2 GSM 球谐产品，并保留处理中心、版本、月份、最高阶次和低阶项替换元数据。'],
	['滤波路线对比', '并行生成 Gaussian、Fan、去相关、DDK 与 HSAF 产品，并通过明确标签管理诊断结果。'],
	['产品快速预览', '在导出前检查全球 EWH 格网图、流域平均、异常时间序列和残余条带结构。'],
	['流域尺度分析', '计算面积加权 TWSA、年/半年振幅、线性趋势、泄漏校正序列和对比表格。'],
	['可复现输出', '输出配置快照、图像预览、处理日志和便于版本归档的结果目录。'],
	['质量控制记录', '汇总图像检查、谱域检查、单位检查、参考产品对比和缺失月份审计结果。'],
];`
			],
			[
`const interfacePlaceholders = [
	['工作流仪表盘', '预留软件工作区截图位置，可展示数据集选择、滤波路线配置和导出状态。'],
	['格网预览面板', '预留图像或短动画位置，可展示 EWH 格网预览、色标控制和产品对比。'],
	['流域诊断报告', '预留时间序列图、年振幅图、趋势统计和泄漏校正报告展示位置。'],
];`,
`const interfacePlaceholders = [
	['工作流仪表盘', '用于展示数据集选择、改正配置、滤波路线和导出状态的软件工作区。'],
	['格网预览面板', '用于展示 EWH 格网预览、色标控制、海岸线叠加和产品对比。'],
	['流域诊断报告', '用于展示 TWSA 时间序列、年振幅、趋势统计和泄漏校正记录。'],
];`
			],
			[
`<p>这里先放置 GRACE Level-2 桌面工作流软件的功能介绍占位文案，后续可替换为真实界面截图、版本功能说明和发布记录。</p>`,
`<p>本节概述 GRACE Level-2 桌面工作流软件的数据导入、改正配置、滤波对比、EWH 预览、流域分析和可复现导出能力。</p>`
			],
		],
	},
];

let changed = 0;
for (const patch of patches) {
	if (!existsSync(patch.file)) {
		console.warn(`[skip] ${patch.file} not found`);
		continue;
	}
	let content = readFileSync(patch.file, 'utf8');
	const original = content;
	for (const [from, to] of patch.replacements) {
		if (content.includes(from)) content = content.replace(from, to);
		else console.warn(`[warn] Pattern not found in ${patch.file}. It may already be patched.`);
	}
	if (content !== original) {
		writeFileSync(patch.file, content, 'utf8');
		changed++;
		console.log(`[patched] ${patch.file}`);
	}
}
console.log(`Homepage patch complete. Files changed: ${changed}`);
