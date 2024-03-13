import React, { HTMLAttributes } from 'react'

import { styled } from '@mui/material'

const Wrapper = styled('svg')`
  .fill {
    fill: ${'#1C1B1F'};
  }
`

export const Home: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`home ${className}`}
    fill="none"
    height="48"
    viewBox="0 0 48 48"
    width="48"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <circle cx="23.9995" cy="24" fill="#24F3D2" r="24" />
    <mask height="26" id="mask0_3550_7550" maskUnits="userSpaceOnUse" width="26" x="11" y="11">
      <rect fill="#D9D9D9" height="25.0435" width="25.0435" x="11.4771" y="11.4775" />
    </mask>
    <g mask="url(#mask0_3550_7550)">
      <path
        d="M17.7383 31.3043H20.8688V25.0434H27.1296V31.3043H30.2601V21.913L23.9992 17.2173L17.7383 21.913V31.3043ZM17.7383 33.3912C17.1644 33.3912 16.6733 33.1871 16.2649 32.7787C15.8559 32.3697 15.6514 31.8782 15.6514 31.3043V21.913C15.6514 21.5825 15.7255 21.2695 15.8736 20.9738C16.0211 20.6782 16.2253 20.4347 16.4861 20.2434L22.747 15.5478C22.9383 15.4086 23.1383 15.3043 23.347 15.2347C23.5557 15.1652 23.7731 15.1304 23.9992 15.1304C24.2253 15.1304 24.4427 15.1652 24.6514 15.2347C24.8601 15.3043 25.0601 15.4086 25.2514 15.5478L31.5122 20.2434C31.7731 20.4347 31.9776 20.6782 32.1258 20.9738C32.2733 21.2695 32.347 21.5825 32.347 21.913V31.3043C32.347 31.8782 32.1428 32.3697 31.7345 32.7787C31.3255 33.1871 30.834 33.3912 30.2601 33.3912H25.0427V27.1304H22.9557V33.3912H17.7383Z"
        fill="#1C1B1F"
      />
    </g>
  </Wrapper>
)
