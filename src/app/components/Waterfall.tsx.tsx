'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './waterfall.module.scss'

/** 图片信息 */
interface WaterfallItem {
  src: string
  width: number
  height: number
  hide: boolean
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

  function isContain(dom: HTMLElement) {
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    const totalWidth = window.innerWidth || document.documentElement.clientWidth;
    // 当滚动条滚动时，top, left, bottom, right时刻会发生改变。
    const { top, right, bottom, left } = dom.getBoundingClientRect();
    console.log(dom)
    console.log(dom.getBoundingClientRect())
    return (top >= 0 && left >= 0 && right <= totalWidth && bottom <= totalHeight);
  }

  function handleScroll() {
    const imgs = document.querySelectorAll('img');
    for (let i = 0; i < imgs.length; i++) {
      console.log(items[i])
      if (!items[i] || !items[i]?.hide) break ;
      const img = imgs[i]
      items[i].hide = !isContain(img);
    }
  }
  
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
    document.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      document.removeEventListener('scroll', handleScroll)
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
            className={`${styles.img} ${img.hide ? styles.hide : ''}`}
            id={`img-${index}`}
          />
        ))
      }
    </div>
  )
};

export default Waterfall;