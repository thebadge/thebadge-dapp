import { DOMAttributes, HTMLAttributes } from 'react'

import { Box, styled } from '@mui/material'

import { Spinner, SpinnerProps } from '@/src/components/loading/Spinner'

const Wrapper = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
`

const Text = styled('p')`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.4rem;
  line-height: 1.2;
  margin: 0;
  padding-top: 15px;
  text-align: center;
  width: 100%;
`

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  text?: string
}

export const Loading: React.FC<Props & SpinnerProps> = ({
  color = 'primary',
  text = 'Loading...',
  ...restProps
}) => (
  <Wrapper {...restProps}>
    <Spinner color={color} />
    <Text> {text}</Text>
  </Wrapper>
)
