import { ReactNode } from 'react'

import { Alert, AlertTitle, IconButton, Typography, styled } from '@mui/material'
import { Toast, toast } from 'react-hot-toast'

import { Close } from '@/src/components/assets/Close'

const Link = styled('a')`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.2rem;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export const ToastComponent: React.FC<{
  icon?: ReactNode
  link?: {
    url: string
    text: string
  }
  message?: string
  t: Toast
  title?: string
}> = ({ icon, link, message, t, title }) => (
  <Alert
    action={
      <IconButton aria-label="Closes toast" component="label" onClick={() => toast.remove(t.id)}>
        <Close />
      </IconButton>
    }
    icon={icon}
    severity="info"
    sx={{ background: 'background.default' }}
  >
    {title && <AlertTitle>{title}</AlertTitle>}
    {message && (
      <Typography component={'div'} variant="body4">
        {message}
      </Typography>
    )}
    {link && (
      <Link href={link.url} rel="noreferrer" target="_blank">
        {link.text}
      </Link>
    )}
  </Alert>
)
