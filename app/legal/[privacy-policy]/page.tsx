import React from 'react'

import { MDXProvider } from '@mdx-js/react'
import { Container, ListItem, MenuList, Typography } from '@mui/material'
import { MDXComponents } from 'mdx/types'

import PrivacyPolicyMd from '@/markdown/en/privacy.md'

const components: MDXComponents = {
  h1: (props: any) => <Typography {...props} component="h1" variant="h2" />,
  h2: (props: any) => <Typography {...props} component="h2" mt={2} variant="h5" />,
  h3: (props: any) => <Typography {...props} component="h3" mt={2} variant="h6" />,
  h4: (props: any) => <Typography {...props} component="h4" mt={2} variant="subtitle2" />,
  h6: (props: any) => (
    <Typography
      {...props}
      component="p"
      mt={2}
      sx={{ textDecoration: 'underline' }}
      variant="subtitle2"
    />
  ),
  p: (props: any) => <Typography {...props} component="p" mt={2} variant="body4" />,
  li: (props: any) => (
    <ListItem>
      <Typography {...props} variant="body4" />
    </ListItem>
  ),
  ol: (props: any) => <MenuList {...props} />,
  ul: (props: any) => <MenuList {...props} />,
}

export default function PrivacyPolicyPage() {
  return (
    <Container fixed>
      <MDXProvider components={components}>
        <PrivacyPolicyMd />
      </MDXProvider>
    </Container>
  )
}
