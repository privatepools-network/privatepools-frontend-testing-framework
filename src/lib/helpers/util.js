import moment from 'moment'

export function addressShorthand(address) {
  if (!address) return ''

  const length = address.length
  const prefix = address.substring(0, 6)
  const suffix = address.substring(length - 4, length)
  return `${prefix}...${suffix}`
}

export async function fetchJson(url) {
  const res = await fetch(url)
  return await res.json()
}

export function toUtcTime(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
}

export function unixToJsTime(time) {
  return time * 1000
}

export function JsTimeToDate(time) {
  return {
    date: moment(unixToJsTime(time)).format('MMM, DD, YYYY'),
    fromNow: moment(unixToJsTime(time)).fromNow(),
  }
}

export function getTimeDifferenceFormatted(pastTime) {
  const now = moment()
  const past = moment(pastTime)
  const diff = moment.duration(now.diff(past))

  const days = diff.days()
  const hours = diff.hours()
  const minutes = diff.minutes()
  const seconds = diff.seconds()

  // Building the string conditionally to avoid showing "0 days" or "0 hours"
  let result = ''
  if (days > 0) result += `${days}d `
  if (hours > 0) result += `${hours}h `
  if (minutes > 0) result += `${minutes}mins `
  result += `${seconds}secs ago`

  return result
}

