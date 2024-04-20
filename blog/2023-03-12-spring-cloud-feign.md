---
slug: spring-cloud-feign
title: Feign 远程调用
author: Arce
author_title: 独立游戏开发者
author_url: https://github.com/charles0122
author_image_url: https://avatars.githubusercontent.com/u/70085736?v=4
description: 测试
tags: [SpringCloud, Java]
activityId: 相关动态 ID
bvid: 相关视频 ID（与 activityId 2选一）
oid: oid
---





[OpenFeign官方文档](https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/)
Feign和RestTemplate一样，也是HTTP客户端请求工具，但是它的使用方式更加便捷。
在需要使用Feign的服务中添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```
<!-- truncate -->

在启动类添加注解 `@EnableFeignClients`
创建需要的Client

``` java
@FeignClient("UserService")   //声明为 UserService 服务的HTTP请求客户端
public interface UserClient {
    //路径保证和微服务提供的一致即可
    @GetMapping("/users/{uid}")
    User getUserById(@PathVariable("uid") int uid);
}
```

``` java
@FeignClient("BookService")
public interface BookClient {
    @GetMapping("/books/{bid}")
    Book getBookById(@PathVariable int bid);
}
```

修改之前使用Rest Template的服务

```java
@Service
public class BorrowServiceImpl implements BorrowService {
    @Resource
    private BorrowMapper borrowMapper;
    @Resource
    UserClient userClient;
    @Resource
    BookClient bookClient;
    @Override
    public UserBorrowDetail getUserBorrowDetailByUid(int uid) {
        List<Borrow> borrowsByUid = borrowMapper.getBorrowsByUid(uid);
        User user = userClient.getUserById(uid);
        List<Book> bookList = borrowsByUid
            .stream()
            .map(borrow -> bookClient.getBookById(borrow.getBid()))
            .collect(Collectors.toList());
        return new UserBorrowDetail(user,bookList);
    }
}
```
