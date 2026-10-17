# 私有仓库保存记录

日期：2026-10-18。前端与后端保持独立，保留 .git、MIT 许可证和上游署名。

原 master 分支/历史保留本机；codex/github-save 是清理后文件树的独立根快照，用于避免上传旧演示 JWT、历史凭据候选和个人提交邮箱。原 origin 仍为原作者 Gitee，未推送。修改前 history.bundle、index.zip、worktree.zip 和补丁在本机私有备份目录，完整说明见后端 docs/publication-status.md。

本轮保留楼宇/房间/学生的 API 与页面，整理 README、公开环境配置和忽略规则；移除默认上游部署目标，将 Mock JWT 替换为明确无效的演示字符串。没有开发住宿或 Agent。前端 VITE_* 只能放公开配置，模型/数据库/JWT签名秘密只能放后端。

完整构建通过；5份后端公开 YAML 解析和部署脚本语法验证通过。数据库 CRUD 与浏览器业务联调仍未验证。提交内容经过逐文件清单审查，不包含 node_modules、dist、日志或私有本地覆盖配置。

**GitHub 未保存完成**：当前未找到 gh CLI，无法核实登录身份，所以未创建 smart-dorm-frontend 私有仓库，也未添加 personal 远程/推送。没有可确认的仓库链接；Git user.name 不是 GitHub 登录证明。

安装 GitHub CLI 并在本机完成 `gh auth login --hostname github.com --git-protocol https` 后，可从本仓库运行：

```powershell
& D:\JavaProjects\youlai-boot\scripts\publish-private.ps1 -RepoName smart-dorm-frontend
```

守卫脚本要求当前分支 codex/github-save、工作区干净、通过快照审计，使用实际登录账号作为 owner，只创建私有空仓库；发现同名仓库则停止核实用途，不覆盖。保留 origin，使用 personal 远程，不使用 force push，不推送旧标签/全部分支。脚本未在真实账号上执行；成功后再记录真实链接与远程提交号。
