export type AppStoreLinks = {
  appStore?: string;
  googlePlay?: string;
};

export type AppFeature = {
  icon: string;
  title: string;
  description: string;
};

export type AppLegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type AppMeta = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  features: AppFeature[];
  stores: AppStoreLinks;
  privacy: {
    updated: string;
    sections: AppLegalSection[];
  };
  support: {
    sections: AppLegalSection[];
  };
};

export const apps: AppMeta[] = [
  {
    slug: 'sudoku',
    name: '数独 Sudoku',
    tagline: '每天一局数独，锻炼你的逻辑思维',
    description:
      '一款干净纯粹的经典九宫格数独。从入门到专家的多档难度，铅笔笔记与智能提示陪你推演每一步，离线也能随时随地开一局。',
    icon: '/img/apps/sudoku-icon.svg',
    accentColor: '#2e7df6',
    features: [
      {
        icon: '🧩',
        title: '经典玩法',
        description: '标准九宫格数独，海量题库，难度从入门、进阶到专家自由选择。',
      },
      {
        icon: '✏️',
        title: '铅笔笔记',
        description: '一键记录候选数，像纸笔一样推演，随想随擦。',
      },
      {
        icon: '💡',
        title: '智能提示',
        description: '卡住的时候获取一步提示，还能顺便学习解题思路。',
      },
      {
        icon: '✅',
        title: '错误检查',
        description: '实时标出冲突数字，也可以关闭它，挑战纯手动验证。',
      },
      {
        icon: '📶',
        title: '离线畅玩',
        description: '无需网络，地铁上、飞行模式里，随时随地开一局。',
      },
      {
        icon: '📊',
        title: '成绩统计',
        description: '记录完成时间与最佳纪录，支持深色模式，见证你的进步。',
      },
    ],
    stores: {},
    privacy: {
      updated: '2026-10-31',
      sections: [
        {
          heading: '引言',
          paragraphs: [
            '欢迎使用数独 Sudoku（以下简称“本应用”）。我们非常重视你的隐私。本政策说明本应用如何处理信息，以及你享有的相关权利。',
            '请在使用本应用前仔细阅读本政策。使用本应用即表示你已理解并同意本政策的内容。',
          ],
        },
        {
          heading: '我们收集的信息',
          list: [
            '本应用不要求注册账号，我们不会收集你的姓名、电话号码、电子邮箱、地理位置等个人身份信息。',
            '你的游戏进度、难度偏好等设置数据仅保存在你的设备本地，不会上传到我们的服务器。',
          ],
        },
        {
          heading: '权限使用',
          paragraphs: [
            '本应用仅在功能确有必要时申请系统权限（如本地存储），且仅用于实现对应功能，不会用于其他目的。',
          ],
        },
        {
          heading: '第三方服务',
          paragraphs: [
            '目前本应用未接入任何第三方统计、分析或广告服务。',
            '若未来版本接入相关服务，我们会在本页面更新，说明对应服务收集的信息类型、使用目的及你的选择方式。',
          ],
        },
        {
          heading: '儿童隐私',
          paragraphs: [
            '本应用不会主动收集任何儿童的个人信息。如果家长或监护人认为儿童向我们提供了个人信息，请通过下文方式联系我们，我们将及时删除。',
          ],
        },
        {
          heading: '数据安全与存储',
          paragraphs: [
            '由于你的数据仅保存在设备本地，卸载本应用即会删除全部相关数据。我们建议你在卸载前确认不再需要本地进度。',
          ],
        },
        {
          heading: '隐私政策的更新',
          paragraphs: [
            '我们可能会不时更新本政策。更新后我们会在本页面发布修订后的版本并更新“最近更新”日期，建议你定期查阅。',
          ],
        },
        {
          heading: '联系我们',
          paragraphs: [
            '如果你对本政策或本应用处理信息的方式有任何疑问、意见或建议，欢迎联系我们：',
          ],
          list: ['邮箱：zainai311@qq.com'],
        },
      ],
    },
    support: {
      sections: [
        {
          heading: '常见问题',
          paragraphs: ['以下是玩家最常遇到的问题。如果没有解决你的疑问，欢迎直接邮件反馈。'],
        },
        {
          heading: '游戏进度可以同步到其他设备吗？',
          paragraphs: [
            '目前进度保存在设备本地，暂不支持跨设备云同步。卸载应用会同时删除本地进度，请谨慎操作。',
          ],
        },
        {
          heading: '遇到闪退、显示异常等问题怎么办？',
          paragraphs: [
            '请先尝试将应用更新到最新版本。如果问题仍然存在，欢迎通过邮件联系我们，并尽量附上：设备型号、系统版本、问题发生的操作步骤，如有截图更佳。',
          ],
        },
        {
          heading: '如何反馈题目错误或功能建议？',
          paragraphs: ['我们非常欢迎反馈！请通过邮件说明具体情况，我们会尽快处理并在后续版本中改进。'],
        },
        {
          heading: '联系我们',
          list: ['邮箱：zainai311@qq.com'],
        },
      ],
    },
  },
];

export function getAppBySlug(slug: string): AppMeta {
  const app = apps.find((a) => a.slug === slug);
  if (!app) {
    throw new Error(`Unknown app: ${slug}`);
  }
  return app;
}
