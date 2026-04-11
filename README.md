# 考研 22408 备考计划表

面向 **22408（408 计算机学科专业基础）** 考生的 Web 端备考计划工具：管理日程与任务、查看进度与统计，数据保存在浏览器本地（刷新不丢失）。

详细需求、阶段规划与数据模型见根目录 **[PRD.md](./PRD.md)**。

## 仓库结构

| 路径 | 说明 |
|------|------|
| `PRD.md` | 产品需求文档（目标院校、时间线、功能与数据模型等） |
| `kaoyan-planner/` | 前端应用（Vite + React + TypeScript） |

## 技术栈

- **构建**：Vite 8、TypeScript  
- **界面**：React 19、React Router 7、Tailwind CSS v4  
- **状态**：Zustand（持久化到 `localStorage`）  
- **图表**：Recharts  
- **PWA**：`vite-plugin-pwa`（可安装、离线缓存按配置生效）

## 本地开发

需要 **Node.js**（建议当前 LTS）。

```bash
cd kaoyan-planner
npm install
npm run dev
```

浏览器访问终端里提示的本地地址（一般为 `http://localhost:5173`）。

### 其他命令

```bash
npm run build    # 类型检查 + 生产构建，输出 dist/
npm run preview  # 本地预览构建结果
npm run lint     # ESLint
```

## 部署说明（如 Vercel）

若仓库根目录为 **`new_planner`**，请在托管平台将 **Root Directory** 设为 **`kaoyan-planner`**，构建命令 `npm run build`，输出目录 `dist`。项目内已包含适用于 SPA 的路由重写配置（`kaoyan-planner/vercel.json`）。

## 许可证

若未另行声明，以仓库内 LICENSE 为准；暂无 LICENSE 时仅作个人学习使用。
