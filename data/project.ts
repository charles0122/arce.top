/*
 * 项目展示数据（纯数据在 project.json，这里只做类型推导、校验和排序）
 *
 * project.json 字段说明：
 * - title 项目名
 * - description 一句话简介（≤120 字）
 * - preview 卡片预览图（本地图片，放在 static/img 下）
 * - website 项目线上地址；href 站内介绍页链接，两者最多填一个
 * - source 开源仓库地址；填了之后卡片右上角会出现「Source」按钮
 * - tags 从 tags 里选，第一个建议是项目类型
 */

import projectsJson from './project.json';
import {sortBy} from '@site/src/utils/jsUtils';

export type Tag = {
  label: string;
  description: string;
  color: string;
};

// TagType 直接从 JSON 的 tags 键名推导，新增标签只需改 JSON
export type TagType = keyof typeof projectsJson.tags;

export type Project = {
  title: string;
  description: string;
  preview: string | null;
  website: string | null;
  source: string | null;
  /** 站内介绍页链接（docs/apps 路径），与 website 二选一 */
  href: string | null;
  tags: TagType[];
};

export const Tags: {[type in TagType]: Tag} = projectsJson.tags;

export const TagList = Object.keys(Tags) as TagType[];

// JSON 里的 tags 只能推断为 string[]，这里收窄为 TagType[]，
// 并由下方的校验保证运行时标签确实存在
export const projects: Project[] = projectsJson.projects as Project[];

// 开发期校验：项目引用了未定义的标签时，构建直接失败
const tagNames = Object.keys(Tags) as TagType[];
for (const project of projects) {
  for (const tag of project.tags) {
    if (!tagNames.includes(tag)) {
      throw new Error(
        `project.json: 项目「${project.title}」使用了未定义的标签「${tag}」`,
      );
    }
  }
}

function sortProjects() {
  let result = projects;
  // Sort by project title
  result = sortBy(result, (project) => project.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (project) => !project.tags.includes('favorite'));
  return result;
}

export const sortedProjects = sortProjects();
