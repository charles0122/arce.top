import {projects as siteProjects} from '@site/data/project';

// English presentation copy for the TV homepage; the original site stays Chinese.
const copy: Record<string, {title: string; description: string; category: string}> = {
  'RCode 放射状码': {title: 'RCode', description: 'An open radial code system built in Rust, with a browser-based WASM workbench.', category: 'Rust · Open source'},
  '数独 Sudoku': {title: 'Sudoku', description: 'An offline puzzle companion with pencil notes, hints and multiple difficulty levels.', category: 'App · Puzzle'},
  '致尘沙不再的明天-网易Minigame': {title: 'Beyond the Dust', description: 'A short narrative puzzle game set in a retro mechanical world.', category: 'Game jam · Narrative'},
  '病入膏肓-机核Booom': {title: 'Terminal', description: 'A mystery game that turns live-action footage into playable clues.', category: 'Game jam · Mystery'},
  '煎饼循环-朝夕光年游戏开发挑战赛': {title: 'Pancake Loop', description: 'What if making pancakes became the beginning of making games?', category: 'Game jam · Simulation'},
  '秋田犬物语-吉比特未来制作人': {title: 'Akita Tales', description: 'A cozy farming simulation made for a game development challenge.', category: 'Game jam · Farming'},
  '守护者-Unity NewbiesJam': {title: 'The Guardian', description: 'A survival action game inspired by the survivors genre.', category: 'Game jam · Roguelike'},
  '乐至未来-智能化志愿服务管理': {title: 'A Brighter Future', description: 'A mini program connecting volunteer services with rural education.', category: 'Mini program · Community'},
  'Young宇宙-传统文化潮玩交流社区': {title: 'Young Universe', description: 'A community mini program exploring traditional culture and contemporary collectibles.', category: 'Mini program · Culture'},
  'Sunny Land': {title: 'Sunny Land', description: 'A pixel platformer study.', category: 'Study · Pixel art'},
  'Hazard of Garcon': {title: 'Hazard of Garcon', description: 'A pixel game development study.', category: 'Study · Pixel art'},
  'Pixel Game': {title: 'Pixel Game', description: 'Experiments in pixel game development.', category: 'Study · Pixel art'},
  '3D ARPG': {title: '3D ARPG', description: 'An exploration of action role-playing game development.', category: 'Study · Action RPG'},
  '3D ARPG 使用高质量资产构建游戏': {title: 'Little Adventurer', description: 'An action RPG study built with production-quality assets.', category: 'Study · Action RPG'},
};

export const projects = siteProjects.map(project => ({...project, ...copy[project.title]}));
