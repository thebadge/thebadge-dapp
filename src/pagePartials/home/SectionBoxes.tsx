import { styled } from '@mui/material'
import { BadgePreviewV2 } from 'thebadge-ui-library'

const SectionBox = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '2.25rem 3.325rem',
}))

const SectionTitleBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

// TODO replace this with badges obtained from backend
const badgeExample = (
  <BadgePreviewV2
    {...{
      size: 'small',
      title: 'Diploma in Intellectual Property',
      category: 'Diploma certificate.',
      description:
        'User with address: 0xD28....16eC has a degree in intellectual property from Austral University',
      badgeUrl: 'https://www.thebadge.xyz',
      imageUrl:
        'https://images.unsplash.com/photo-1564054074885-e5a7c93671d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
      badgeBackgroundUrl:
        'https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      textContrast: 'light-withTextBackground',
    }}
  />
)
const badgesExampleList = [badgeExample, badgeExample, badgeExample, badgeExample, badgeExample]

export { SectionBox, SectionTitleBox, badgesExampleList }
