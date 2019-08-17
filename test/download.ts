import path from 'path'
import { downloadImage } from '../packages/core/download/image'

describe('Download', () => {
    it('should download four images', async () => {
        await downloadImage({
            name: '母爛漫',
            url:
                'https://img.2dfan.com/uploads/subjects/packages/a632f39e35ade45ad1ea0971a5589733.jpg?imageMogr2/quality/85!/thumbnail/180x240',
            path: path.resolve(__dirname, 'test_download'),
            timestamp: '111111111',
        })

        await downloadImage({
            name: '真恋 ～寄语枫秋～',
            url:
                'https://img.2dfan.com/old_source/1306/2056_1.jpg?imageMogr2/quality/85!/thumbnail/180x240',
            path: path.resolve(__dirname, 'test_download'),
            timestamp: '2222222',
        })

        await downloadImage({
            name: 'ダンジョン オブ レガリアス ～背徳の都イシュガリア～',
            url:
                'https://img.2dfan.com/old_source/1602/3076_1.jpg?imageMogr2/quality/85!/thumbnail/180x240',
            path: path.resolve(__dirname, 'test_download'),
            timestamp: '33123123',
        })

        await downloadImage({
            name: '剣聖機 アルファライド',
            url:
                'https://img.2dfan.com/old_source/1411/2628_1.jpg?imageMogr2/quality/85!/thumbnail/180x240',
            path: path.resolve(__dirname, 'test_download'),
            timestamp: '12523124',
        })
    })
})
