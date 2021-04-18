import { requireTypescript } from '../index';
import Test1 from '../testModules/test1';
const path = require('path');

describe('require-typescript test', () => {
  it('测试纯配置引入', () => {
    const test1 = requireTypescript<typeof Test1>(path.resolve(__dirname, '../testModules/test1.ts'));
    expect(test1.name).toBe(Test1.name);
    expect(test1.desc).toBe(Test1.desc);
  })
})