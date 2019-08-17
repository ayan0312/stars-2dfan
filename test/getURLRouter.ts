import { expect } from 'chai'
import { getURLRouter } from '../packages/utils'

describe('get URL router', () => {
    it('should return ture when the value is near router', () => {
        expect(
            getURLRouter('https://www.2dfan.com/subjects/7914', 'subjects') === '7914',
        ).to.be.equal(true)
        expect(
            getURLRouter('https://www.2dfan.com/subjects/534?pd=23', 'subjects') === '534',
        ).to.be.equal(true)
        expect(getURLRouter('https://www.2dfan.com/topics/123', 'topics') === '123').to.be.equal(
            true,
        )
        expect(
            getURLRouter('https://www.2dfan.com/topics/9878/page/3', 'topics') === '9878',
        ).to.be.equal(true)
        expect(
            getURLRouter('https://www.2dfan.com/subjects/7914', 'subjects') === '7914',
        ).to.be.equal(true)
    })
})
