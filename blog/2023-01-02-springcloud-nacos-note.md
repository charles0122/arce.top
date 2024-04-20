---
slug: springcloud-nacos-note
title: Nacos 注册中心与服务监测
author: Arce
author_title: 独立游戏开发者
author_url: https://github.com/charles0122
author_image_url: https://avatars.githubusercontent.com/u/70085736?v=4
description: 测试
tags: [SpringCloud, Nacos, Java]
activityId: 相关动态 ID
bvid: 相关视频 ID（与 activityId 2选一）
oid: oid
---



[Nacos官方文档](https://spring-cloud-alibaba-group.github.io/github-pages/2021/zh-cn/index.html)

[下载地址](https://github.com/alibaba/nacos/releases)

### 服务注册与发现

在父工程添加依赖

```xml
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>2.2.0</version>
</dependency>

<!-- 这里引入最新的SpringCloud依赖 -->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-dependencies</artifactId>
  <version>2021.0.1</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>

<!-- 这里引入最新的SpringCloudAlibaba依赖，2021.0.1.0版本支持SpringBoot2.6.X -->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-dependencies</artifactId>
  <version>2021.0.1.0</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```
<!-- truncate -->
在需要被发现的微服务中添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

修改微服务的配置文件

```xml
server:
 # 之后所有的图书服务节点就81XX端口
  port: 8101
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://cloudstudy.mysql.cn-chengdu.rds.aliyuncs.com:3306/cloudstudy
    username: test
    password: 123456
  # 应用名称 bookservice
  application:
    name: bookservice
  cloud:
    nacos:
      discovery:
        # 配置Nacos注册中心地址
        server-addr: localhost:8848
```

Nacos后台服务列表（登录的账号密码默认都是nacos）

![img](.\img\2023-01-02-springcloud-nacos-note\1660836274443-8e90b9c1-3775-459f-82f1-2f04d41bd110.png)

使用Feign实现服务发现远程调用以及负载均衡

此处为语雀内容卡片，点击链接查看：[查看详情](https://www.yuque.com/arce/glxhka/krza54)

![img](.\img\2023-01-02-springcloud-nacos-note\1660836937317-450a2072-1817-4173-8fed-e7f50d7c0913.png)

Nacos 服务分为临时实例和非临时实例

临时实例：和Eureka一样，采用心跳机制向Nacos发送请求保持在线状态，一旦心跳停止，代表实例下线，不保留实例信息。

非临时实例：由Nacos主动进行联系，如果连接失败，那么不会移除实例信息，而是将健康状态设定为false，相当于会对某个实例状态持续地进行监控。

设置为非临时的`spring.cloud.nacos.discovery.ephemeral=false`

![img](.\img\2023-01-02-springcloud-nacos-note\1660837471691-8ab40667-84a4-429e-93c5-3228425448de.png)

### 集群分区

可以将一部分实例划分为蔟（群组）

添加配置`spring.cloud.nacos.discovery.cluster-name=Group1`

尝试将用户服务的两个实例划分为两个Group

![img](.\img\2023-01-02-springcloud-nacos-note\1660838017770-204ce597-2fe7-4da7-a98e-7e02ab643d5c.png)

接着我们在借阅服务中开启nacos的负载均衡 `spring.cloud.loadbalancer.nacos.enabled=true`

开启后，借阅服务（在Group1中）中如果使用到用户服务，将优先调用同蔟的实例，若该蔟没有用户服务实例或者实例挂了，就会调用其他蔟的用户服务

如果同蔟中有多个用户服务实例，可以设置实例的权重`spring.cloud.nacos.discovery.weight=1` 权重默认为1 ，权重越大越优先调用

### 配置中心

在配置管理中添加一个用户服务的dev配置

![img](.\img\2023-01-02-springcloud-nacos-note\1660839099719-29b3e700-b1cc-46b8-b208-89ba46eae150.png)

在用户服务的pom文件添加依赖

```xml
 <dependency>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

添加新的配置文件`bootstrap.yml`

```xml
spring:
  application:
    name: "UserService"
  profiles:
    # 环境也是和配置文件保持一致
    active: dev
  cloud:
    nacos:
      config:
        # 配置文件后缀名
        file-extension: yaml
        # 配置中心服务器地址，也就是Nacos地址
        server-addr: localhost:8848
```

### 命名空间

我们还可以将配置文件或是服务实例划分到不同的命名空间中，区分开发、生产环境

![img](.\img\2023-01-02-springcloud-nacos-note\1660842149538-c1807d7e-d306-4689-9c38-be3875729d93.png)

给微服务添加配置`spring.cloud.nacos.discovery.namespace="dev-namespace"`可将服务从默认的public划分到dev命名空间

不同命名空间的服务不能相互调用

### 集群搭建

[官方文档](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)
