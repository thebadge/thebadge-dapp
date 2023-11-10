import { useRouter } from 'next/router'
import { useState } from 'react'

import { styled } from '@mui/material'
import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { Link } from '@/src/components/assets/Link'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { useEnsReverseLookup } from '@/src/hooks/useEnsLookup'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { truncateStringInTheMiddle } from '@/src/utils/strings'

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

  &:hover {
    opacity: 0.7;
  }
`

interface Props {
  address: string
  showExternalLink?: boolean
  isUserAddress?: boolean
  showCopyButton?: boolean
  truncate?: boolean
}

export const Address: React.FC<Props> = ({
  address,
  isUserAddress = false,
  showCopyButton = true,
  showExternalLink = true,
  truncate = true,
  ...restProps
}) => {
  const router = useRouter()
  const { getExplorerUrl } = useWeb3Connection()
  const [toastId, setToastId] = useState('')
  const { ensNameOrAddress, isEnsName } = useEnsReverseLookup(address)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (t: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={'Address copied'} t={t} />
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    )
  }

  function getProfileUrl() {
    return router.basePath + generateProfileUrl({ address })
  }

  const displayAddress = truncate ? truncateStringInTheMiddle(address, 8, 6) : address
  const userIdentifier = isEnsName ? ensNameOrAddress : displayAddress
  return (
    <Wrapper {...restProps}>
      <ExternalLink href={isUserAddress ? getProfileUrl() : getExplorerUrl(address)}>
        {userIdentifier}
      </ExternalLink>
      {showCopyButton && (
        <CopyButton onClick={() => copyAddress(address)}>
          <Copy />
        </CopyButton>
      )}
      {showExternalLink && (
        <ExternalLink href={getExplorerUrl(address)}>
          <Link />
        </ExternalLink>
      )}
    </Wrapper>
  )
}
