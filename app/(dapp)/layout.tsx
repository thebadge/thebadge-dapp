import DefaultLayout from '@/src/components/layout/DefaultLayout'

export const metadata = {
  title: 'App',
}
export default function DAppRootLayout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>
}
