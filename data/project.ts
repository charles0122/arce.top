
export const projects: Project[] = [

  {
    /// 介绍链接
    href:"/docs/the-dust-and-sand-of-tomorrow",
    title: '致尘沙不再的明天-网易Minigame',
    description: '复古机械风格，2D横版剧情向解谜游戏，游戏完整流程约15分钟。 ',
    preview: '/img/gamejam/wyminigame.jpg',
    website: 'https://game.academy.163.com/event/mg-2022?page=works&id=2803',
    tags: ['休闲', '益智', '文字', '公益'],
    type: 'Game Jam',
  },
  {
    title: '病入膏肓-机核Booom',
    description: '用影片作为玩法的核心，在游戏中加入真实影像作为线索。',
    preview: '/img/gamejam/Attachment.png',
    website: 'https://www.gcores.com/games/85656',
    tags: ['恐怖', '解谜', '爱情'],
    type: 'Game Jam',
    href: undefined
  },
  {
    title: '煎饼循环-朝夕光年游戏开发挑战赛',
    description: '游戏制作人的末路是卖"煎饼" ,如果让"煎饼"成为游戏制作的开始呢',
    preview: '/img/gamejam/jianbin.png',
    website: 'https://www.bilibili.com/video/BV1Ct4y1G7Gj/?spm_id_from=333.337',
    tags: ['休闲', '模拟经营'],
    type: 'Game Jam',
    href: undefined
  },
  {
    title: '秋田犬物语-吉比特未来制作人',
    description: '农场模拟经营',
    preview: '/img/gamejam/taleofform.png',
    website: 'https://mp.weixin.qq.com/s/6BsUBJmqoNo3GcUx6255RA',

    tags: ['模拟经营'],
    type: 'Game Jam',
    href: undefined
  },

  {
    title: '守护者-Unity NewbiesJam',
    description: '类吸血鬼幸存者游戏',
    preview: '/img/gamejam/shouhuzhe.png',
    website: 'https://www.bilibili.com/video/BV1Ce411V7X5/?spm_id_from=333.999.0.0',
    tags: ['Roguelike', '奇幻'],
    type: 'Game Jam',
    href: undefined
  },
  {
    href:"/docs/lezhi-mini-program",
    title: '乐至未来-智能化志愿服务管理',
    description: '以落实立德树人根本任务，促进乡村学生全面发展、健康成长。',
    preview: '/img/projects/lezhi-cover.png',
    website: undefined,
    tags: [],
    type: 'Mini Program',
  },
  {
    href:"/docs/feiyoung-mini-program",
    title: 'Young宇宙-传统文化潮玩交流社区',
    description: '延续历史文脉、坚定文化自信、推动文明交流互鉴，拓展中国传统文化的宣传渠道',
    preview: '/img/projects/feiyoung-cover.png',
    website: undefined,
    tags: [],
    type: 'Mini Program',
  },
  {
    title: '',
    description: '',
    preview: '',
    website: '',
    tags: [],
    type: 'App',
    href: undefined
  },
  {
    title: 'Sunny Land',
    description: '',
    preview: '/img/gamejam/sunnyland.png',
    website: '',
    tags: ['像素'],
    type: 'Study Example',
    href: undefined
  },
  {
    title: 'Hazard of Garcon',
    description: '',
    preview: '/img/gamejam/hazardofgarcon.png',
    website: '',
    tags: ['像素'],
    type: 'Study Example',
    href: undefined
  },
  {
    title: 'Pixel Game',
    description: '',
    preview: '/img/gamejam/pixelgame.png',
    website: 'https://www.bilibili.com/video/BV1Ma411Q7pM/?spm_id_from=333.999.0.0',
    tags: ['像素'],
    type: 'Study Example',
    href: undefined
  },
  {
    title: '3D ARPG',
    description: '',
    preview: '/img/gamejam/3darpg.png',
    website: 'https://www.bilibili.com/video/BV1pT4y197mp/?spm_id_from=333.999.0.0',
    tags: ['动作', '角色扮演'],
    type: 'Study Example',
    href: undefined
  },

  {
    title: '3D ARPG 使用高质量资产构建游戏',
    description: '使用高质量资产构建游戏',
    preview: '/img/gamejam/3darpgcodea.png',
    website: 'https://www.bilibili.com/video/BV1Fd4y1Y7Zj/?spm_id_from=333.999.0.0',
    tags: ['动作', '角色扮演'],
    type: 'Study Example',
    href: undefined
  },
]

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'javascript'
  | 'personal'
  | '休闲'
  | '益智'
  | '公益'
  | '单机'
  | '联网'
  | '文字'
  | '恐怖'
  | '解谜'
  | '模拟经营'
  | '爱情'
  | 'Roguelike'
  | '奇幻'
  | '像素'
  | '动作'
  | '角色扮演'
  ;

export type ProjectType =
  | 'UI'
  | 'App'
  | 'Game Jam'
  | 'Mini Program'
  | 'Study Example'
  | 'Other';

export type Project = {
  title: string;
  description: string;
  preview?: any;
  website: string;
  href:String,
  source?: string | null;
  tags: TagType[];
  type: ProjectType
};

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目可以提供灵感!',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '设计漂亮的网站!',
    color: '#a44fb7',
  },
  javascript: {
    label: 'JavaScript',
    description: 'JavaScript 项目',
    color: '#dfd545',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
  '休闲': {
    label: '休闲',
    description: '',
    color: '#12affa',
  },
  '益智': {
    label: '益智',
    description: '',
    color: '#12affa',
  },
  '模拟经营': {
    label: '模拟经营',
    description: '',
    color: '#12affa',
  },
  '公益': {
    label: '公益',
    description: '通过游戏向玩家',
    color: '#e9669e'
  },

  '文字': {
    label: '文字',
    description: '',
    color: '#12affa',
  },
  '恐怖': {
    label: '恐怖',
    description: '',
    color: '#12affa',
  },
  '解谜': {
    label: '解谜',
    description: '',
    color: '#12affa',
  },
  '爱情': {
    label: '爱情',
    description: '',
    color: '#12affa',
  },
  'Roguelike': {
    label: 'Roguelike',
    description: '',
    color: '#12affa',
  },
  '像素': {
    label: '像素',
    description: '',
    color: '#12affa',
  },
  '奇幻': {
    label: '像素',
    description: '',
    color: '#12affa',
  },
  '动作': {
    label: '动作',
    description: '',
    color: '#12affa',
  },
  '角色扮演': {
    label: '角色扮演',
    description: '角色扮演',
    color: '#12affa',
  },
  '单机': {
    label: "单机",
    description: "单机游戏",
    color: '#12affa',
  },
  '联网': {
    label: "联网",
    description: "联网游戏",
    color: '#12affa',
  }
};

export const TagList = Object.keys(Tags) as TagType[];

export const groupByProjects = projects.reduce((group, project) => {
  const { type } = project;
  group[type] = group[type] ?? [];
  group[type].push(project);
  return group;
},
  {} as Record<ProjectType, Project[]>
)

