import { ReactNode } from 'react'
import * as React from 'react'

import { Typography, TypographyProps } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  textAlign?: TypographyProps['textAlign']
  variant?: TypographyProps['variant']
  width?: TypographyProps['width']

  color?: TypographyProps['color']
  sx?: TypographyProps['sx']
  children?: ReactNode | string
}
export default function MarkdownTypography({ children, ...rest }: Props) {
  // 👇	ReactMarkdown needs to have the children as a prop
  /* eslint-disable react/no-children-prop */
  return (
    <Typography component="div" {...rest}>
      {/* ReactMarkdown want it in this way  */}
      <ReactMarkdown
        children={children as string}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} style={{ textDecoration: 'underline' }} target="_blank">
              {props.children}
            </a>
          ),
          li: ({ node, ...props }) => (
            <li {...props} style={{ listStyleType: 'circle', marginLeft: '20px' }}>
              {props.children}
            </li>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      />
    </Typography>
  )
}
