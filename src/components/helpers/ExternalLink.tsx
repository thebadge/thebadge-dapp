import { useState } from 'react'

import { styled } from '@mui/material'
import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { Link } from '@/src/components/assets/Link'
import { ToastComponent } from '@/src/components/toast/ToastComponent'

const Wrapper = styled('span')`
  align-items: center;
  column-gap: 8px;
  display: flex;
`

const ExternalLink = styled('a')`
  color: ${({ theme: { palette } }) => palette.text.primary};
  font-weight: 400;
  line-height: 133%;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  &:active {
    opacity: 0.7;
  }
`

ExternalLink.defaultProps = {
  className: 'externalLink',
  rel: 'noopener noreferrer',
  target: '_blank',
}

const CopyButton = styled('button')`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:active {
    opacity: 0.7;
  }
`

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
  const [toastId, setToastId] = useState('')

  const copyExternalLink = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (t: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={'ExternalLink copied'} t={t} />
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
