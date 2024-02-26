import btc from '../assets/images/tokens/btc.png'
import wbtc from '../assets/images/tokens/WBTC.png'
import binance from '../assets/images/tokens/wbnb.webp'
import beth from '../assets/images/tokens/BETH.png'
import VLX from '../assets/images/tokens/VLX.png'
import GHST from '../assets/images/tokens/GHST.png'
import eth from '../assets/images/tokens/ether.png'
import arb from '../assets/images/tokens/arb.png'
import rdnt from '../assets/images/tokens/rdnt.png'
import usdt from '../assets/images/tokens/usdt.png'
import usdc from '../assets/images/tokens/usdc.png'
import matic from '../assets/images/tokens/matic.png'
import stg from '../assets/images/tokens/stargate.png'
import gmx from '../assets/images/tokens/gmx-logo.png'
import xrp from '../assets/images/tokens/small/XRP.png'
import ada from '../assets/images/tokens/small/ADA.png'
import cake from '../assets/images/tokens/cake.png'
import avax from '../assets/images/tokens/small/AVAX.png'
import sol from '../assets/images/tokens/small/SOL.png'
import inj from '../assets/images/tokens/inj.png'
import DOGE from '../assets/images/tokens/DOGE.png'
import dot from '../assets/images/tokens/DOT.webp'
import link from '../assets/images/tokens/small/LINK.png'
import ldo from '../assets/images/tokens/small/LDO.png'

export default function computedTokenImage(token) {
  if (token.symbol === 'WBTC' || token === 'WBTC') {
    return wbtc
  }
  if (
    token.symbol === 'BTC' ||
    token === 'BTC' ||
    token.symbol === 'BTCB' ||
    token === 'BTCB'
  ) {
    return btc
  }
  if (token.symbol === 'ETH' || token === 'ETH') {
    return eth
  }
  if (token.symbol === 'WETH' || token === 'WETH') {
    return eth
  }
  if (token.symbol === 'ARB' || token === 'ARB') {
    return arb
  }
  if (token.symbol === 'USDT' || token === 'USDT') {
    return usdt
  }
  if (token.symbol === 'USDC' || token === 'USDC') {
    return usdc
  }
  if (token.symbol === 'RDNT' || token === 'RDNT') {
    return rdnt
  }
  if (
    token.symbol === 'WBNB' ||
    token === 'WBNB' ||
    token.symbol === 'BNB' ||
    token === 'BNB'
  ) {
    return binance
  }
  if (token.symbol === 'BETH' || token === 'BETH') {
    return beth
  }
  if (token.symbol === 'DOGE' || token === 'DOGE') {
    return DOGE
  }
  if (token.symbol === 'VLX' || token === 'VLX') {
    return VLX
  }
  if (token.symbol === 'GHST' || token === 'GHST') {
    return GHST
  }
  if (token.symbol === 'MATIC' || token === 'MATIC') {
    return matic
  }
  if (token.symbol === 'WMATIC' || token === 'WMATIC') {
    return matic
  }
  if (token.symbol === 'STG' || token === 'STG') {
    return stg
  }
  if (token.symbol === 'GMX' || token === 'GMX') {
    return gmx
  }
  if (token.symbol === 'XRP' || token === 'XRP') {
    return xrp
  }
  if (token.symbol === 'ADA' || token === 'ADA') {
    return ada
  }
  if (
    token.symbol === 'CAKE' ||
    token === 'CAKE' ||
    token.symbol === 'Cake' ||
    token === 'Cake'
  ) {
    return cake
  }
  if (token.symbol === 'AVAX' || token === 'AVAX') {
    return avax
  }
  if (token.symbol === 'SOL' || token === 'SOL') {
    return sol
  }
  if (token.symbol === 'INJ' || token === 'INJ') {
    return inj
  }
  if (token.symbol === 'DOT' || token === 'DOT') {
    return dot
  }
  if (token.symbol === 'LINK' || token === 'LINK') {
    return link
  }
  if (token.symbol === 'LDO' || token === 'LDO') {
    return ldo
  }
  if (token.symbol === 'USDC.e' || token === 'USDC.e') {
    return usdc
  }
}