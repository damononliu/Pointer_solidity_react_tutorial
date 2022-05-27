import '../styles/globals.css'

import { toast } from 'react-hot-toast'
import MetaMaskAccountProvider from '../components/meta-mask-account-provider'

function MyApp({ Component, pageProps }) {
  return (
    <MetaMaskAccountProvider>
      <Toaster></Toaster>
      <Component {...pageProps} />
    </MetaMaskAccountProvider>
  )
}

export default MyApp
