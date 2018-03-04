# 介绍
使用工具来辅助提升代码质量已经成为软件开发过程中的必备流程，然而数量繁多的工具，复杂的配置流程却会花费开发人员大量时间。

frn-cli是一个用于创建crn/npm项目的命令行工具，并自动为项目集成babel，commitizen，tslint，typescript，jest，es6-plato等代码质量工具，提高工程师的开发效率。

# 安装
```
npm install -g frn-cli
npm install -g commitizen
npm install -g es6-plato
```

# 使用
## frn-cli init
新建项目或在已有项目上初始化crn/npm项目，安装依赖并添加配置。

```
frn-cli init [options] <projectName>

Options:

    -n, --npm          创建一个普通的npm package（默认创建crn项目）
    -r, --redux        创建redux项目，该选项只在创建CRN项目时有效，使用该选项会额外安装redux，react-redux依赖，并创建适合redux项目的目录结构
    -e, --exist        在已有项目中写入配置（默认新建一个项目）
    -A, --no-override  在已有项目中写入配置时，不覆写已有配置
    -t, --taobao       使用淘宝npm源安装依赖，这会加快依赖的安装速度
    -v, --verbose      展示详细日志
    -q, --silent       隐藏非关键日志
    -h, --help         output usage information
```

# 其他
## 使用commitizen
[commitizen github](https://github.com/commitizen/cz-cli)，commitizen用于规范git commit格式，通过`git cz`命令使用。

# 命令
初始化项目成功后，frn-cli在`package.json`中写入了若干命令，可以通过`npm run <script>`方式调用。

* test：通过`npm run test`使用，运行测试用例。
* tsc：通过`npm run tsc`使用，编译ts代码。
* tsw：通过`npm run tsw`使用，编译ts代码并watch。
* lint：通过`npm run lint`使用，运行tslint检查代码。
* tsdiagnosis：通过`npm run tsdianosis`使用，运行tsc检查ts代码语法。
* check：通过`npm run check`使用，等同于运行`npm run lint`和`npm run tsdianosis`命令。
* plato：通过`npm run plato`使用，运行es6-plato检查代码可维护性。