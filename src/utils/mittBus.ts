// src/utils/eventBus.ts
import mitt, { type Emitter } from 'mitt'

// 定义事件类型（TS 专属，非 TS 可省略）
// 格式：{ 事件名: 事件参数类型 }
type EmitterEvents = {
  // 打开样式抽屉
  'open-drawer': void
  'user-login': { id: string; name: string }
}

// 创建 mitt 实例（指定 Events 类型，TS 会校验事件名和参数）
const emitter: Emitter<EmitterEvents> = mitt<EmitterEvents>()

// 导出实例，供其他组件使用
export default emitter
