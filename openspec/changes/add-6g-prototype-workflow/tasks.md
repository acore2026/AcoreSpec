## 1. 样机 Schema

- [x] 1.1 新增 `prototype-driven` schema 和八类 artifact 模板
- [x] 1.2 增加 schema 解析、依赖顺序和 apply context 测试
- [x] 1.3 验证模板对 Windows 与 Unix 命令、路径和设备信息的表达

## 2. 样机动作

- [x] 2.1 实现 survey 的 skill 与 command 模板
- [x] 2.2 实现 integrate 的 skill 与 command 模板
- [x] 2.3 实现 rehearse 的 skill 与 command 模板
- [x] 2.4 实现 demo 的 skill 与 command 模板
- [x] 2.5 将四个动作登记到生成、检测、清理和 drift 检查的显式列表
- [x] 2.6 增加动作生成与关键安全约束测试

## 3. Prototype Profile

- [x] 3.1 新增 `prototype` profile 和固定 workflow 集合
- [x] 3.2 支持 `openspec config profile prototype`
- [x] 3.3 支持 `openspec init --profile prototype`
- [x] 3.4 增加 profile 选择、init 生成和 update 同步测试

## 4. 文档与发布

- [x] 4.1 编写 6G 样机工作流指南和端到端示例
- [x] 4.2 更新 README、命令、工作流、CLI 和工具支持文档
- [x] 4.3 添加用户可见变更的 changeset

## 5. 验证

- [x] 5.1 运行 schema、profile、生成器和 init/update 聚焦测试
- [x] 5.2 运行 TypeScript 类型检查和 build
- [x] 5.3 运行全量测试和 lint

验证记录：

- 聚焦测试：7 个测试文件、132 个测试通过。
- `tsc --noEmit`、build、lint、schema 校验和 change strict 校验通过。
- 全量测试：72 个测试文件、1463 个测试通过；26 个失败均来自以 root
  运行时权限断言失效，或宿主机已有 `.oh-my-zsh` 干扰补全安装器的隔离假设，
  与本变更涉及的 schema、profile、模板生成和 init/update 路径无关。
