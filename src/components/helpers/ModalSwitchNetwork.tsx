import { Box, Button, Card, Modal, ModalProps, styled } from '@mui/material'

import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(4),
}))

const NetworkButtons = styled(Box)(() => ({}))

type ModalSwitchNetwork = Omit<ModalProps, 'children'> & { onClose: () => void }

export const ModalSwitchNetwork: React.FC<ModalSwitchNetwork> = ({ onClose, ...restProps }) => {
  const { pushNetwork, setAppChainId } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <Modal onClose={onClose} title="Choose a network" {...restProps}>
      <CardContainer>
        <Card>
          <NetworkButtons>
            {chainOptions.map((item, index) => (
              <Button
                color="primary"
                key={index}
                onClick={() => {
                  setAppChainId(item.chainId)
                  pushNetwork({ chainId: item.chainIdHex })
                  onClose()
                }}
                variant="contained"
              >
                {item.name}
              </Button>
            ))}
          </NetworkButtons>
        </Card>
      </CardContainer>
    </Modal>
  )
}
