import { convert } from '../src/lib/convertData';

import { dataToBeConverted } from './mockData/dataToBeConverted';

import { convertedData } from './mockData/convertedData';

describe('test convertData', () => {
    test('convertData success or not', () => {
        expect(convert(dataToBeConverted)).toEqual(convertedData);
    });
});