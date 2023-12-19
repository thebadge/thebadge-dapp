import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HTMLAttributes, PropsWithChildren } from 'react'

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  href: string
}

export const NavLink: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  href,
  ...restProps
}) => {
  const pathname = usePathname()

  return (
    <Link href={href} legacyBehavior passHref prefetch={false}>
      <a className={`${className} ${pathname === href && 'active'}`} {...restProps}>
        {children}
      </a>
    </Link>
  )
}
