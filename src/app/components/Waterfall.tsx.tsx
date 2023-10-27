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

/** 底部预留高度，表示距离底部还剩多少距离时开始显示图片 */
const remainHeight = 50

/**
 * 瀑布流组件
 * 
 */
const Waterfall = (props: WaterfallProps) => {

  const { items, itemWidth, columns, rowGap = 10, colGap = 10 } = props;
  /** 图片信息数据 */
  const [images, setImages] = useState<WaterfallItem[]>([...items]);
  const initialized = useRef(false)

  /** 记录所有图片节点 */
  let imagesNodes: HTMLImageElement[] = []

  /** 记录瀑布流所有列的高度 */
  const columnsHeight = new Array(columns).fill(0);
  /** 记录当前哪一列的高度最小 */
  let minCol = 0;

  /** 判断一第图片是否在可视区内 */
  function isContain(dom: HTMLImageElement) {
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    const totalWidth = window.innerWidth || document.documentElement.clientWidth;
    // 当滚动条滚动时，top, left, bottom, right时刻会发生改变。
    const { top, right, left } = dom.getBoundingClientRect();
    return (top >= 0 && left >= 0 && right <= totalWidth && top <= totalHeight + remainHeight);
  }

  /** 
   * 页面滚动监听回调函数
   * 更新图片节点样式
   */
  function handleScroll() {
    for (let i = 0; i < imagesNodes.length; i++) {
      if (!images[i]) break ;
      const img = imagesNodes[i]
      if (images[i]?.hide) {
        images[i].hide = !isContain(img);
        setImages([...images])
      }
    }
  }
  
  /** 组件初始化 */
  useEffect(() => {
    if (initialized.current) {
      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
    };
    initialized.current = true;
    /** 记录所有节点 */
    imagesNodes = document.querySelectorAll('img') as any;
    /** 计算每张图片的位置 */
    for (let i = 0; i < imagesNodes.length; i++) {
      if (!images[i]) break ;
      const img = imagesNodes[i]
      images[i].height = img.height
      images[i].width = img.width
      img.style.left = (minCol * (itemWidth + colGap)) + 'px'
      const minHeight = columnsHeight[minCol]
      img.style.top = minHeight + rowGap + 'px'
      // 更新当前列的高度
      columnsHeight[minCol] += img.height + rowGap
      // 更新最小列
      minCol = columnsHeight.indexOf(Math.min(...columnsHeight))
      /** 更新每一张图片信息 */
      setImages([...images])
    }
    /** 初始化时监听页面滚动 */
    document.addEventListener('scroll', handleScroll)
    /** 刚开始时，自动调用一次滚动函数 */
    handleScroll()
  }, [])

  return (
    <div className={styles.container}>
      {
        images.map((img, index) => (
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