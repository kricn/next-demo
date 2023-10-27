import { readdirSync } from 'fs'
import path from 'path'
import Waterfall from './components/Waterfall.tsx'


export default function Home() {
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
    <>
      <Waterfall 
        items={waterfallItems}
        itemWidth={300}
        columns={3}
      />
    </>
  )
}
