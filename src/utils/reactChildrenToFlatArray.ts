import React, { Children } from 'react'

const getChildrenType = (node: React.ReactNode) => {
  if (node === null) return 'null'
  if (Array.isArray(node)) return 'array'
  if (typeof node === 'object') return 'object'
  return 'string'
}

const getElemType = (elem: any) => {
  if (typeof elem === 'string') return 'string'
  if (elem.props.children === undefined) return 'void'
  return 'normal'
}

const reactChildrenToFlatArray = (children: React.ReactNode) => {
  return Children.toArray(children).map((child) => {
    switch (
      getElemType(child) // Check node type
    ) {
      case 'void': // e.g. <br /> <img />
      case 'string': // normal text
        return child
      case 'normal': // any other html tag or component
        switch (
          getChildrenType((child as React.ReactElement).props.children) // Check node content
        ) {
          case 'null': // e.g. <Elem>null</Elem>
          case 'string': // e.g <Elem>foo</Elem>
          case 'object': // e.g. <Elem><Foo /></Elem>
            return child
          case 'array': // multiple children
            reactChildrenToFlatArray((child as React.ReactElement).props.children)
            break
          default:
            return child
        }
        break
      default:
        return child
    }
    return child
  })
}

export default reactChildrenToFlatArray
