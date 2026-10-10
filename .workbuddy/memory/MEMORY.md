# cloud-reader 项目长期记忆

## 用户偏好 / 决策依据
- **平台选型以用户实测为准（2026-10-10）**：用户实测 Vercel 绑定自定义域名后，大陆访问速度优于 Cloudflare。讨论部署平台时不要再拿"CF 大陆更优"的通用结论反驳，他的实测优先。
- cloud-reader 已于 2026-10-10 从 CF Workers+D1 迁到 Vercel（Hono, api/[[...route]].ts）+ Turso（libsql, env: TURSO_DATABASE_URL/TURSO_AUTH_TOKEN）+ GitHub Actions 每小时刷新 RSS（.github/workflows/refresh.yml）。wrangler 仅保留做一次性 D1 数据导出（db:export-d1），数据迁完后可删。

## 环境坑（本机）
- 本沙盒中 **pnpm 增量安装经常半途失败**（ERR_PNPM_CODEBUDDY_BROKER_DENY，symlink ENOENT/EEXIST，每次断在不同包）。可靠解法：删光所有 node_modules 后一次全新 `pnpm install`（6-12s），不要反复重试增量。
- 本地 dev API 端口必须是 8787（packages/app/vite.config.ts proxy 目标）。
