import { HTMLAttributes } from 'react'

import { styled } from '@mui/material'

const Wrapper = styled('svg')`
  .fill {
    fill: ${'#1C1B1F'};
  }
`

export const Earn: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`earn ${className}`}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M12 23C10.1333 23 8.41667 22.575 6.85 21.725C5.28333 20.875 4 19.7417 3 18.325V20C3 20.2833 2.90433 20.5207 2.713 20.712C2.521 20.904 2.28333 21 2 21C1.71667 21 1.47933 20.904 1.288 20.712C1.096 20.5207 1 20.2833 1 20V16C1 15.7167 1.096 15.479 1.288 15.287C1.47933 15.0957 1.71667 15 2 15H6C6.28333 15 6.521 15.0957 6.713 15.287C6.90433 15.479 7 15.7167 7 16C7 16.2833 6.90433 16.5207 6.713 16.712C6.521 16.904 6.28333 17 6 17H4.525C5.325 18.2 6.37933 19.1667 7.688 19.9C8.996 20.6333 10.4333 21 12 21C14.3333 21 16.346 20.2333 18.038 18.7C19.7293 17.1667 20.7 15.2667 20.95 13C20.9833 12.7167 21.096 12.479 21.288 12.287C21.4793 12.0957 21.7167 12 22 12C22.2833 12 22.5207 12.1 22.712 12.3C22.904 12.5 22.9833 12.7333 22.95 13C22.8333 14.4 22.4627 15.7083 21.838 16.925C21.2127 18.1417 20.4127 19.2 19.438 20.1C18.4627 21 17.3373 21.7083 16.062 22.225C14.7873 22.7417 13.4333 23 12 23ZM2 12C1.71667 12 1.47933 11.9 1.288 11.7C1.096 11.5 1.01667 11.2667 1.05 11C1.18333 9.6 1.55833 8.29167 2.175 7.075C2.79167 5.85833 3.58733 4.8 4.562 3.9C5.53733 3 6.66267 2.29167 7.938 1.775C9.21267 1.25833 10.5667 1 12 1C13.8667 1 15.5833 1.425 17.15 2.275C18.7167 3.125 20 4.25833 21 5.675V4C21 3.71667 21.096 3.479 21.288 3.287C21.4793 3.09567 21.7167 3 22 3C22.2833 3 22.5207 3.09567 22.712 3.287C22.904 3.479 23 3.71667 23 4V8C23 8.28333 22.904 8.52067 22.712 8.712C22.5207 8.904 22.2833 9 22 9H18C17.7167 9 17.4793 8.904 17.288 8.712C17.096 8.52067 17 8.28333 17 8C17 7.71667 17.096 7.479 17.288 7.287C17.4793 7.09567 17.7167 7 18 7H19.475C18.675 5.8 17.6207 4.83333 16.312 4.1C15.004 3.36667 13.5667 3 12 3C9.66667 3 7.65433 3.76667 5.963 5.3C4.271 6.83333 3.3 8.73333 3.05 11C3.01667 11.2833 2.90433 11.5207 2.713 11.712C2.521 11.904 2.28333 12 2 12ZM11.975 19C11.7417 19 11.5377 18.9127 11.363 18.738C11.1877 18.5627 11.1 18.3583 11.1 18.125V17.7C10.4667 17.5667 9.925 17.3207 9.475 16.962C9.025 16.604 8.66667 16.1417 8.4 15.575C8.3 15.3583 8.30433 15.1333 8.413 14.9C8.521 14.6667 8.69167 14.5083 8.925 14.425C9.14167 14.3417 9.35833 14.3417 9.575 14.425C9.79167 14.5083 9.96667 14.6667 10.1 14.9C10.3333 15.3167 10.625 15.629 10.975 15.837C11.325 16.0457 11.7167 16.15 12.15 16.15C12.7 16.15 13.1707 16.0207 13.562 15.762C13.954 15.504 14.15 15.1 14.15 14.55C14.15 14.0667 13.946 13.675 13.538 13.375C13.1293 13.075 12.4 12.7333 11.35 12.35C10.3667 12 9.646 11.5833 9.188 11.1C8.72933 10.6167 8.5 9.98333 8.5 9.2C8.5 8.51667 8.73333 7.9 9.2 7.35C9.66667 6.8 10.3167 6.43333 11.15 6.25V5.875C11.15 5.64167 11.2377 5.43733 11.413 5.262C11.5877 5.08733 11.7917 5 12.025 5C12.2583 5 12.4623 5.08733 12.637 5.262C12.8123 5.43733 12.9 5.64167 12.9 5.875V6.25C13.35 6.28333 13.771 6.43333 14.163 6.7C14.5543 6.96667 14.8833 7.29167 15.15 7.675C15.2833 7.875 15.3043 8.09567 15.213 8.337C15.121 8.579 14.95 8.75 14.7 8.85C14.5167 8.93333 14.321 8.93767 14.113 8.863C13.9043 8.78767 13.7167 8.65 13.55 8.45C13.3833 8.25 13.175 8.09167 12.925 7.975C12.675 7.85833 12.3833 7.8 12.05 7.8C11.4667 7.8 11.021 7.925 10.713 8.175C10.4043 8.425 10.25 8.76667 10.25 9.2C10.25 9.63333 10.4417 9.975 10.825 10.225C11.2083 10.475 11.9 10.7667 12.9 11.1C14.1 11.5333 14.9 12.0417 15.3 12.625C15.7 13.2083 15.9 13.85 15.9 14.55C15.9 15.5333 15.6 16.275 15 16.775C14.4 17.275 13.6833 17.6 12.85 17.75V18.125C12.85 18.3583 12.7627 18.5627 12.588 18.738C12.4127 18.9127 12.2083 19 11.975 19Z"
    />
  </Wrapper>
)
