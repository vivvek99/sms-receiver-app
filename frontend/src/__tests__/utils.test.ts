import { truncateText, getCountryFlag } from '../lib/utils';

describe('Utility Functions', () => {
  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text', () => {
      expect(truncateText('Hello World!', 10)).toBe('Hello W...');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });

  describe('getCountryFlag', () => {
    it('should return US flag for US code', () => {
      expect(getCountryFlag('US')).toBe('🇺🇸');
    });

    it('should return UK flag for GB code', () => {
      expect(getCountryFlag('GB')).toBe('🇬🇧');
    });
  });
});
