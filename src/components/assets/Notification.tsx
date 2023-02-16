import { HTMLAttributes } from 'react'

import { styled } from '@mui/material'

const Wrapper = styled('svg')`
  .fill {
    fill: ${({ theme: { palette } }) => palette.text.primary};
  }
`

export const Notification: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`notification ${className}`}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M5 19C4.71667 19 4.479 18.904 4.287 18.712C4.09567 18.5207 4 18.2833 4 18C4 17.7167 4.09567 17.4793 4.287 17.288C4.479 17.096 4.71667 17 5 17H6V10C6 8.61667 6.41667 7.38733 7.25 6.312C8.08333 5.23733 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.646 2.72933 10.938 2.438C11.2293 2.146 11.5833 2 12 2C12.4167 2 12.7707 2.146 13.062 2.438C13.354 2.72933 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.23733 16.75 6.312C17.5833 7.38733 18 8.61667 18 10V17H19C19.2833 17 19.5207 17.096 19.712 17.288C19.904 17.4793 20 17.7167 20 18C20 18.2833 19.904 18.5207 19.712 18.712C19.5207 18.904 19.2833 19 19 19H5ZM12 22C11.45 22 10.9793 21.8043 10.588 21.413C10.196 21.021 10 20.55 10 20H14C14 20.55 13.8043 21.021 13.413 21.413C13.021 21.8043 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z"
      fill="white"
    />
  </Wrapper>
)
