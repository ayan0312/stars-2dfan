import { expect } from 'chai'
import { verifyURL } from '../packages/utils'

describe('verify url', () => {
    it('should return ture when the value is URL', () => {
        expect(verifyURL('https://www.2dfan.com/tags/ADV/page/9/?order=released_at')).to.be.equal(
            true,
        )
        expect(verifyURL('https://www.2dfan.com/subjects/2041', '2dfan.com')).to.be.equal(true)
        expect(verifyURL('https://www.2dfan.com/topics/2041', '2dfan.com')).to.be.equal(true)
        expect(verifyURL('www.2dfan.com/topics/8290', '2dfan.com')).to.be.equal(true)
        expect(verifyURL('https://www.2dfan.com/groups/')).to.be.equal(true)
        expect(verifyURL('https://www.2dfan.com/users/not_authenticated/')).to.be.equal(true)
        expect(verifyURL('www.2dfan.com/users/84657')).to.be.equal(true)
        expect(verifyURL('www.2dfan.com/users/84657/lists', '2dfan.com')).to.be.equal(true)
    })
    it('should return false when the value is not URL of 2DFan', () => {
        expect(verifyURL('https://v.douyu.com/show/2V0JMVaLJBb7RY5k', '2dfan.com')).to.be.equal(
            false,
        )
        expect(verifyURL('https://www.bilibili.com/', '2dfan.com')).to.be.equal(false)
        expect(verifyURL('https://github.com/ayan0312', '2dfan.com')).to.be.equal(false)
        expect(verifyURL('https://www.ggbases.com/', '2dfan.com')).to.be.equal(false)
    })
})
