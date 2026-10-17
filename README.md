# 智慧校舍管理系统 · 前端

Java 后端求职个人项目的 Vue 管理端。基于 [有来开源组织 vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) 二次开发，保留 [MIT 许可证](LICENSE)、PanJiaChen 与有来开源组织署名。后端独立维护，计划个人仓库名 smart-dorm-backend。

## 实际进度

楼宇、房间、学生已有页面、真实 API 调用及操作按钮权限；后端12项接口权限已补齐。完整数据库 CRUD 联调仍未验证。住宿只有后端数据库结构，没有对应入住/退宿页面或事务；没有 Agent。mock 目录是上游演示数据，不是实际学生/住宿数据，默认开发环境不启用。

## 环境与启动

Vue3、TypeScript、Vite、Element Plus、Pinia。Node 要求 `^20.19.0 || >=22.12.0`，本机使用24.11.1；使用 pnpm 和 pnpm-lock.yaml。

```sh
pnpm install --frozen-lockfile
pnpm run type-check
pnpm run build
pnpm run dev
```

默认开发地址为本机3000；后端需先按其 SQL 文档初始化独立数据库、配置 Redis 和本地管理员。没有随项目提供通用账号密码。页面路由由后端菜单返回，只有页面文件不代表菜单已配置。

## 公开配置与秘密边界

`.env.development`、`.env.production` 只包含可公开的前端配置，示例见 `.env.example`。个性化覆盖放 `.env.development.local`（已忽略）。

| 配置 | 用途 |
| --- | --- |
| VITE_APP_TITLE | 页面标题 |
| VITE_APP_PORT | 开发服务端口，默认3000 |
| VITE_APP_BASE_API | 开发 /dev-api，生产 /prod-api；生产需自行配置反向代理 |
| VITE_APP_API_URL | Vite 开发代理目标，本机8000；不是生产托管地址 |
| VITE_MOCK_DEV_SERVER | 默认 false；演示 Mock 不代表业务联调通过 |

**所有 VITE_* 都可能进入浏览器产物，不是秘密存储。** 数据库密码、JWT签名密钥、云凭据及未来模型密钥只能保存在后端。不要填写任何模型密钥到此仓库。

## 权限和验证

新增/编辑/删除按钮使用现有 v-has-perm。实际安全边界在后端，隐藏按钮不能防止直接调用。非 ROOT 角色需要配置 biz:building、biz:room、biz:student 下的 list/create/update/delete 精确权限，房间页还需要 building:list。仓库不会自动给普通用户授权。

最近验证：vue-tsc、完整构建通过；构建产物本机预览 HTTP 200。没有完成浏览器端到端 CRUD 验证。已修复房间下拉框缺失主键导致的构建错误；仍有分页/表单边角问题，详见后端 docs/project-status.md。

部署脚本没有默认服务器，不再指向上游作者主机。先构建，再显式设置 DEPLOY_HOST、DEPLOY_USER、DEPLOY_PORT、DEPLOY_TARGET，才可运行 `pnpm run deploy`；SSH 私钥留在操作系统中，主机校验保持开启。本轮没有部署网站。

## 保存状态

原 origin 保持指向上游 Gitee，禁止推送；准备发布的分支为 codex/github-save，仅包含清理后的快照，原历史保留本机。计划私有 GitHub 仓库名 smart-dorm-frontend；当前未找到 GitHub CLI，尚未创建/推送。准确状态与剩余命令见 [保存记录](docs/publication-status.md)。
