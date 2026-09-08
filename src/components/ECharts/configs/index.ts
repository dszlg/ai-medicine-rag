import * as echarts from 'echarts/core'
import { BarChart, LineChart, MapChart, PictorialBarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent,
  GeoComponent,
  VisualMapComponent,
  ToolboxComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
  MapSeriesOption,
  EffectScatterSeriesOption,
  PictorialBarSeriesOption
} from 'echarts/charts'
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  LegendComponentOption,
  GeoComponentOption,
  VisualMapComponentOption,
  ToolboxComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | MapSeriesOption
  | EffectScatterSeriesOption
  | PictorialBarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | GeoComponentOption
  | VisualMapComponentOption
  | ToolboxComponentOption
>

// 注册必须的组件
echarts.use([
  BarChart,
  LineChart,
  MapChart,
  PictorialBarChart,
  LabelLayout,
  PieChart,
  UniversalTransition,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GeoComponent,
  VisualMapComponent,
  ToolboxComponent
])

export default echarts
