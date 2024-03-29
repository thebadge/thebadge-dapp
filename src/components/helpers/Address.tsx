import { useRouter } from 'next/router'
import { useState } from 'react'

import { Link, styled } from '@mui/material'
import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { WCAddress } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const Wrapper = styled('span')`
  align-items: center;
  column-gap: 8px;
  display: flex;
`

const ExternalLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400,
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
  address: WCAddress
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
  const { ensNameOrAddress, isEnsName } = useUserMetadata(address)

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
      <ExternalLink
        href={isUserAddress ? getProfileUrl() : getExplorerUrl(address)}
        target="_blank"
      >
        {userIdentifier}
      </ExternalLink>
      {showCopyButton && (
        <CopyButton onClick={() => copyAddress(address)}>
          <Copy />
        </CopyButton>
      )}
      {showExternalLink && (
        <ExternalLink href={getExplorerUrl(address)} target="_blank">
          <Link />
        </ExternalLink>
      )}
    </Wrapper>
  )
}
