export enum BadgeModelControllerType {
  // TODO replace kleros with community
  Community = 'kleros',
  ThirdParty = 'thirdParty',
}

export enum BadgeModelControllerName {
  Kleros = 'kleros',
  ThirdParty = 'thirdParty',
}

export enum BadgeModelTemplate {
  Badge = 'Badge',
  Diploma = 'Diploma',
}

export type BadgeModelTemplateType = BadgeModelTemplate.Diploma | BadgeModelTemplate.Badge
