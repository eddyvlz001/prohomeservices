import Providers from './providers'

export const metadata = {
  title: 'Pro Home Services & Construction Management',
  description: 'High-quality residential and commercial maintenance, renovation, and construction services. Available 24/7 for emergencies.',
  keywords: 'home services, renovation, construction, plumbing, carpentry, remodeling, Westchester NY',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
