import { test } from '@jest/globals'

const testIf = (condition) => (condition === 'false') ? test : test.skip

export default testIf
