import { useState } from 'react'

import { styled } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { Link } from '@/src/components/assets/Link'
import { ToastComponent } from '@/src/components/toast/ToastComponent'

const Wrapper = styled('span')(({ theme }) => ({
  alignItems: 'center',
  columnGap: theme.spacing(1),
  display: 'flex',
}))

const ExternalLink = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: '400',
  lineHeight: '133%',
  fontSize: '14px',
  textDecoration: 'underline',
  '&:hover': {
    textDecoration: 'none',
  },
  '&:active': {
    opacity: 0.7,
  },
}))

const CopyButton = styled('button')(() => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,

  '&:active': {
    opacity: 0.7,
  },
}))

ExternalLink.defaultProps = {
  className: 'externalLink',
  rel: 'noopener noreferrer',
  target: '_blank',
}

interface Props {
  href: string
  label: string
  showExternalLink?: boolean
  showCopyButton?: boolean
}

const ExternalLinkComponent: React.FC<Props> = ({
  href,
  label,
  showCopyButton = true,
  showExternalLink = true,
  ...restProps
}) => {
  const { t } = useTranslation()
  const [toastId, setToastId] = useState('')

  const copyExternalLink = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (toast: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={t('externalLink.copied')} t={toast} />
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    )
  }

  return (
    <Wrapper {...restProps}>
      <ExternalLink href={href}>{label}</ExternalLink>
      {showCopyButton && (
        <CopyButton onClick={() => copyExternalLink(label)}>
          <Copy />
        </CopyButton>
      )}
      {showExternalLink && (
        <ExternalLink href={href}>
          <Link />
        </ExternalLink>
      )}
    </Wrapper>
  )
}

export default ExternalLinkComponent
