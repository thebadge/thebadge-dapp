import FlexFormContainer from '@/src/components/form/customForms/FlexFormContainer'
import ResponsiveGridFromContainer, {
  GridFormContainer,
} from '@/src/components/form/customForms/GridFormContainer'

export function getFormLayout(layoutType: 'flex' | 'grid' | 'gridResponsive') {
  switch (layoutType) {
    case 'flex':
      return FlexFormContainer
    case 'grid':
      return GridFormContainer
    case 'gridResponsive':
      return ResponsiveGridFromContainer
  }
}
