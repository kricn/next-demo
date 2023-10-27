'use client'
import { useEffect, useRef } from 'react'
import styles from './waterfall.module.scss'

/** 图片信息 */
interface WaterfallItem {
  src: string
  width: number
  height: number
}

/** 瀑布流组件props */
interface WaterfallProps {
 items: WaterfallItem[]
 /** 每一项的宽度 */
 itemWidth: number
 /** 列数 */
 columns: number
 rowGap?: number
 colGap?: number
}


const Waterfall = (props: WaterfallProps) => {

  const { items, itemWidth, columns, rowGap = 10, colGap = 10 } = props;
  const initialized = useRef(false)

  const columnsHeight = new Array(columns).fill(0);
  let minCol = 0;
  
  useEffect(() => {
    if (initialized.current) return ;
    initialized.current = true;
    const imgs = document.querySelectorAll('img');
    for (let i = 0; i < imgs.length; i++) {
      if (!items[i]) break ;
      const img = imgs[i]
      items[i].height = img.height
      items[i].width = img.width
      img.style.left = (minCol * (itemWidth + colGap)) + 'px'
      const minHeight = columnsHeight[minCol]
      img.style.top = minHeight + rowGap + 'px'
      // 更新当前列的高度
      columnsHeight[minCol] += img.height + rowGap
      // 更新最小列
      minCol = columnsHeight.indexOf(Math.min(...columnsHeight))
    }
  }, [])

  return (
    <div className={styles.container}>
      {
        items.map((img, index) => (
          <img 
            key={index}
            src={img.src} 
            width={itemWidth} 
            className={styles.img}
            id={`img-${index}`}
          />
        ))
      }
    </div>
  )
};

export default Waterfall;