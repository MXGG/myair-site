export type MethodItem = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  cardText: string;
  methodTag: string;
  order: number;
  priority: string;
  domain: string;
  input: string;
  output: string;
  tags: string[];
  summary: string;
  sections: Array<{
    id: string;
    title: string;
    body: string[];
    formula?: string;
    steps?: string[];
  }>;
  yaml: string;
  effects: string[];
  figures: string[];
  ending: string;
  related: string[];
};

export const methodsZh: MethodItem[] = [
  {
    slug: 'gaussian',
    title: 'Gaussian 平滑滤波',
    shortTitle: 'Gaussian 平滑',
    description: '用于高阶噪声抑制的基础各向同性空间平滑方法。',
    cardText: '用于高阶噪声抑制的基础各向同性空间平滑方法。',
    methodTag: 'GAUSS_300',
    order: 1,
    priority: '高',
    domain: '球谐系数域',
    input: '预处理后的 GSM 球谐系数',
    output: 'GAUSS_300 / GAUSS_500 等 EWH 格网产品',
    tags: ['球谐系数域', '各向同性', '基础滤波', '可能造成信号衰减'],
    summary: 'Gaussian 平滑滤波是 GRACE Level-2 球谐系数处理中最常用的基础空间滤波方法。该方法通过对不同阶数的球谐系数施加随阶数递减的平滑权重，削弱高阶噪声向等效水高结果中的传播。其优点是实现简单、参数清晰、结果稳定；缺点是滤波半径较大时会同时压制真实地球物理信号，导致振幅衰减和空间泄漏。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: [
          'GRACE Level-2 球谐解在高阶项中通常包含较强噪声。当球谐系数被转换为等效水高时，高阶噪声会在空间域中表现为斑块状扰动或条带背景。Gaussian 平滑的基本思路是降低高阶项权重，使反演结果在空间上更加连续。',
          '该方法适合作为基准滤波方案，也适合用于与 DDK、HSAF 等方法进行对照。但需要注意，Gaussian 平滑并不专门针对南北向相关条带，而是对所有方向进行相同平滑，因此属于各向同性空间滤波。',
        ],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['Gaussian 滤波假设空间平滑核只与地表两点之间的角距有关，因此其平滑权重仅依赖球谐阶数 l，与次数 m 无关。半径越大，高阶项衰减越强，滤波结果越平滑。'],
        formula: String.raw`\Delta \hat{C}_{lm}=W_l(r)\Delta C_{lm},\quad \Delta \hat{S}_{lm}=W_l(r)\Delta S_{lm}`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: [
          '读取经过预处理的月度 GSM 球谐系数，包括一阶项替换、C20 替换、GIA 改正和基准期扣除后的异常场。',
          '设定平滑半径，例如 300 km、500 km 或更大半径。',
          '计算每一阶 l 对应的 Gaussian 权重，并将权重作用于所有 m 次球谐系数。',
          '将滤波后的球谐系数综合为格网等效水高 EWH 或 TWSA 产品。',
          '保留产品标签、半径参数和上游输入信息。',
        ],
      },
    ],
    yaml: `method: Gaussian\ntag: GAUSS_300\nradius_km: 300\ndomain: spherical_harmonic\nupstream: PREPROCESSED_GSM\noutput: EWH_grid`,
    effects: [
      '能够有效降低高阶随机噪声，使全球 TWSA 图像更加平滑。',
      '滤波半径较大时信号损失不可避免，尤其在流域边界、湖泊、冰盖边缘和海岸带容易造成信号外扩散与振幅低估。',
    ],
    figures: ['不同半径 Gaussian 权重随阶数变化曲线。', '未滤波与 Gaussian 300 km 滤波后的全球 TWSA 对比图。', '典型流域滤波前后时间序列对比。', '优点—限制双列卡片。'],
    ending: 'Gaussian 平滑适合作为基础去噪方案和对照基准，但不宜作为精细区域水储量恢复的唯一依据。',
    related: ['fan', 'decorrelation', 'combined-filter'],
  },
  {
    slug: 'fan',
    title: 'Fan 扇形滤波',
    shortTitle: 'Fan 扇形滤波',
    description: '同时考虑球谐阶数与次数差异的各向异性空间滤波方法。',
    cardText: '同时考虑球谐阶数与次数差异的各向异性空间滤波方法。',
    methodTag: 'FAN_300',
    order: 2,
    priority: '高',
    domain: '球谐系数域',
    input: '预处理后的 GSM 球谐系数',
    output: 'FAN_300 等 EWH/TWSA 格网产品',
    tags: ['球谐系数域', '各向异性', 'degree-order dependent', '条带抑制'],
    summary: 'Fan 滤波是在 Gaussian 平滑基础上发展出的各向异性空间滤波方法。与 Gaussian 只依赖阶数不同，Fan 滤波同时考虑球谐系数的阶数 l 和次数 m，对高阶高次项施加更强抑制，从而更有针对性地削弱 GRACE 球谐解中的南北条带误差。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: [
          'GRACE 条带噪声并不是完全随机分布的高阶噪声，而与球谐系数的阶次结构密切相关。尤其在高阶高次项中，误差更容易放大，并在空间域表现为南北向条带。',
          'Gaussian 滤波对所有次数采用相同权重，无法充分体现这种阶次差异。Fan 滤波则通过引入与 l 和 m 同时相关的权重函数，增强了对高阶高次误差的抑制能力。',
        ],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['Fan 滤波可以理解为一种扇形分布的阶次权重设计。其滤波权重不再是单纯的 W_l，而是扩展为 W_lm。对于相同阶数，次数越高，滤波抑制通常越强。'],
        formula: String.raw`W_{lm}=W(l,m,r)`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: [
          '以预处理后的 GSM 球谐系数作为输入。',
          '设定 Fan 滤波半径。常见配置可与 Gaussian 对齐，例如 300 km，便于方法比较。',
          '根据阶数和次数计算二维滤波权重。',
          '将权重分别作用于 C_lm 和 S_lm。',
          '综合得到 Fan 滤波后的 EWH/TWSA 格网产品。',
          '在产品标签中保留半径和滤波类型。',
        ],
      },
    ],
    yaml: `method: Fan\ntag: FAN_300\nradius_km: 300\ndomain: spherical_harmonic\nweight: degree_order_dependent\noutput: EWH_grid`,
    effects: [
      '通常比 Gaussian 更适合削弱与阶次结构有关的条带噪声，尤其在高纬度和部分条带显著区域表现更好。',
      '仍属于空间平滑滤波，本质上会带来信号衰减；对于强梯度边界和小尺度流域，也可能导致区域平均 TWSA 被低估。',
    ],
    figures: ['Gaussian 与 Fan 权重二维分布对比图。', '同一月份 Gaussian 300 km 与 Fan 300 km 全球 TWSA 对比。', '高纬区域局部放大图。', 'Fan 与 PnMm 组合后的效果对比。'],
    ending: 'Fan 滤波适合用于增强条带抑制，但仍需通过流域统计、Mascon 对照或泄漏校正评估其信号损失。',
    related: ['gaussian', 'decorrelation', 'combined-filter'],
  },
  {
    slug: 'decorrelation',
    title: 'PnMm 去相关滤波',
    shortTitle: 'PnMm 去相关滤波',
    description: '沿阶数方向拟合并扣除奇偶阶相关误差，用于削弱南北条带。',
    cardText: '沿阶数方向拟合并扣除奇偶阶相关误差，用于削弱南北条带。',
    methodTag: 'P3M6 / P4M6',
    order: 3,
    priority: '高',
    domain: '球谐系数域',
    input: '预处理后的 GSM 球谐系数',
    output: 'P3M6、P4M6 或组合滤波上游产品',
    tags: ['去相关', '奇偶阶', '南北条带', '经验参数'],
    summary: 'PnMm 去相关滤波是一类针对 GRACE 球谐系数奇偶阶相关误差的去条带方法。该方法沿固定次数 m 的阶数方向，对奇阶项和偶阶项分别进行多项式拟合，并将拟合出的相关误差从原始系数中扣除。其核心目标是削弱南北向条带，而不是进行整体空间平滑。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: [
          'GRACE Level-2 球谐系数中存在明显的相关误差结构。对于较高次数 m，同一奇偶阶序列内部往往呈现较强相关性，这类相关误差在空间域中会形成南北向条带。',
          '单纯 Gaussian 平滑可以削弱条带，但会同时牺牲空间分辨率。去相关滤波试图直接从球谐系数相关结构出发，优先扣除条带对应的系统性误差。',
        ],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['PnMm 中的 P 表示多项式阶数，M 表示从某一次数开始实施去相关。例如 P3M6 表示对 m ≥ 6 的系数进行三次多项式去相关，P4M6 表示对 m ≥ 6 的系数进行四次多项式去相关。'],
        formula: String.raw`\Delta C_{lm}^{corr}=\Delta C_{lm}-f_{poly}(l)`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: ['输入预处理后的球谐系数。', '选择去相关参数，例如 P3M6 或 P4M6。', '对 m < M 的低次项保留，不进行去相关处理。', '对 m ≥ M 的系数，按奇阶和偶阶分别拟合多项式。', '从原系数中扣除拟合出的相关误差。', '根据需要叠加 Gaussian 或 Fan 空间平滑。'],
      },
    ],
    yaml: `method: PnMm_decorrelation\ntag: P3M6\npoly_order: 3\nstart_order_m: 6\ndomain: spherical_harmonic\noptional_downstream: GAUSS_300 / FAN_300 / HSAF`,
    effects: ['能够有效削弱南北条带，尤其对中高纬区域较明显。', '单独使用时，中低纬区域仍可能残留条带，因此常与 Gaussian 或 Fan 滤波组合使用。参数选择具有经验性。'],
    figures: ['去相关前后固定次数球谐系数序列对比。', '奇偶阶多项式拟合示意图。', '未滤波、P3M6、P3M6+Gaussian 的全球 TWSA 对比。', '不同 PnMm 参数的效果对比表。'],
    ending: 'PnMm 去相关适合作为去条带预处理步骤，但通常不应孤立作为最终 TWSA 产品。',
    related: ['combined-filter', 'gaussian', 'fan'],
  },
  {
    slug: 'combined-filter',
    title: '组合滤波：去相关与空间平滑',
    shortTitle: '组合滤波',
    description: '将 PnMm 去相关与 Gaussian 或 Fan 平滑串联，形成常用传统滤波产品。',
    cardText: '将 PnMm 去相关与 Gaussian 或 Fan 平滑串联，形成常用传统滤波产品。',
    methodTag: 'P3M6_FAN_300',
    order: 4,
    priority: '中',
    domain: '球谐系数域',
    input: '预处理后的 GSM 球谐系数',
    output: 'P3M6_GAUSS、P4M6_FAN 等传统基线产品',
    tags: ['串联处理', '传统基线', '产品路由', '信号衰减叠加'],
    summary: '组合滤波通常将 PnMm 去相关滤波与 Gaussian 或 Fan 空间平滑串联使用。去相关负责削弱球谐系数中的系统性相关误差，空间平滑负责降低残余高阶噪声。该策略是 GRACE Level-2 后处理中使用最广泛的传统方案之一。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: ['单独去相关滤波对南北条带有一定抑制作用，但残余噪声仍可能明显；单独空间平滑可以降低噪声，但容易造成信号衰减。组合滤波试图在二者之间取得折中：先扣除相关误差，再用适度空间平滑压制剩余高阶扰动。'],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['组合滤波可写为两个算子的串联，其中 F_decor 表示 PnMm 去相关，F_smooth 表示 Gaussian 或 Fan 平滑。常见组合包括 P3M6 + GAUSS_300、P4M6 + GAUSS_300、P3M6 + FAN_300、P4M6 + FAN_300。'],
        formula: String.raw`\hat{x}=F_{smooth}\left(F_{decor}(x)\right)`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: ['输入预处理后的球谐系数。', '执行 PnMm 去相关，削弱奇偶阶相关误差。', '执行 Gaussian 或 Fan 空间平滑，压制残余高阶噪声。', '球谐综合得到 EWH/TWSA。', '保存组合方法的完整产品标签，不能只写 filtered。'],
      },
    ],
    yaml: `method: combined_filter\ntag: P3M6_FAN_300\nupstream: PREPROCESSED_GSM\nstep_1: P3M6\nstep_2: FAN_300\ndomain: spherical_harmonic\noutput: EWH_grid`,
    effects: ['通常比单独 Gaussian 或单独去相关更稳定，能够明显减弱全球范围内的南北条带。', '仍然依赖经验参数，而且可能叠加信号衰减：去相关可能误扣部分真实信号，空间平滑又会进一步扩散区域边界。'],
    figures: ['原始解 → P3M6 → P3M6+Gaussian/Fan 的流程图。', '2007 年 10 月全球 TWSA 对比图。', '典型流域时间序列对比。', '参数标签说明卡片。'],
    ending: '组合滤波是可靠的传统基线方案，但在需要精细保持局地振幅和边界信息时，应与 DDK、HSAF 或泄漏校正结果联合评估。',
    related: ['decorrelation', 'gaussian', 'fan'],
  },
  {
    slug: 'ddk',
    title: 'DDK 正则化滤波',
    shortTitle: 'DDK 滤波',
    description: '基于误差协方差与正则化约束的各向异性滤波产品。',
    cardText: '基于误差协方差与正则化约束的各向异性滤波产品。',
    methodTag: 'DDK1–DDK8',
    order: 5,
    priority: '高',
    domain: '球谐系数域',
    input: '预处理后的 GRACE 球谐系数',
    output: 'DDK1–DDK8 滤波 EWH/TWSA 产品',
    tags: ['正则化', '协方差约束', '各向异性', 'DDK1–DDK8'],
    summary: 'DDK 滤波是一类基于误差协方差、信号协方差和 Tikhonov 正则化思想构建的各向异性滤波方法。与 Gaussian、Fan 等经验平滑滤波不同，DDK 方法显式引入误差统计信息，能够在去条带与信号保持之间取得相对稳定的折中。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: ['GRACE 球谐解中的误差具有明显的各向异性和相关性。传统平滑滤波主要依赖经验半径，难以充分利用误差协方差信息。DDK 滤波通过正则化框架构造滤波算子，使滤波强度与误差统计和先验信号约束相关，因此在 GRACE 数据处理中被广泛采用。'],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['DDK 滤波可理解为对球谐系数最小二乘解的正则化改造。其核心思想是在保留观测解的同时，引入先验约束，抑制不稳定或噪声主导的系数分量。不同参数组合形成 DDK1 至 DDK8 等不同强度产品。'],
        formula: String.raw`\hat{x}=(N+\alpha R)^{-1}Nx`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: ['准备预处理后的 GRACE 球谐系数。', '选择 DDK 类型，例如 DDK1、DDK2、DDK3、DDK4 等。', '调用对应 DDK 滤波矩阵或产品算子。', '将滤波后的球谐系数转换为 EWH/TWSA。', '在产品标签中保留 DDK 编号，不能只写 DDK。'],
      },
    ],
    yaml: `method: DDK\ntag: DDK4\ndomain: spherical_harmonic\nregularization: anisotropic\nupstream: PREPROCESSED_GSM\noutput: EWH_grid`,
    effects: ['DDK1 和 DDK2 滤波强度较大，条带抑制效果明显，但可能导致真实信号损失。', 'DDK5 至 DDK8 滤波较弱，可能保留较多残余条带；DDK3 和 DDK4 通常在去条带和信号保持之间更均衡。'],
    figures: ['DDK1–DDK8 全球 TWSA 对比图。', 'DDK4 与 Gaussian/Fan/HSAF 的频谱对比图。', 'DDK 强度梯度说明条。', '推荐使用场景卡片。'],
    ending: 'DDK4 适合作为稳健对照产品，但仍需注意其正则化先验可能造成局部信号衰减。',
    related: ['gaussian', 'hsaf', 'leakage-validation'],
  },
  {
    slug: 'hsaf',
    title: 'HSAF / Hankel 谱分析滤波',
    shortTitle: 'HSAF / Hankel 滤波',
    description: '基于 Hankel 谱分析的自适应条带噪声分离与信号重构方法。',
    cardText: '基于 Hankel 谱分析的自适应条带噪声分离与信号重构方法。',
    methodTag: 'HSAF',
    order: 6,
    priority: '最高',
    domain: '格网域',
    input: 'P4M6_EWH_grid 或其他预处理格网产品',
    output: 'HSAF_EWH_grid',
    tags: ['格网域', '自适应分解', '条带模态识别', '信号重构'],
    summary: 'HSAF 是面向 GRACE 时变重力场条带噪声抑制的自适应谱分解方法。该方法将 Hankel 谱分析引入 GRACE 滤波处理，通过构建 Hankel 矩阵、执行 HTLS 分解、识别条带模态并重构有效信号，实现南北条带噪声与地球物理信号的分离。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: ['传统 Gaussian、Fan 和去相关方法主要依赖频谱分离或经验参数设定。但 GRACE 南北条带噪声并不是单纯高频随机噪声，而是在空间域表现为沿经度方向的准周期振荡，并且与真实水文信号在频谱上部分重叠。因此，仅通过高阶衰减或多项式扣除，难以同时满足强去噪和少损失。', 'HSAF 的出发点是：如果将每条纬度圈上的经向序列看作准周期信号，就可以通过 Hankel 谱分析把该序列分解为若干模态，再根据频率、振幅、相位和阻尼等参数识别条带噪声模态，最终实现自适应滤波。'],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['HSAF 的数学基础是 Hankel Total Least Squares, HTLS。对于一维序列 x(n)，可以将其表示为若干指数衰减复正弦分量的叠加。HSAF 通过 Hankel 矩阵和双重 SVD 分解估计这些模态参数，再根据条带噪声对应的波长范围识别并扣除噪声模态。'],
        formula: String.raw`x(n)=\sum_{k=1}^{K} A_k e^{\alpha_k n} e^{i(2\pi f_k n+\theta_k)}`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: ['将预处理后的球谐系数转换为格网 EWH/TWSA。', '沿每条纬度圈提取经向剖面序列。', '对经向序列采用滑动窗口处理，构建局部 Hankel 矩阵。', '执行 HTLS 分解，得到不同模态的频率、振幅、相位和阻尼参数。', '根据条带主波长或频率范围识别噪声模态。', '扣除条带模态并重构有效信号。', '将各窗口结果重叠加权平均，形成完整 HSAF 滤波格网。'],
      },
    ],
    yaml: `method: HSAF\ntag: HSAF_P4M6\ndomain: grid\nupstream: P4M6_EWH_grid\nwindow_length_deg: 30\nembedding_dimension: 10\nmode_number: 6\nstep_deg: 1\noutput: HSAF_EWH_grid`,
    effects: ['自适应性较强，能够在削弱南北条带的同时较好保持区域真实信号。', '性能依赖窗口长度、嵌套维数、模态数和条带识别准则；如果某些月份条带形态纬向变化剧烈，单条纬度圈的一维分解可能不足。'],
    figures: ['Hankel 矩阵构造示意图。', '纬向剖面 → 模态分解 → 条带模态扣除 → 信号重构流程图。', '不同参数组合的剖面对比图。', 'HSAF 与 Gaussian/DDK/Fan 的全球 TWSA 对比图。', '里海区域校正前后对比图。'],
    ending: 'HSAF 适合用于需要兼顾条带抑制、振幅保持和区域信号恢复的 GRACE Level-2 后处理场景。',
    related: ['decorrelation', 'ddk', 'leakage-validation'],
  },
  {
    slug: 'leakage-validation',
    title: '泄漏校正与质量验证',
    shortTitle: '泄漏校正与验证',
    description: '面向流域、湖泊和封闭区域的尺度因子恢复、周边信号扣除与外部一致性验证。',
    cardText: '面向流域、湖泊和封闭区域的尺度因子恢复、周边信号扣除与外部一致性验证。',
    methodTag: 'scale factor / GLDAS / Hydroweb',
    order: 7,
    priority: '高',
    domain: '区域统计与验证域',
    input: '滤波后的 EWH/TWSA 格网产品与区域掩膜',
    output: '泄漏校正后的区域序列与验证指标',
    tags: ['尺度因子', '周边信号扣除', '流域统计', 'Hydroweb 验证'],
    summary: '泄漏校正用于修正球谐截断和滤波引起的信号扩散、振幅衰减和周边污染。对于湖泊、封闭流域、冰盖边缘和海岸带等边界陡变区域，泄漏误差会显著影响 GRACE 反演的季节振幅和长期趋势。因此，滤波结果不能只看图像是否平滑，还必须通过尺度因子、周边信号扣除、流域统计和外部产品验证进行综合评估。',
    sections: [
      {
        id: 'background',
        title: '背景',
        body: ['GRACE Level-2 球谐解通常需要截断到有限阶数，并经过滤波处理。这一过程会改变真实信号的空间谱结构，使目标区信号向外扩散，同时也可能让周边区域信号混入目标区。前者称为外泄漏，后者称为内泄漏。', '对于里海这类封闭水体，真实信号主要集中在水体范围内，边界清晰。如果不进行泄漏校正，区域平均 TWSA 可能被低估，长期趋势和季节振幅也会产生系统偏差。'],
      },
      {
        id: 'principle',
        title: '基本原理',
        body: ['泄漏校正可以采用两步法：第一步，利用 GLDAS 等陆面水文模型估算目标区周边陆地水储量变化，并施加与 GRACE 相同的截断和滤波处理，得到周边信号对目标区的污染贡献。第二步，构造目标区内均匀 1 cm 的合成信号，经过同样处理链计算尺度因子。'],
        formula: String.raw`SF=\frac{h_{input}}{h_{filtered}},\quad TWSA_{corrected}=SF\cdot(TWSA_{GRACE}-TWSA_{leakage\text{-}in})`,
      },
      {
        id: 'workflow',
        title: '处理流程',
        body: [],
        steps: ['准备目标区掩膜，例如里海水体范围或流域边界。', '计算原始 GRACE 滤波结果的区域平均序列。', '利用 GLDAS 或其他水文模型估算周边陆地污染信号。', '对模型场施加与 GRACE 完全一致的处理流程。', '从 GRACE 区域序列中扣除周边泄入信号。', '构造合成信号并计算尺度因子。', '对区域序列进行尺度因子恢复。', '与 Hydroweb 卫星测高、CSR Mascon 或其他独立产品进行一致性验证。'],
      },
    ],
    yaml: `method: leakage_correction\ntag: CASPIAN_HSAF_SF\ntarget_region: Caspian_Sea\nbackground_model: GLDAS_Noah_2_1\nscale_factor: 1.22\nvalidation: Hydroweb_altimetry\nmetrics: annual_amplitude, trend, correlation, rmse`,
    effects: ['能够明显改善小尺度目标区的振幅恢复和趋势估计。', '依赖外部模型和区域掩膜；目标区边界、尺度因子构造方式和滤波流程一致性都会影响最终结果。'],
    figures: ['内泄漏与外泄漏示意图。', '两步法泄漏校正流程图。', '里海校正前后空间分布对比图。', 'GRACE 与 Hydroweb 测高时间序列对比图。', '年振幅、趋势、RMSE 指标表。'],
    ending: '滤波解决的是噪声问题，泄漏校正解决的是区域信号恢复问题；二者应作为连续处理链而不是互相替代的方法。',
    related: ['hsaf', 'ddk', 'combined-filter'],
  },
];

export const methodsBySlug = Object.fromEntries(methodsZh.map((method) => [method.slug, method])) as Record<string, MethodItem>;

export const methodIndexIntro = {
  title: '方法记录',
  subtitle: '记录 GRACE Level-2 球谐解从去条带、空间平滑到泄漏校正的主要处理方法。',
  description: '将 Gaussian、Fan、PnMm、组合滤波、DDK、HSAF 与泄漏校正放入同一处理链中说明，保留产品标签、参数、输入输出、上游依赖和质量验证信息。',
  flow: ['Preprocessed SHCs', 'PnMm / Gaussian / Fan / DDK', 'Gridded EWH / TWSA', 'HSAF / Leakage Correction', 'Basin Statistics / Mascon / Hydroweb Validation'],
  contract: '所有滤波产品都应保留上游输入、处理参数、产品标签和质量检查信息。不要将不同滤波结果混写为同一个 filtered 产品，否则会导致结果不可追溯。',
};
