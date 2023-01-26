import { useRouter } from 'next/router'
import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Fade,
  Typography,
  styled,
} from '@mui/material'

import { useMainMenuItems } from '@/src/components/navigation/MainMenu.config'
import { MenuItem, MenuItemElement, SubMenuItem } from '@/src/components/navigation/MainMenu.types'
import {
  getMenuItemBackgroundColor,
  getMenuItemHoverBackgroundColor,
} from '@/src/components/navigation/MainMenu.utils'
import { useSectionReferences } from '@/src/providers/referencesProvider'

const MenuContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: '#F4F4F4',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
  borderRadius: '0px 20px 0px 0px',
  padding: '3rem 1rem',
  gap: '2.5rem',
  flexWrap: 'wrap',
}))

const MainMenuContainer = styled(MenuContainer)(({ theme }) => ({
  height: 'fit-content',
  position: 'sticky',
  top: '8rem',
  marginRight: '5%',

  [theme.breakpoints.up('xl')]: {
    marginRight: 'calc(10% - 16px)',
  },
}))

const SubMenuContainer = styled(MenuContainer)<MenuItemElement>(({ theme, type }) => ({
  position: 'relative',

  ...(type === 'small'
    ? {
        left: '3.25rem',
      }
    : {
        left: '4rem',
      }),

  bottom: '3rem',
  padding: '2rem',
  width: '13rem',
  gap: '2rem',
}))

const MenuItemContainer = styled('div')<MenuItemElement>(({ theme, type }) => ({
  height: '3rem',
  position: 'relative',

  ...(type === 'small'
    ? {
        left: '0.75rem',
        top: '0.75rem',
      }
    : {
        left: '0rem',
        top: '0rem',
      }),
}))

const MenuItemsTopContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '2.5rem',
  marginBottom: '5rem',
  width: '3rem',
}))

const MenuItemsBottomContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '3rem',
}))

const MenuItem = styled('div')<MenuItemElement>(({ disabled, selected, theme, type }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',

  ...(type === 'small'
    ? {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #1C1B1F',
      }
    : {
        width: '3rem',
        height: '3rem',
        borderRadius: '1.5rem',
        border: 'none',
      }),

  background: `${getMenuItemBackgroundColor(type)}`,

  '&:hover': {
    background: `${getMenuItemHoverBackgroundColor(type)}`,
  },

  ...(selected
    ? {
        border: '1px solid #1C1B1F',
      }
    : null),

  ...(disabled
    ? {
        opacity: 0.5,
        cursor: 'default',
      }
    : null),
}))

const SubMenuTitleItem = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 900,
  fontSize: '12px',
  lineHeight: '15px',
  textTransform: 'uppercase',
  color: '#000000',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #000000',

  '&:hover': {
    opacity: 0.7,
    borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
  },
}))

const SubMenuItem = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '11px',
  lineHeight: '14px',
  textTransform: 'uppercase',
  color: '#4f4f4f',
  paddingBottom: '0.5rem',

  '&:hover': {
    color: '#000000',
  },
}))

export const MainMenu: React.FC = ({ ...restProps }) => {
  // const t = useTranslations('mainMenu')
  const router = useRouter()
  const { scrollTo } = useSectionReferences()
  const [selectedElement, setSelectedElement] = useState(-1)
  const { bottomMenuItems, topMenuItems } = useMainMenuItems()

  const navigateTo = async (link: any) => {
    if (link) {
      if (link.current) {
        scrollTo(link)
      } else {
        await router.push(link)
      }
    }
  }

  const onItemClick = async (item: MenuItem | SubMenuItem) => {
    if (item.href) {
      await navigateTo(item.href)

      if (!item.subItems) {
        // close after click if no subItems opening
        setTimeout(() => setSelectedElement(-1), 300)
      }
    }
    if (item.customOnClickBehavior) {
      item.customOnClickBehavior()
    }
  }

  const toggleSelectedElement = (index: number) => {
    if (selectedElement === index) {
      setSelectedElement(-1) // unselect
    } else {
      setSelectedElement(index) // select
    }
  }

  const onMenuItemClick = async (item: MenuItem, index: number) => {
    toggleSelectedElement(index)
    await onItemClick(item)
  }

  const renderSubItemWithSubItems = (subItem: SubMenuItem): React.ReactNode => {
    return (
      <Accordion
        sx={{
          color: 'inherit',
          backgroundColor: 'inherit',
          boxShadow: 0,
          minHeight: 0,
          margin: 0,
          '& .Mui-expanded': {
            margin: 0,
            minHeight: 0,
          },
        }}
      >
        <AccordionSummary
          aria-controls="content"
          expandIcon={<ExpandMoreIcon htmlColor={'#4f4f4f'} sx={{ width: 16, height: 16 }} />}
          sx={{
            padding: 0,
            minHeight: 0,
            margin: 0,
            '& .MuiAccordionSummary-content, & .Mui-expanded': {
              margin: 0,
              minHeight: 0,
            },
          }}
        >
          {subItem.title}
        </AccordionSummary>
        <AccordionDetails sx={{ minHeight: 0, margin: 0, padding: '1rem 0 0 1rem' }}>
          {subItem.subItems?.map((subItemSubItem, subItemSubItemIndex) => (
            <SubMenuItem
              key={'subItem-' + subItemSubItem + '-subItemSubItem-' + subItemSubItemIndex}
              onClick={async () => await onItemClick(subItemSubItem)}
            >
              {subItemSubItem.title}
            </SubMenuItem>
          ))}
        </AccordionDetails>
      </Accordion>
    )
  }

  const renderSubItems = (item: MenuItem, itemIndex: number): React.ReactNode => {
    return (
      <Fade in={selectedElement === itemIndex}>
        <SubMenuContainer type={item.type}>
          <SubMenuTitleItem onClick={async () => await onItemClick(item)}>
            {item.title}
          </SubMenuTitleItem>

          {item.subItems?.map((subItem, subItemIndex) => (
            <SubMenuItem
              key={'item-' + itemIndex + '-subItem-' + subItemIndex}
              onClick={async () => await onItemClick(subItem)}
            >
              {subItem.subItems ? renderSubItemWithSubItems(subItem) : subItem.title}
            </SubMenuItem>
          ))}
        </SubMenuContainer>
      </Fade>
    )
  }

  const renderMenuItem = (item: MenuItem, itemIndex: number): React.ReactNode => {
    return (
      (item.validation === undefined || item.validation) && (
        <MenuItemContainer type={item.type}>
          <MenuItem
            disabled={!!item.disabled}
            onClick={async () => await onMenuItemClick(item, itemIndex)}
            selected={selectedElement === itemIndex}
            type={item.type}
          >
            {item.icon}
          </MenuItem>
          {item.subItems && selectedElement === itemIndex ? renderSubItems(item, itemIndex) : null}
        </MenuItemContainer>
      )
    )
  }

  return (
    <MainMenuContainer {...restProps}>
      <MenuItemsTopContainer>
        {topMenuItems.map((item, index) => renderMenuItem(item, index))}
      </MenuItemsTopContainer>
      <MenuItemsBottomContainer>
        {bottomMenuItems.map((item, index) => renderMenuItem(item, index + topMenuItems.length))}
      </MenuItemsBottomContainer>
    </MainMenuContainer>
  )
}
