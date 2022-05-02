// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React, { useRef } from 'react'
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import { useDrag } from 'react-use-gesture'
import { useSprings, animated } from 'react-spring'
import './styles.css'

// Returns fitting styles for dragged/idle items
const fn = (order, active, originalIndex, curIndex, x) => (index) => {
  // console.log('curr', curIndex)
  // console.log("og", originalIndex)
  const oIndex = order.indexOf(index)
  console.log(x)
  console.log('index', index)
  console.log('currIndex', curIndex)
  console.log('originalIndex', originalIndex) //the thing i just pressed
  console.log(index === originalIndex)
  const obj =
    active && index === originalIndex
      ? {
          x: curIndex * 100 + x,
          scale: 1.1,
          zIndex: oIndex + 4,
          shadow: 15,
          immediate: (n) => n === 'x' || n === 'zIndex'
        } // keys here will be immediate
      : {
          x: oIndex * 100,
          scale: 1,
          zIndex: oIndex,
          shadow: 1,
          immediate: (n) => n === 'zIndex',
          delay: 50
        }
  console.log(obj)
  return obj
}

function DraggableList({ items }) {
  console.log(items)
  const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  console.log(order)
  const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const bind = useDrag(({ args: [originalIndex], active, movement: [x] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * 100 + x) / 100), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)
    setSprings(fn(newOrder, active, originalIndex, curIndex, x)) // Feed springs new style data, they'll animate the view without causing a single render
    console.log('\n')
    if (!active) order.current = newOrder
  })

  return (
    <div className="content" style={{ width: items.length * 100 }}>
      {springs.map(({ zIndex, shadow, x, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            x,
            scale
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}

const cards = [
  {
    index: 0,
    value: '1S',
    link:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Playing_card_spade_A.svg/80px-Playing_card_spade_A.svg.png'
  },
  {
    index: 1,
    value: '2S',
    link:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Playing_card_spade_2.svg/80px-Playing_card_spade_2.svg.png'
  },
  {
    index: 2,
    value: '3S',
    link:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Playing_card_spade_3.svg/80px-Playing_card_spade_3.svg.png'
  },
  {
    index: 3,
    value: '4S',
    link:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Playing_card_spade_4.svg/80px-Playing_card_spade_4.svg.png'
  }
]

render(<DraggableList items={'Lorem ipsum dolor sit'.split(' ')} />, document.getElementById('root'))
