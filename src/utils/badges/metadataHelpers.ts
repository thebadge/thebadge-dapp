import { ModelsBackgroundsNames } from '@/src/constants/backgrounds'
import { BadgeNFTAttributesType, DiplomaNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'
import { NFTAttribute } from '@/types/utils'

export const getBackgroundType = (attributes: NFTAttribute[] | undefined) => {
  return attributes?.find<NFTAttribute<ModelsBackgroundsNames>>(
    (at): at is NFTAttribute<ModelsBackgroundsNames> =>
      at.trait_type === BadgeNFTAttributesType.Background,
  )
}

export const getTextContrast = (attributes: NFTAttribute[] | undefined) => {
  return attributes?.find((at) => at.trait_type === BadgeNFTAttributesType.TextContrast)
}

export const getBadgeModelTemplate = (attributes: NFTAttribute[] | undefined) => {
  return attributes?.find<NFTAttribute<BadgeModelTemplate>>(
    (at): at is NFTAttribute<BadgeModelTemplate> =>
      at.trait_type === DiplomaNFTAttributesType.Template,
  )
}

export const getClassicConfigs = (attributes: NFTAttribute[] | undefined) => {
  const backgroundType = getBackgroundType(attributes)
  const textContrast = getTextContrast(attributes)

  const fieldsConfigs = attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.FieldsConfigs,
  )

  return { fieldsConfigs, backgroundType, textContrast }
}

export const getDiplomaConfigs = (attributes: NFTAttribute[] | undefined) => {
  const courseName = attributes?.find((at) => at.trait_type === DiplomaNFTAttributesType.CourseName)
  const achievementDescription = attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.AchievementDescription,
  )
  const achievementDate = attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.AchievementDate,
  )
  const issuerConfigs = attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.IssuerConfigs,
  )
  const footerConfigs = attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.FooterConfigs,
  )
  const signerConfigs = attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.SignerConfigs,
  )

  return {
    courseName,
    achievementDescription,
    achievementDate,
    issuerConfigs,
    footerConfigs,
    signerConfigs,
  }
}
