import { merge } from 'lodash'

const defaultAttrs = {
  token: true,
}

const defaultArgs = {
  where: {
    contract: '0xb04dc0b5106eb9e618c80480bb1d7d9220e89a76',
    blockTimestamp_gt: '91976475',
  },
}

export default (args = {}, attrs = {}) => ({
  transfers: {
    __args: merge({}, defaultArgs, args),
    ...merge({}, defaultAttrs, attrs),
  },
})
