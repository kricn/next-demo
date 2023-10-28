import { readdirSync } from 'fs'
import path from 'path'
import styles from './page.module.css'
import Waterfall from './components/Waterfall.tsx'

/** 图片信息 */
export interface WaterfallItem {
  src: string
  width: number
  height: number
  hide: boolean
}

/** 瀑布流组件props */
export interface WaterfallProps {
 items: WaterfallItem[]
 /** 每一项的宽度 */
 itemWidth: number
 /** 列数 */
 columns: number
 rowGap?: number
 colGap?: number
}

export default function Home(
//   {waterfallItems}: {
//   waterfallItems: WaterfallItem[]
// }
) {

  /** 读取images文件 */
  const images = readdirSync(path.join(process.cwd(), './public/images'), 'utf-8')
  /** 构建瀑布流组件需要的数据 */
  const waterfallItems = images.map(
    (image, index) => ({
      src: `/images/${image}`,
      width: 0,
      height: 0,
      hide: true
    })
  )

  return (
    <div className={styles.container}>
      <Waterfall 
        items={waterfallItems}
        itemWidth={300}
        columns={3}
      />
    </div>
  )
}