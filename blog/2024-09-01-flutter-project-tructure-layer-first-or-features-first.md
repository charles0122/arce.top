---
slug: flutter-project-tructure-layer-first-or-features-first
title: Flutter项目结构 层级优先还是特性优先🤔️？
authors:
  - name: Arce
    title: Unity Developer (Weak Version)
    url: https://github.com/charles0122
    image_url: https://avatars.githubusercontent.com/u/70085736?v=4
    email: zainai311@qq.com
description: ""
tags: ["Flutter","bloc"]
---
# Flutter项目结构 层级优先还是特性优先🤔️？


<!-- Flutter Project Structure: Layer First or Features First
flutter-project-tructure-layer-first-or-features-first
Flutter 项目结构: 层级优先还是特性优先 -->

## 背景

在我们开始 Flutter App Development 之前，最主要的事情是确定 Project Structure。要记住一些事情来确保 scalable and manageable project .在架构分区中，我们可以区分技术分区（Layer First）结构和域分区（Features First）结构。因此，我们可以选择适合我们的团队和要求的那一个。

<!-- truncate -->

## 层级优先 Layer First 

在 Technical Partitioning （Layer First） 中，我们按技术区分应用程序组件。例如，我们将发现的常见内容是分层 （N 层） 架构。这是按技术分组的，例如：

```shell
lib
└─  data
|   └─ datasources
|   |  └─ local
|   |  └─ remote
|   └─ models
|   └─ repositories
└─  domain
|   └─ entities
|   └─ repositories
|   └─ usecases
└─  pages
      └─ feature
      └─ cubit
```

解释：

- 数据层（data layer）：数据层由 Repository 实现（合约来自域层）和数据源组成 - 一个通常用于获取远程 （API） 数据，另一个用于缓存该数据。在存储库中，您可以决定是返回新数据还是缓存数据、何时缓存数据等。
  - 数据源（data source）：根据结构，我们可以看到大多数情况下只有 2 个数据资源，分别来自本地或远程。
    - 本地(local)：本地数据源 /database，例如 Hive 或 SharedPreferences。
    - 远程(remote)：Firebase Realtime Database 或 Rest API 等远程数据源。
      - model：此模型来自响应 API。
      - services：网络客户端的配置，如 dio 或 Firestore。
  - 模型(model)：模型从 API 响应的位置。
  - 存储库(repository impl)：在这里，我们从域中实现 Contract 存储库。
- 领域层（domain layer）：是内层，不应该受到更改数据源或将我们的应用程序移植到 Angular Dart 的突发奇想的影响。它将仅包含核心业务逻辑 （用例） 和业务对象 （实体）。它应该独立于其他所有层。
  - 实体：此数据应该对用户可见，因此我们将原始 JSON 从 API 转换为实体。
  - 存储库(repository)：然后，我们定义所有合约的地方将在数据层上实现。
  - 使用案例：从核心实现用例，这里我们从 Application 定义业务逻辑。
- 表现层（page layer）：这是你从 “unclean” Flutter 架构中习惯的东西。您需要小部件来在屏幕上显示某些内容。然后，这些小部件将事件分派到 Bloc 并侦听状态（如果您不使用 Bloc 进行状态管理，则为等效状态）。
  - 屏幕名称: 例如：login：与“用户”屏幕上的 UI 和用户交互相关的所有内容。
    - Cubit：在这里，我们处理状态管理，并在状态从 onLoading、onSuccess 和 onError 更改时通知 UI。

## 特性优先 Features First

与技术分区（分层优先）不同，域分区（特征优先）在业务中根据特征/域分离应用程序组件，这是所有按特征/域分组的技术分区。

我们如何处理主屏幕或主屏幕等共享代码？在这些情况下，我们可以创建名为 common、shared 或 general 的新功能。但是，如果你有 20 多个功能，并且一些代码只需要由其中两个共享，我们应该把它放在共享文件夹中吗？在这种情况下，我将导入一个功能需要它的特征。例如，我有功能 A，但在功能 C 中，我需要使用功能 A 中的模型或存储库，因此我只需将功能 A 导入到功能 C。但是没有正确或错误的答案，您必须根据具体情况使用您最好的判断，或者您可以与您的团队讨论。

下面首先使用功能示例你的项目结构：

```shell
lib
└─ features
    └─ auth
    |  └─ data
    |  └─ domain
    |	 └─ pages
    └─ user
    └─ transaction
    └─ payment

```

## 总结：何时应该使用它

根据我的经验，`Layer First` 和 `Features First` 各有利弊。

如果您的**应用程序很简单，并且你的团队人数较少（少于5人） layer first 适合您的团队**，因为它易于维护，您只需定义 layer，并且更容易与您的团队讨论。

但是，当您的 **应用程序很复杂, 有很多功能，也有很多开发人员**，功能优先时，将是最佳选择。因为每个开发人员都将根据他们正在开发的功能负责。减少依赖项并减少项目存储库上的冲突，因为它们只处理其功能。而且我们也可以只删除这些特征，如果我们仍然使用 layer first 项目架构，则需要检查每一层的特征，然后逐个删除它。

## 参考资料

[1] [原文章](https://blog.lazycatlabs.com/posts/programming/flutter/flutter-layer-or-features-first)

[2] [原文章附带的演示项目](https://github.com/lazycatlabs/flutter_auth_app)