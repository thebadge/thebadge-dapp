import * as React from 'react'
import { ReactNode } from 'react'

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
          a: ({ ...props }) => (
            <a {...props} style={{ textDecoration: 'underline' }} target="_blank">
              {props.children}
            </a>
          ),
          li: ({ ...props }) => {
            const fixedProps = {
              ...props,
              ordered: props?.ordered?.toString(),
            }
            return (
              <li {...fixedProps} style={{ listStyleType: 'circle', marginLeft: '20px' }}>
                {props.children}
              </li>
            )
          },
          p: ({ ...props }) => (
            <p {...props} style={{ margin: 0 }}>
              {props.children}
            </p>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      />
    </Typography>
  )
}