export const timestampToDateTime = (timestamp) => {
  const timestampInt = parseInt(timestamp) // Convert the string to a number
  if (isNaN(timestampInt)) return ['', '']

  const date = new Date(timestampInt)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based, so add 1
  const year = date.getFullYear().toString().substr(2) // Get the last two digits of the year

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(2, '0')

  const formattedDate = `${day}/${month}/${year}`
  const formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`

  return [formattedDate, formattedTime]
}

import Ether from '@/assets/images/tokens/ETH.png'
import USDT from '@/assets/images/tokens/usdt.png'
import USDC from '@/assets/images/tokens/usdc.png'
import ARB from '@/assets/images/tokens/arb.png'
import WBNB from '@/assets/images/tokens/wbnb.webp'
import STG from '@/assets/images/tokens/STG.png'
import GHST from '@/assets/images/tokens/GHST.png'
import DAI from '@/assets/images/tokens/DAI.png'
// import Ethereum from '@/assets/images/networks/ethereum.png'
import PENDLE from '@/assets/images/tokens/pendle.png'
import MAGIC from '@/assets/images/tokens/magic.png'
import MATIC from '@/assets/images/tokens/matic.png'
import GMX from '@/assets/images/tokens/GMX.png'
import RDNT from '@/assets/images/tokens/rdnt.png'
import Btc from '@/assets/images/tokens/btc.png'
import WBTC from '@/assets/images/tokens/WBTC.png'

import LDOsmall from '@/assets/images/tokens/LDO.png'
import LINK from '@/assets/images/tokens/LINK.png'
import ADAsmall from '@/assets/images/tokens/ADA.png'
import AVAXsmall from '@/assets/images/tokens/AVAX.png'
import BNBsmall from '@/assets/images/tokens/BNB.png'
import BTCsmall from '@/assets/images/tokens/btc.png'
import DOGEsmall from '@/assets/images/tokens/DOGE.png'
import ETHsmall from '@/assets/images/tokens/ETH.png'
import GHSTsmall from '@/assets/images/tokens/GHST.png'
import GMXsmall from '@/assets/images/tokens/GMX.png'
import LTCsmall from '@/assets/images/tokens/LTC.png'
import MATICsmall from '@/assets/images/tokens/matic.png'
import OPsmall from '@/assets/images/tokens/OP.png'
import PAXG from '@/assets/images/tokens/PAXG.png'
import SOLsmall from '@/assets/images/tokens/SOL.png'
import STGsmall from '@/assets/images/tokens/STG.png'
// import USDTsmall from '@/assets/images/tokens/usdt.png'
import XRPsmall from '@/assets/images/tokens/XRP.png'
import ARBsmall from '@/assets/images/tokens/arb.png'
import BETH from '@/assets/images/tokens/BETH.png'
import VLX from '@/assets/images/tokens/VLX.png'
import CAKE from '@/assets/images/tokens/cake.png'
import DOT from '@/assets/images/tokens/DOT.webp'
import INJ from '@/assets/images/tokens/inj.png'
import DOGE from '@/assets/images/tokens/DOGE.png'
import PPN from '@/assets/images/tokens/PPN.png'
import GMRX from '@/assets/images/tokens/GMRX.png'
import UNI from '@/assets/images/tokens/UNI.png'
import NEAR from '@/assets/images/tokens/NEAR.png'
import FTM from '@/assets/images/tokens/FTM.png'
import FDUSD from '@/assets/images/tokens/FDUSD.png'
import SANTOS from '@/assets/images/tokens/SANTOS.png'
import BCH from '@/assets/images/tokens/BCH.png'
import AI from '@/assets/images/tokens/AI.png'
import JST from '@/assets/images/tokens/JST.png'
import GMT from '@/assets/images/tokens/GMT.png'
import VITE from '@/assets/images/tokens/VITE.png'
import CFX from '@/assets/images/tokens/CFX.png'
import SFP from '@/assets/images/tokens/SFP.png'
import WOO from '@/assets/images/tokens/WOO.png'
import ELF from '@/assets/images/tokens/ELF.png'
import ACE from '@/assets/images/tokens/ACE.png'
import BEL from '@/assets/images/tokens/BEL.png'
import CHR from '@/assets/images/tokens/CHR.png'
import DIA from '@/assets/images/tokens/DIA.png'
import WAVES from '@/assets/images/tokens/WAVES.png'
import ADX from '@/assets/images/tokens/ADX.png'
import FLOKI from '@/assets/images/tokens/FLOKI.png'
import JASMY from '@/assets/images/tokens/JASMY.png'
import SAND from '@/assets/images/tokens/SAND.png'
import COTI from '@/assets/images/tokens/COTI.png'
import OCEAN from '@/assets/images/tokens/OCEAN.png'
import FIS from '@/assets/images/tokens/FIS.png'
import BAL from '@/assets/images/tokens/BAL.png'
import FIL from '@/assets/images/tokens/FIL.png'
import KSM from '@/assets/images/tokens/KSM.png'
import UFT from '@/assets/images/tokens/UFT.png'
import CYBER from '@/assets/images/tokens/CYBER.png'
import XLM from '@/assets/images/tokens/XLM.png'
import DF from '@/assets/images/tokens/DF.png'
import LINA from '@/assets/images/tokens/LINA.png'
import POND from '@/assets/images/tokens/POND.png'
import LTO from '@/assets/images/tokens/LTO.png'
import WIN from '@/assets/images/tokens/WIN.png'
import FOR from '@/assets/images/tokens/FOR.png'
import BAT from '@/assets/images/tokens/BAT.png'
import LTC from '@/assets/images/tokens/LTC.png'
import DATA from '@/assets/images/tokens/DATA.png'
import CREAM from '@/assets/images/tokens/CREAM.png'
import EDU from '@/assets/images/tokens/EDU.png'
import ILV from '@/assets/images/tokens/ILV.png'
import USDP from '@/assets/images/tokens/USDP.png'
import ALPACA from '@/assets/images/tokens/ALPACA.png'
import VET from '@/assets/images/tokens/VET.png'
import FET from '@/assets/images/tokens/FET.png'
import DAR from '@/assets/images/tokens/DAR.png'
import GFTO from '@/assets/images/tokens/GFTO.png'
import PROM from '@/assets/images/tokens/PROM.png'
import PROS from '@/assets/images/tokens/PROS.png'
import KNC from '@/assets/images/tokens/KNC.png'
import IDEX from '@/assets/images/tokens/IDEX.png'
import ALPINE from '@/assets/images/tokens/ALPINE.png'
import KMD from '@/assets/images/tokens/KMD.png'
import HFT from '@/assets/images/tokens/HFT.png'
import COMP from '@/assets/images/tokens/COMP.png'
import VAI from '@/assets/images/tokens/VAI.png'
import ZIL from '@/assets/images/tokens/ZIL.png'
import BIDR from '@/assets/images/tokens/BIDR.png'
import AXS from '@/assets/images/tokens/AXS.png'
import PEOPLE from '@/assets/images/tokens/PEOPLE.png'
import SCRT from '@/assets/images/tokens/SCRT.png'
import TUSD from '@/assets/images/tokens/TUSD.png'
import TKO from '@/assets/images/tokens/TKO.png'
import IDRT from '@/assets/images/tokens/IDRT.png'
import OAX from '@/assets/images/tokens/OAX.png'
import HARD from '@/assets/images/tokens/HARD.png'
import YGG from '@/assets/images/tokens/YGG.png'
import XEC from '@/assets/images/tokens/XEC.png'
import YFI from '@/assets/images/tokens/YFI.png'
import BONK from '@/assets/images/tokens/BONK.png'
import PERP from '@/assets/images/tokens/PERP.png'
import AAVE from '@/assets/images/tokens/AAVE.png'
import MASK from '@/assets/images/tokens/MASK.png'
import ORN from '@/assets/images/tokens/ORN.png'
import GAL from '@/assets/images/tokens/GAL.png'
import AVA from '@/assets/images/tokens/AVA.png'
import TROY from '@/assets/images/tokens/TROY.png'
import VIDT from '@/assets/images/tokens/VIDT.png'
import COMBO from '@/assets/images/tokens/COMBO.png'
import SYN from '@/assets/images/tokens/SYN.png'
import CTSI from '@/assets/images/tokens/CTSI.png'
import ALPHA from '@/assets/images/tokens/ALPHA.png'
import TLM from '@/assets/images/tokens/TLM.png'
import DUSK from '@/assets/images/tokens/DUSK.png'
import LOOM from '@/assets/images/tokens/LOOM.png'
import ZEC from '@/assets/images/tokens/ZEC.png'
import LIT from '@/assets/images/tokens/LIT.png'
import DODO from '@/assets/images/tokens/DODO.png'
import MKR from '@/assets/images/tokens/MKR.png'
import ATA from '@/assets/images/tokens/ATA.png'
import MANA from '@/assets/images/tokens/MANA.png'
import FIRO from '@/assets/images/tokens/FIRO.png'
import ONT from '@/assets/images/tokens/ONT.png'
import SUSHI from '@/assets/images/tokens/SUSHI.png'
import ANKR from '@/assets/images/tokens/ANKR.png'
import CVP from '@/assets/images/tokens/CVP.png'
import REEF from '@/assets/images/tokens/REEF.png'
import IOTA from '@/assets/images/tokens/IOTA.png'
import TWT from '@/assets/images/tokens/TWT.png'
import SUN from '@/assets/images/tokens/SUN.png'
import BAND from '@/assets/images/tokens/BAND.png'
import WBETH from '@/assets/images/tokens/WBETH.png'
import BSW from '@/assets/images/tokens/BSW.png'
import MBOX from '@/assets/images/tokens/MBOX.png'
import QI from '@/assets/images/tokens/QI.png'
import PNT from '@/assets/images/tokens/PNT.png'
import FRONT from '@/assets/images/tokens/FRONT.png'
import SHIB from '@/assets/images/tokens/SHIB.png'
import IOTX from '@/assets/images/tokens/IOTX.png'
import ARPA from '@/assets/images/tokens/ARPA.png'
import CTK from '@/assets/images/tokens/CTK.png'
import BUSD from '@/assets/images/tokens/BUSD.png'
import APE from '@/assets/images/tokens/APE.png'
import BETA from '@/assets/images/tokens/BETA.png'
import AEUR from '@/assets/images/tokens/AEUR.png'
import OM from '@/assets/images/tokens/OM.png'
import ALICE from '@/assets/images/tokens/ALICE.png'
import FLUX from '@/assets/images/tokens/FLUX.png'
import BAKE from '@/assets/images/tokens/BAKE.png'
import EVX from '@/assets/images/tokens/EVX.png'
import EGLD from '@/assets/images/tokens/EGLD.png'
import NULS from '@/assets/images/tokens/NULS.png'
import MDX from '@/assets/images/tokens/MDX.png'
import NFT from '@/assets/images/tokens/NFT.png'
import MDT from '@/assets/images/tokens/MDT.png'
import TRX from '@/assets/images/tokens/TRX.png'
import NFP from '@/assets/images/tokens/NFP.png'
import DREP from '@/assets/images/tokens/DREP.png'
import TRU from '@/assets/images/tokens/TRU.png'
import BNX from '@/assets/images/tokens/BNX.png'
import BNT from '@/assets/images/tokens/BNT.png'
import TUSDOLD from '@/assets/images/tokens/TUSDOLD.png'
import AUCTION from '@/assets/images/tokens/AUCTION.png'
import OGN from '@/assets/images/tokens/OGN.png'
import CELR from '@/assets/images/tokens/CELR.png'
import ETC from '@/assets/images/tokens/ETC.png'
import GLMR from '@/assets/images/tokens/GLMR.png'
import QKC from '@/assets/images/tokens/QKC.png'
import COS from '@/assets/images/tokens/COS.png'
import SNX from '@/assets/images/tokens/SNX.png'
import MBL from '@/assets/images/tokens/MBL.png'
import BLZ from '@/assets/images/tokens/BLZ.png'
import ATOM from '@/assets/images/tokens/ATOM.png'
import PHB from '@/assets/images/tokens/PHB.png'
import BEAMX from '@/assets/images/tokens/BEAMX.png'
import PHA from '@/assets/images/tokens/PHA.png'
import MAV from '@/assets/images/tokens/MAV.png'
import UNFI   from '@/assets/images/tokens/UNFI.png'
import DEGO   from '@/assets/images/tokens/DEGO.png'
import CHESS   from '@/assets/images/tokens/CHESS.png'
import LAZIO   from '@/assets/images/tokens/LAZIO.png'
import ID  from '@/assets/images/tokens/ID.png'
import VRT  from '@/assets/images/tokens/VRT.png'
import SLP  from '@/assets/images/tokens/SLP.png'
import XVS  from '@/assets/images/tokens/XVS.png'
import FLOW from '@/assets/images/tokens/FLOW.png'
import EPX from '@/assets/images/tokens/EPX.png'
import CLV from '@/assets/images/tokens/CLV.png'
import HOOK from '@/assets/images/tokens/HOOK.png'
import BURGER from '@/assets/images/tokens/BURGER.png'
import SOLO from '@/assets/images/tokens/SOLO.png'

import EOS from '@/assets/images/tokens/EOS.png'

const tokenHT = [
  {
    key: 'Ether (ETH)',
    name: 'Ether',
    short: 'ETH',
    icon: Ether,
  },
  {
    key: 'Wrapped Ether (WETH)',
    name: 'Wrapped ether',
    short: 'WETH',
    icon: Ether,
  },
  {
    key: 'WETH',
    name: 'WETH',
    short: 'WETH',
    icon: Ether,
  },
  {
    key: 'WBTC',
    name: 'WBTC',
    short: 'WBTC',
    icon: WBTC,
  },
  {
    key: 'RDNT',
    name: 'RDNT',
    short: 'RDNT',
    icon: RDNT,
  },
  {
    key: 'DAI',
    name: 'DAI',
    short: 'DAI',
    icon: DAI,
  },
  {
    key: 'GHST',
    name: 'GHST',
    short: 'GHST',
    icon: GHST,
  },
  {
    key: 'MAGIC',
    name: 'MAGIC',
    short: 'MAGIC',
    icon: MAGIC,
  },
  {
    key: 'WMATIC',
    name: 'WMATIC',
    short: 'WMATIC',
    icon: MATIC,
  },

  {
    key: 'MATIC',
    name: 'MATIC',
    short: 'MATIC',
    icon: MATIC,
  },
  {
    key: 'STG',
    name: 'STG',
    short: 'STG',
    icon: STG,
  },
  {
    key: 'PENDLE',
    name: 'PENDLE',
    short: 'PENDLE',
    icon: PENDLE,
  },
  {
    key: 'Tether (ETH)',
    name: 'Tether USD',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'GMX',
    name: 'GMX',
    short: 'GMX',
    icon: GMX,
  },
  {
    key: 'USDC',
    name: 'USDC',
    short: 'USDC',
    icon: USDC,
  },
  {
    key: 'USDT',
    name: 'USDT',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'Wrapped BTC (WBTC)',
    name: 'Wrapped BTC',
    short: 'WBTC',
    icon: Btc,
  },
  {
    key: 'BTCB',
    name: 'BTCB',
    short: 'BTCB',
    icon: Btc,
  },
  {
    key: 'ARB',
    name: 'ARB',
    short: 'ARB',
    icon: ARB,
  },
  {
    key: 'Wrapped BNB',
    name: 'WBNB',
    short: 'WBNB',
    icon: WBNB,
  },
  {
    key: 'BETH',
    name: 'BETH',
    short: 'BETH',
    icon: BETH,
  },
  {
    key: 'VLX',
    name: 'VLX',
    short: 'VLX',
    icon: VLX,
  },
  {
    key: 'BTC',
    name: 'BTC',
    short: 'BTC',
    icon: Btc,
  },

  {
    key: 'LDO',
    name: 'LDO',
    short: 'LDO',
    icon: LDOsmall,
  },

  {
    key: 'ADA',
    name: 'ADA',
    short: 'ADA',
    icon: ADAsmall,
  },
  {
    key: 'AVAX',
    name: 'AVAX',
    short: 'AVAX',
    icon: AVAXsmall,
  },
  {
    key: 'BNB',
    name: 'BNB',
    short: 'BNB',
    icon: BNBsmall,
  },
  {
    key: 'BTC',
    name: 'BTC',
    short: 'BTC',
    icon: BTCsmall,
  },
  {
    key: 'DOGE',
    name: 'DOGE',
    short: 'DOGE',
    icon: DOGEsmall,
  },
  {
    key: 'ETH',
    name: 'ETH',
    short: 'ETH',
    icon: ETHsmall,
  },

  {
    key: 'GHST',
    name: 'GHST',
    short: 'GHST',
    icon: GHSTsmall,
  },
  {
    key: 'GMX',
    name: 'GMX',
    short: 'GMX',
    icon: GMXsmall,
  },

  {
    key: 'LTC',
    name: 'LTC',
    short: 'LTC',
    icon: LTCsmall,
  },
  {
    key: 'MATIC',
    name: 'MATIC',
    short: 'MATIC',
    icon: MATICsmall,
  },

  {
    key: 'OP',
    name: 'OP',
    short: 'OP',
    icon: OPsmall,
  },

  {
    key: 'PAXG',
    name: 'PAXG',
    short: 'PAXG',
    icon: PAXG,
  },

  {
    key: 'SOL',
    name: 'SOL',
    short: 'SOL',
    icon: SOLsmall,
  },
  {
    key: 'STG',
    name: 'STG',
    short: 'STG',
    icon: STGsmall,
  },

  {
    key: 'USDT',
    name: 'USDT',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'XRP',
    name: 'XRP',
    short: 'XRP',
    icon: XRPsmall,
  },

  {
    key: 'ARB',
    name: 'ARB',
    short: 'ARB',
    icon: ARBsmall,
  },
  {
    key: 'CAKE',
    name: 'CAKE',
    short: 'CAKE',
    icon: CAKE,
  },
  {
    key: 'Cake',
    name: 'Cake',
    short: 'Cake',
    icon: CAKE,
  },

  {
    key: 'DOT',
    name: 'DOT',
    short: 'DOT',
    icon: DOT,
  },
  {
    key: 'INJ',
    name: 'INJ',
    short: 'INJ',
    icon: INJ,
  },
  {
    key: 'LINK',
    name: 'LINK',
    short: 'LINK',
    icon: LINK,
  },
  {
    key: 'DOGE',
    name: 'DOGE',
    short: 'DOGE',
    icon: DOGE,
  },
  {
    key: 'PPN',
    name: 'PPN',
    short: 'PPN',
    icon: PPN,
  },
  {
    key: 'GMRX',
    name: 'GMRX',
    short: 'GMRX',
    icon: GMRX,
  },
  {
    key: 'UNI',
    name: 'UNI',
    short: 'UNI',
    icon: UNI,
  },
  {
    key: 'NEAR',
    name: 'NEAR',
    short: 'NEAR',
    icon: NEAR,
  },
  {
    key: 'FTM',
    name: 'FTM',
    short: 'FTM',
    icon: FTM,
  },
  {
    key: 'FDUSD',
    name: 'FDUSD',
    short: 'FDUSD',
    icon: FDUSD,
  },
  {
    key: 'SANTOS',
    name: 'SANTOS',
    short: 'SANTOS',
    icon: SANTOS,
  },
  {
    key: 'BCH',
    name: 'BCH',
    short: 'BCH',
    icon: BCH,
  },
  {
    key: 'AI',
    name: 'AI',
    short: 'AI',
    icon: AI,
  },
  {
    key: 'JST',
    name: 'JST',
    short: 'JST',
    icon: JST,
  },
  {
    key: 'GMT',
    name: 'GMT',
    short: 'GMT',
    icon: GMT,
  },
  {
    key: 'GMT',
    name: 'GMT',
    short: 'GMT',
    icon: GMT,
  },
  {
    key: 'GMT',
    name: 'GMT',
    short: 'GMT',
    icon: GMT,
  },
  {
    key: 'VITE',
    name: 'VITE',
    short: 'VITE',
    icon: VITE,
  },
  {
    key: 'CFX',
    name: 'CFX',
    short: 'CFX',
    icon: CFX,
  },
  {
    key: 'SFP',
    name: 'SFP',
    short: 'SFP',
    icon: SFP,
  },
  {
    key: 'DIA',
    name: 'DIA',
    short: 'DIA',
    icon: DIA,
  },
  {
    key: 'WOO',
    name: 'WOO',
    short: 'WOO',
    icon: WOO,
  },
  {
    key: 'ELF',
    name: 'ELF',
    short: 'ELF',
    icon: ELF,
  },
  {
    key: 'ACE',
    name: 'ACE',
    short: 'ACE',
    icon: ACE,
  },
  {
    key: 'BEL',
    name: 'BEL',
    short: 'BEL',
    icon: BEL,
  },
  {
    key: 'CHR',
    name: 'CHR',
    short: 'CHR',
    icon: CHR,
  },
  {
    key: 'WAVES',
    name: 'WAVES',
    short: 'WAVES',
    icon: WAVES,
  },
  {
    key: 'ADX',
    name: 'ADX',
    short: 'ADX',
    icon: ADX,
  },
  {
    key: 'FLOKI',
    name: 'FLOKI',
    short: 'FLOKI',
    icon: FLOKI,
  },
  {
    key: 'JASMY',
    name: 'JASMY',
    short: 'JASMY',
    icon: JASMY,
  },
  {
    key: 'SAND',
    name: 'SAND',
    short: 'SAND',
    icon: SAND,
  },
  {
    key: 'OCEAN',
    name: 'OCEAN',
    short: 'OCEAN',
    icon: OCEAN,
  },
  {
    key: 'COTI',
    name: 'COTI',
    short: 'COTI',
    icon: COTI,
  },
  {
    key: 'FIS',
    name: 'FIS',
    short: 'FIS',
    icon: FIS,
  },
  {
    key: 'BAL',
    name: 'BAL',
    short: 'BAL',
    icon: BAL,
  },
  {
    key: 'FIL',
    name: 'FIL',
    short: 'FIL',
    icon: FIL,
  },
  {
    key: 'KSM',
    name: 'KSM',
    short: 'KSM',
    icon: KSM,
  },
  {
    key: 'UFT',
    name: 'UFT',
    short: 'UFT',
    icon: UFT,
  },
  {
    key: 'CYBER',
    name: 'CYBER',
    short: 'CYBER',
    icon: CYBER,
  },
  {
    key: 'XLM',
    name: 'XLM',
    short: 'XLM',
    icon: XLM,
  },
  {
    key: 'DF',
    name: 'DF',
    short: 'DF',
    icon: DF,
  },
  {
    key: 'LINA',
    name: 'LINA',
    short: 'LINA',
    icon: LINA,
  },
  {
    key: 'POND',
    name: 'POND',
    short: 'POND',
    icon: POND,
  },
  {
    key: 'LTO',
    name: 'LTO',
    short: 'LTO',
    icon: LTO,
  },
  {
    key: 'WIN',
    name: 'WIN',
    short: 'WIN',
    icon: WIN,
  },
  {
    key: 'FOR',
    name: 'FOR',
    short: 'FOR',
    icon: FOR,
  },
  {
    key: 'BAT',
    name: 'BAT',
    short: 'BAT',
    icon: BAT,
  },
  {
    key: 'LTC',
    name: 'LTC',
    short: 'LTC',
    icon: LTC,
  },
  {
    key: 'DATA',
    name: 'DATA',
    short: 'DATA',
    icon: DATA,
  },
  {
    key: 'CREAM',
    name: 'CREAM',
    short: 'CREAM',
    icon: CREAM,
  },
  {
    key: 'EDU',
    name: 'EDU',
    short: 'EDU',
    icon: EDU,
  },
  {
    key: 'ILV',
    name: 'ILV',
    short: 'ILV',
    icon: ILV,
  },
  {
    key: 'USDP',
    name: 'USDP',
    short: 'USDP',
    icon: USDP,
  },
  {
    key: 'ALPACA',
    name: 'ALPACA',
    short: 'ALPACA',
    icon: ALPACA,
  },
  {
    key: 'VET',
    name: 'VET',
    short: 'VET',
    icon: VET,
  },
  {
    key: 'FET',
    name: 'FET',
    short: 'FET',
    icon: FET,
  },
  {
    key: 'DAR',
    name: 'DAR',
    short: 'DAR',
    icon: DAR,
  },
  {
    key: 'GFTO',
    name: 'GFTO',
    short: 'GFTO',
    icon: GFTO,
  }, 
  {
    key: 'PROM',
    name: 'PROM',
    short: 'PROM',
    icon: PROM,
  },
  {
    key: 'PROS',
    name: 'PROS',
    short: 'PROS',
    icon: PROS,
  },
  {
    key: 'KNC',
    name: 'KNC',
    short: 'KNC',
    icon: KNC,
  },
  {
    key: 'IDEX',
    name: 'IDEX',
    short: 'IDEX',
    icon: IDEX,
  },
  {
    key: 'ALPINE',
    name: 'ALPINE',
    short: 'ALPINE',
    icon: ALPINE,
  },
  {
    key: 'KMD',
    name: 'KMD',
    short: 'KMD',
    icon: KMD,
  },
  {
    key: 'HFT',
    name: 'HFT',
    short: 'HFT',
    icon: HFT,
  },
  {
    key: 'COMP',
    name: 'COMP',
    short: 'COMP',
    icon: COMP,
  },
  {
    key: 'VAI',
    name: 'VAI',
    short: 'VAI',
    icon: VAI,
  },
  {
    key: 'ZIL',
    name: 'ZIL',
    short: 'ZIL',
    icon: ZIL,
  },  
  {
    key: 'BIDR',
    name: 'BIDR',
    short: 'BIDR',
    icon: BIDR,
  },
  {
    key: 'AXS',
    name: 'AXS',
    short: 'AXS',
    icon: AXS,
  },
  {
    key: 'PEOPLE',
    name: 'PEOPLE',
    short: 'PEOPLE',
    icon: PEOPLE,
  },
  {
    key: 'SCRT',
    name: 'SCRT',
    short: 'SCRT',
    icon: SCRT,
  },
  {
    key: 'TUSD',
    name: 'TUSD',
    short: 'TUSD',
    icon: TUSD,
  },
  {
    key: 'TKO',
    name: 'TKO',
    short: 'TKO',
    icon: TKO,
  },
  {
    key: 'IDRT',
    name: 'IDRT',
    short: 'IDRT',
    icon: IDRT,
  },
  {
    key: 'OAX',
    name: 'OAX',
    short: 'OAX',
    icon: OAX,
  },
  {
    key: 'HARD',
    name: 'HARD',
    short: 'HARD',
    icon: HARD,
  },
  {
    key: 'YGG',
    name: 'YGG',
    short: 'YGG',
    icon: YGG,
  },
  {
    key: 'XEC',
    name: 'XEC',
    short: 'XEC',
    icon: XEC,
  },
  {
    key: 'YFI',
    name: 'YFI',
    short: 'YFI',
    icon: YFI,
  },
  {
    key: 'BONK',
    name: 'BONK',
    short: 'BONK',
    icon: BONK,
  },
  {
    key: 'PERP',
    name: 'PERP',
    short: 'PERP',
    icon: PERP,
  },
  {
    key: 'AAVE',
    name: 'AAVE',
    short: 'AAVE',
    icon: AAVE,
  },
  {
    key: 'MASK',
    name: 'MASK',
    short: 'MASK',
    icon: MASK,
  },
  {
    key: 'ORN',
    name: 'ORN',
    short: 'ORN',
    icon: ORN,
  },
  {
    key: 'COMBO',
    name: 'COMBO',
    short: 'COMBO',
    icon: COMBO,
  },
  {
    key: 'GAL',
    name: 'GAL',
    short: 'GAL',
    icon: GAL,
  },
  {
    key: 'AVA',
    name: 'AVA',
    short: 'AVA',
    icon: AVA,
  },
  {
    key: 'TROY',
    name: 'TROY',
    short: 'TROY',
    icon: TROY,
  },
  {
    key: 'VIDT',
    name: 'VIDT',
    short: 'VIDT',
    icon: VIDT,
  },
  {
    key: 'SYN',
    name: 'SYN',
    short: 'SYN',
    icon: SYN,
  },
  {
    key: 'CTSI',
    name: 'CTSI',
    short: 'CTSI',
    icon: CTSI,
  },
  {
    key: 'ALPHA',
    name: 'ALPHA',
    short: 'ALPHA',
    icon: ALPHA,
  },
  {
    key: 'TLM',
    name: 'TLM',
    short: 'TLM',
    icon: TLM,
  },
  {
    key: 'DUSK',
    name: 'DUSK',
    short: 'DUSK',
    icon: DUSK,
  },
  {
    key: 'LOOM',
    name: 'LOOM',
    short: 'LOOM',
    icon: LOOM,
  },
  {
    key: 'ZEC',
    name: 'ZEC',
    short: 'ZEC',
    icon: ZEC,
  },
  {
    key: 'LIT',
    name: 'LIT',
    short: 'LIT',
    icon: LIT,
  },
  {
    key: 'DODO',
    name: 'DODO',
    short: 'DODO',
    icon: DODO,
  },
  {
    key: 'MKR',
    name: 'MKR',
    short: 'MKR',
    icon: MKR,
  },
  {
    key: 'ATA',
    name: 'ATA',
    short: 'ATA',
    icon: ATA,
  },
  {
    key: 'MANA',
    name: 'MANA',
    short: 'MANA',
    icon: MANA,
  },
  {
    key: 'FIRO',
    name: 'FIRO',
    short: 'FIRO',
    icon: FIRO,
  },
  {
    key: 'ONT',
    name: 'ONT',
    short: 'ONT',
    icon: ONT,
  },
  {
    key: 'SUSHI',
    name: 'SUSHI',
    short: 'SUSHI',
    icon: SUSHI,
  },
  {
    key: 'ANKR',
    name: 'ANKR',
    short: 'ANKR',
    icon: ANKR,
  },
  {
    key: 'CVP',
    name: 'CVP',
    short: 'CVP',
    icon: CVP,
  },
  {
    key: 'REEF',
    name: 'REEF',
    short: 'REEF',
    icon: REEF,
  },
  {
    key: 'IOTA',
    name: 'IOTA',
    short: 'IOTA',
    icon: IOTA,
  },
  {
    key: 'TWT',
    name: 'TWT',
    short: 'TWT',
    icon: TWT,
  },
  {
    key: 'SUN',
    name: 'SUN',
    short: 'SUN',
    icon: SUN,
  },
  {
    key: 'BAND',
    name: 'BAND',
    short: 'BAND',
    icon: BAND,
  },
  {
    key: 'WBETH',
    name: 'WBETH',
    short: 'WBETH',
    icon: WBETH,
  },
  {
    key: 'BSW',
    name: 'BSW',
    short: 'BSW',
    icon: BSW,
  },
  {
    key: 'MBOX',
    name: 'MBOX',
    short: 'MBOX',
    icon: MBOX,
  },
  {
    key: 'QI',
    name: 'QI',
    short: 'QI',
    icon: QI,
  },
  {
    key: 'PNT',
    name: 'PNT',
    short: 'PNT',
    icon: PNT,
  },
  {
    key: 'FRONT',
    name: 'FRONT',
    short: 'FRONT',
    icon: FRONT,
  },
  {
    key: 'SHIB',
    name: 'SHIB',
    short: 'SHIB',
    icon: SHIB,
  },
  {
    key: 'IOTX',
    name: 'IOTX',
    short: 'IOTX',
    icon: IOTX,
  },
  {
    key: 'ARPA',
    name: 'ARPA',
    short: 'ARPA',
    icon: ARPA,
  },
  {
    key: 'CTK',
    name: 'CTK',
    short: 'CTK',
    icon: CTK,
  },
  {
    key: 'BUSD',
    name: 'BUSD',
    short: 'BUSD',
    icon: BUSD,
  },
  {
    key: 'APE',
    name: 'APE',
    short: 'APE',
    icon: APE,
  },
  {
    key: 'BETA',
    name: 'BETA',
    short: 'BETA',
    icon: BETA,
  },
  {
    key: 'AEUR',
    name: 'AEUR',
    short: 'AEUR',
    icon: AEUR,
  },
  {
    key: 'OM',
    name: 'OM',
    short: 'OM',
    icon: OM,
  },
  {
    key: 'ALICE',
    name: 'ALICE',
    short: 'ALICE',
    icon: ALICE,
  },
  {
    key: 'FLUX',
    name: 'FLUX',
    short: 'FLUX',
    icon: FLUX,
  },
  {
    key: 'BAKE',
    name: 'BAKE',
    short: 'BAKE',
    icon: BAKE,
  },
  {
    key: 'EVX',
    name: 'EVX',
    short: 'EVX',
    icon: EVX,
  },
  {
    key: 'EGLD',
    name: 'EGLD',
    short: 'EGLD',
    icon: EGLD,
  },
  {
    key: 'NULS',
    name: 'NULS',
    short: 'NULS',
    icon: NULS,
  },
  {
    key: 'MDX',
    name: 'MDX',
    short: 'MDX',
    icon: MDX,
  },
  {
    key: 'NFT',
    name: 'NFT',
    short: 'NFT',
    icon: NFT,
  },
  {
    key: 'MDT',
    name: 'MDT',
    short: 'MDT',
    icon: MDT,
  },
  {
    key: 'TRX',
    name: 'TRX',
    short: 'TRX',
    icon: TRX,
  },
  {
    key: 'NFP',
    name: 'NFP',
    short: 'NFP',
    icon: NFP,
  },
  {
    key: 'DREP',
    name: 'DREP',
    short: 'DREP',
    icon: DREP,
  },
  {
    key: 'DREP',
    name: 'DREP',
    short: 'DREP',
    icon: DREP,
  },
  {
    key: 'TRU',
    name: 'TRU',
    short: 'TRU',
    icon: TRU,
  },
  {
    key: 'BNX',
    name: 'BNX',
    short: 'BNX',
    icon: BNX,
  },
  {
    key: 'BNT',
    name: 'BNT',
    short: 'BNT',
    icon: BNT,
  },
  {
    key: 'TUSDOLD',
    name: 'TUSDOLD',
    short: 'TUSDOLD',
    icon: TUSDOLD
  },
  {
    key: 'AUCTION',
    name: 'AUCTION',
    short: 'AUCTION',
    icon: AUCTION
  },
  {
    key: 'OGN',
    name: 'OGN',
    short: 'OGN',
    icon: OGN
  },
  {
    key: 'CELR',
    name: 'CELR',
    short: 'CELR',
    icon: CELR
  },
  {
    key: 'ETC',
    name: 'ETC',
    short: 'ETC',
    icon: ETC
  },
  {
    key: 'GLMR',
    name: 'GLMR',
    short: 'GLMR',
    icon: GLMR
  },
  {
    key: 'QKC',
    name: 'QKC',
    short: 'QKC',
    icon: QKC
  },
  {
    key: 'COS',
    name: 'COS',
    short: 'COS',
    icon: COS
  },
  {
    key: 'SNX',
    name: 'SNX',
    short: 'SNX',
    icon: SNX
  },
  {
    key: 'MBL',
    name: 'MBL',
    short: 'MBL',
    icon: MBL
  },
  {
    key: 'BLZ',
    name: 'BLZ',
    short: 'BLZ',
    icon: BLZ
  },
  {
    key: 'ATOM',
    name: 'ATOM',
    short: 'ATOM',
    icon: ATOM
  },
  {
    key: 'PHB',
    name: 'PHB',
    short: 'PHB',
    icon: PHB
  },
  {
    key: 'BEAMX',
    name: 'BEAMX',
    short: 'BEAMX',
    icon: BEAMX
  },
  {
    key: 'PHA',
    name: 'PHA',
    short: 'PHA',
    icon: PHA
  },
  {
    key: 'MAV',
    name: 'MAV',
    short: 'MAV',
    icon: MAV
  },
  {
    key: 'UNFI',
    name: 'UNFI',
    short: 'UNFI',
    icon: UNFI
  },
  {
    key: 'DEGO',
    name: 'DEGO',
    short: 'DEGO',
    icon: DEGO
  },
  {
    key: 'CHESS',
    name: 'CHESS',
    short: 'CHESS',
    icon: CHESS
  },
  {
    key: 'LAZIO',
    name: 'LAZIO',
    short: 'LAZIO',
    icon: LAZIO
  },
  {
    key: 'ID',
    name: 'ID',
    short: 'ID',
    icon: ID
  },
  {
    key: 'VRT',
    name: 'VRT',
    short: 'VRT',
    icon: VRT
  },
  {
    key: 'SLP',
    name: 'SLP',
    short: 'SLP',
    icon: SLP
  },
  {
    key: 'XVS',
    name: 'XVS',
    short: 'XVS',
    icon: XVS
  },
  {
    key: 'FLOW',
    name: 'FLOW',
    short: 'FLOW',
    icon: FLOW
  },
  {
    key: 'EPX',
    name: 'EPX',
    short: 'EPX',
    icon: EPX
  },
  {
    key: 'CLV',
    name: 'CLV',
    short: 'CLV',
    icon: CLV
  },
  {
    key: 'HOOK',
    name: 'HOOK',
    short: 'HOOK',
    icon: HOOK
  },
  {
    key: 'BURGER',
    name: 'BURGER',
    short: 'BURGER',
    icon: BURGER
  },
  {
    key: 'SOLO',
    name: 'SOLO',
    short: 'SOLO',
    icon: SOLO
  },
  {
    key: 'EOS',
    name: 'EOS',
    short: 'EOS',
    icon: EOS
  },
]

const EMPTY_TOKEN = {
  key: '',
  name: '',
  short: '',
  icon: '',
}

/**
 * Function to get a token entity.
 * @param {string} tokenKey - The key of the token.
 * @param {('key'|'name'|'short'|'icon')} [key='key'] - The key to be used. It can be 'key', 'name', 'short', or 'icon'.
 * @returns {Object} The token entity.
 */
export const getTokenEntity = (tokenKey, key = 'key') => {
  let found = tokenHT.find((tokenHTEntry) => tokenHTEntry[key] === tokenKey)
  if (!found) return { ...EMPTY_TOKEN, short: tokenKey }
  return found
}
