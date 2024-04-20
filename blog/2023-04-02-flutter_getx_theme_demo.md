---
slug: flutter_getx_theme_demo
title: flutter getx 多主题 包含深色模式
author: Arce
author_title: 独立游戏开发者
author_url: https://github.com/charles0122
author_image_url: https://avatars.githubusercontent.com/u/70085736?v=4
description: flutter getx 多主题 包含深色模式
tags: [Dart,Flutter,Getx,Theme]
---

<div style={{textAlign: 'center'}}>

![flutter_theme_getx](img/2023-04-02-flutter_getx_theme_demo/flutter_theme_getx.gif#pic_center)

</div>

思路：使用Getx的 changeThemeMode /  forceAppUpdate  和 缓存

<!-- truncate -->

:::caution 注意
 界面代码参考其他博客和项目

[Allpass: Allpass是一款简洁的私密信息管理工具，包括密码管理与卡片信息管理，支持指纹解锁软件、csv导入导出、从Chrome中导入、从剪贴板中导入、文件夹与标签功能、收藏与备注功能、密码生成器、WebDAV同步等功能，采用Flutter构建 (gitee.com)](https://gitee.com/sunyongsheng/Allpass?_from=gitee_search)

[Flutter主题适配与自动切换暗色模式 - 掘金 (juejin.cn)](https://juejin.cn/post/6861889467188412423)

[Flutter 多语言&多主题实现 - 简书 (jianshu.com)](https://www.jianshu.com/p/5b750b05b441)

:::

## 原理分析

获取缓存中的 主题模式STORAGE_THEME_MODE  主题色 STORAGE_THEME_COLOR 在 ThemeStore的初始化进行赋值 然后在 ThemeService 初始化的时候去转化再赋值  当然也可以减少ThemeService 层的操作 直接从ThemeStore 层进行

## 案例代码

GetMaterialApp

```dart
GetMaterialApp(
    title: "Arce App",
    // ... 其它配置
    theme: ThemeService.to.lightTheme,
    darkTheme: ThemeService.to.darkTheme,
    themeMode: ThemeService.to.themeMode,
    // ...
);
```

核心代码文件 ThemeStore

```dart
class ThemeStore extends GetxController {
  static ThemeStore get to => Get.find();
  final _themeMode = ThemeMode.light.obs;
  final _primaryColor = PrimaryColor.blue.obs;

  @override
  void onInit() {
    super.onInit();
    _themeMode.value = ThemeModes.tryParse(StorageService.to.getString(STORAGE_THEME_MODE)) ?? ThemeMode.light;
    _primaryColor.value = PrimaryColors.tryParse(StorageService.to.getString(STORAGE_THEME_COLOR)) ?? PrimaryColor.blue;
    print("初始化主题和颜色${StorageService.to.getString(STORAGE_THEME_MODE)} , ${StorageService.to.getString(STORAGE_THEME_COLOR)}");
  }

  ThemeMode getThemeMode(){
    return _themeMode.value;
  }

  PrimaryColor getPrimaryColor(){
    return _primaryColor.value;
  }

  // 获取token
  Future<void> setThemeMode(ThemeMode value) async{
    await StorageService.to.setString(STORAGE_THEME_MODE,value.name);
    print("_themeMode "+ value.toString());
    _themeMode.value = value;
  }


  Future<void> setPrimaryColor(PrimaryColor value) async{
    await StorageService.to.setString(STORAGE_THEME_COLOR,value.name);

    print("_primaryColor "+ value.toString());
    _primaryColor.value = value;
  }
}
```

核心代码文件 ThemeService

```dart
class ThemeService extends GetxService {
  static ThemeService get to => Get.find();

  Future<ThemeService> init() async {
    _allTheme = ArceAllTheme();
    primaryColor = ThemeStore.to.getPrimaryColor();
    lightTheme = _convertTheme(primaryColor, false);
    darkTheme = _convertTheme(primaryColor, true);
    themeMode = ThemeStore.to.getThemeMode();
    return this;
  }

  late ThemeMode themeMode; // 浅色 / 深色 / 跟随系统
  late ThemeData lightTheme; // 浅色模式下的主题
  late ThemeData darkTheme; // 暗色模式下的主题
  late ArceAllTheme _allTheme; // 主题模式
  late PrimaryColor primaryColor;

  /// 特殊的背景颜色
  /// 少部分页面背景颜色为浅白色
  late Color specialBackgroundColor;
  late Color offstageColor;

  Future<void> changeThemeMode(ThemeMode targetMode, Brightness platformBrightness) async {
    await ThemeStore.to.setThemeMode(targetMode);
    themeMode = targetMode;
    setExtraColor(platformBrightness);
  }

  Future<void> changePrimaryColor(PrimaryColor color, Brightness platformBrightness) async {
    primaryColor = color;
    await ThemeStore.to.setPrimaryColor(color);
    lightTheme = _convertTheme(color, false);
    darkTheme = _convertTheme(color, true);
    setExtraColor(platformBrightness);
  }

  ThemeData _convertTheme(PrimaryColor color, bool dark) {
    switch (color) {
      case PrimaryColor.blue:
        return _allTheme.blueTheme(dark);
      default:
        return _allTheme.blueTheme(dark);
    }
  }

  void setExtraColor(Brightness platformBrightness) {
    if (themeMode == ThemeMode.system) {
      _setExtraColorAuto(platformBrightness);
    } else if (themeMode == ThemeMode.dark) {
      _setExtraColorDarkMode();
    } else {
      _setExtraColorLightMode();
    }
    // notifyListeners();
    // Get.changeTheme( lightTheme);

    print("主题为修改 "+ themeMode.toString());
    // (()async{Get.changeThemeMode(themeMode);})();  // 好像有异步问题 数据更新了，但是ui层未更新
    // 强制build
    Get.forceAppUpdate();
  }

  void _setExtraColorLightMode() {
    specialBackgroundColor = Color.fromRGBO(245, 246, 250, 1);
    offstageColor = Colors.black87;
  }

  void _setExtraColorDarkMode() {
    specialBackgroundColor = Colors.black;
    offstageColor = Colors.grey[600]!;
  }

  void _setExtraColorAuto(Brightness platformBrightness) {
    if (platformBrightness == Brightness.dark) {
      _setExtraColorDarkMode();
    } else {
      _setExtraColorLightMode();
    }
  }
}
```

ArceAllTheme文件存放中 主题数据

```dart
/// 主题
class ArceAllTheme {
    /// ... 其他主题
    /// 默认主题
 ThemeData defaultTheme({required MaterialColor mainColor}) {
        return ThemeData(
          primaryColor: mainColor,
          primarySwatch: mainColor,
          floatingActionButtonTheme: const FloatingActionButtonThemeData(
            foregroundColor: Colors.white,
          ),
          appBarTheme: const AppBarTheme(
            systemOverlayStyle: SystemUiOverlayStyle.dark,
            iconTheme: IconThemeData(color: Colors.black),
            elevation: 0,
            color: Colors.white,
            titleTextStyle: TextStyle(color: Colors.black),
          ),
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            elevation: 0,
            selectedItemColor: mainColor,
            backgroundColor: Colors.white,
            unselectedItemColor: Colors.grey,
          ),
          scaffoldBackgroundColor: Colors.white,
          buttonTheme: const ButtonThemeData(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
            ),
          ),
          textButtonTheme: TextButtonThemeData(
            style: ButtonStyle(
              foregroundColor: MaterialStateProperty.all(Colors.black),
              backgroundColor: MaterialStateProperty.all(Colors.transparent),
              alignment: Alignment.center,
              shape: MaterialStateProperty.all(
                const RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(8.0)),
                ),
              ),
            ),
          ),
          indicatorColor: mainColor,
          textSelectionTheme: TextSelectionThemeData(cursorColor: mainColor),
          cardTheme: const CardTheme(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
            ),
            elevation: 0,
            clipBehavior: Clip.antiAlias,
          ),
          inputDecorationTheme: const InputDecorationTheme(
            fillColor: Color.fromRGBO(245, 246, 250, 1),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
              borderSide: BorderSide.none,
            ),
          ),
          dialogTheme: const DialogTheme(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
            ),
          ),
          bottomSheetTheme: const BottomSheetThemeData(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(8.0), topRight: Radius.circular(8.0)),
            ),
          ),
          popupMenuTheme: const PopupMenuThemeData(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8.0)),
            ),
          ),
          listTileTheme: const ListTileThemeData(minLeadingWidth: 32),
        );
      }
}
```

主题模式 ThemeMode相关

```dart
class ThemeModes {
  static ThemeMode? tryParse(String? name) {
    if (name == ThemeMode.light.name) {
      return ThemeMode.light;
    } else if (name == ThemeMode.dark.name) {
      return ThemeMode.dark;
    } else if (name == ThemeMode.system.name) {
      return ThemeMode.system;
    }
    return null;
  }
}

class ThemeModeItem {
  final ThemeMode mode;
  final String desc;

  const ThemeModeItem(this.mode, this.desc);
}

var themeModes = [
  const ThemeModeItem(ThemeMode.system, "跟随系统"),
  const ThemeModeItem(ThemeMode.light, "浅色"),
  const ThemeModeItem(ThemeMode.dark, "深色")
];
```

主题色  PrimaryColor 相关

```dart

enum PrimaryColor { blue, blueGrey }

class PrimaryColors {
  static PrimaryColor? tryParse(String? name) {
    for (var color in PrimaryColor.values) {
      if (color.name == name) {
        return color;
      }
    }
    return null;
  }
}

class PrimaryColorItem {
  final PrimaryColor primaryColor;
  final String desc;
  final Color color;
  const PrimaryColorItem(this.primaryColor, this.desc, this.color);
}

var primaryColors = [
  const PrimaryColorItem(PrimaryColor.blue, "蓝色", Colors.blue),
  const PrimaryColorItem(PrimaryColor.blueGrey, "蓝灰", Colors.blueGrey),
];

```

总结：Get中好像只有 changeThemeMode 的方法 所以有一个不好的地方是切换主题颜色后需要调用 Get.forceAppUpdate() 方法才有效果，如果不希望用户频繁的调用 forceAppUpdate方法，可以加一层防抖代码，也可以在setThemeMode方法中用changeThemeMode方法 ，在setPrimaryColor方法中调用forceAppUpdate方法
