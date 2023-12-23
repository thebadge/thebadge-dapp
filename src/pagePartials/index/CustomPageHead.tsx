import Head from 'next/head'

export const CustomPageHead = ({
  description,
  imageUrl,
  title,
}: {
  description?: string
  title: string
  imageUrl?: string
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta content={title} property="og:title" />
      {description && <meta content={description} name="description" />}
      {description && <meta content={description} property="og:description" />}
      {imageUrl && <meta content={imageUrl} property="og:image" />}
    </Head>
  )
}
