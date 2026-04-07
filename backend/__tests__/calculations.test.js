const { calculateBMI, calculateCalorieNeeds } = require('../utils/calculations');

describe('calculateBMI', () => {
  it('returns correct BMI for normal values', () => {
    // 70kg, 175cm → 70 / (1.75^2) = 22.86
    expect(Number(calculateBMI(70, 175))).toBeCloseTo(22.86, 1);
  });

  it('returns a string with 2 decimal places', () => {
    const result = calculateBMI(80, 180);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d+\.\d{2}$/);
  });
});

describe('calculateCalorieNeeds', () => {
  it('returns a number', () => {
    expect(typeof calculateCalorieNeeds(70, 175, 25, 'maintain')).toBe('number');
  });

  it('returns less calories for lose goal', () => {
    const maintain = calculateCalorieNeeds(70, 175, 25, 'maintain');
    const lose     = calculateCalorieNeeds(70, 175, 25, 'lose');
    expect(lose).toBeLessThan(maintain);
  });

  it('returns more calories for gain goal', () => {
    const maintain = calculateCalorieNeeds(70, 175, 25, 'maintain');
    const gain     = calculateCalorieNeeds(70, 175, 25, 'gain');
    expect(gain).toBeGreaterThan(maintain);
  });

  it('never returns below 1200 kcal (minimum safe limit)', () => {
    // Very low weight/height/age combination
    const result = calculateCalorieNeeds(30, 100, 80, 'lose');
    expect(result).toBeGreaterThanOrEqual(1200);
  });

  it('returns a rounded integer', () => {
    const result = calculateCalorieNeeds(70, 175, 25, 'maintain');
    expect(result).toBe(Math.round(result));
  });
});
