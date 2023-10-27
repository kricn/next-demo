import { readdirSync } from 'fs'
import styles from './page.module.css'
import path from 'path'
import Waterfall from './components/Waterfall.tsx'


// 写一个瀑布流代码
export default function Home() {
  /** 读取images文件 */
  const images = readdirSync(path.join(process.cwd(), './public/images'), 'utf-8')
  const waterfallItems = images.map(
    (image, index) => ({
      src: `/images/${image}`,
      width: 0,
      height: 0
    })
  )
  return (
    <div>
      <Waterfall 
        items={waterfallItems}
        itemWidth={300}
        columns={3}
      />
    </div>
  )
}
