import { DayMarineForecast, DayWeatherForecast } from '~/weather/forecast.dto';
import ForecastToActivityScore from '~/activities/score/forecast-to-activity-score';

describe('ForecastToActivityScore', () => {
  // Mock data
  const mockDate = '2023-08-01';
  let weatherForecast: DayWeatherForecast;
  let marineForecast: DayMarineForecast;

  beforeEach(() => {
    weatherForecast = {
      date: mockDate,
      temperatureHigh: 20,
      temperatureLow: 10,
      precipitationChance: 0.3,
      windSpeed: 15, // km/h
      cloudCover: 0.4,
      snowfall: 0,
    } as DayWeatherForecast;

    marineForecast = {
      date: mockDate,
      waveHeightMax: 1.2,
      wavePeriodMax: 10,
    } as DayMarineForecast;
  });

  describe('calculate method', () => {
    it('should throw an error when marine and weather forecast dates do not match', () => {
      const mismatchedMarine = { ...marineForecast, date: '2023-08-02' };
      expect(() => {
        ForecastToActivityScore.calculate('surfing', weatherForecast, mismatchedMarine);
      }).toThrow('Marine and weather forecast dates do not match');
    });

    it('should throw an error for unknown activity', () => {
      expect(() => {
        ForecastToActivityScore.calculate('unknown' as any, weatherForecast);
      }).toThrow('Unknown activity');
    });

    it('should call the correct activity calculator', () => {
      // Spy on calculator methods
      const skiingSpy = jest.spyOn(ForecastToActivityScore as any, 'calculateSkiingScore');
      const surfingSpy = jest.spyOn(ForecastToActivityScore as any, 'calculateSurfingScore');
      const indoorSpy = jest.spyOn(ForecastToActivityScore as any, 'calculateIndoorSightseeingScore');
      const outdoorSpy = jest.spyOn(ForecastToActivityScore as any, 'calculateOutdoorSightseeingScore');

      ForecastToActivityScore.calculate('skiing', weatherForecast);
      ForecastToActivityScore.calculate('surfing', weatherForecast, marineForecast);
      ForecastToActivityScore.calculate('indoor_sightseeing', weatherForecast);
      ForecastToActivityScore.calculate('outdoor_sightseeing', weatherForecast);

      expect(skiingSpy).toHaveBeenCalledWith(weatherForecast);
      expect(surfingSpy).toHaveBeenCalledWith(weatherForecast, marineForecast);
      expect(indoorSpy).toHaveBeenCalledWith(weatherForecast);
      expect(outdoorSpy).toHaveBeenCalledWith(weatherForecast);
    });
  });

  describe('skiing score', () => {
    it('should calculate high score for good skiing conditions', () => {
      const goodSkiConditions: DayWeatherForecast = {
        ...weatherForecast,
        temperatureHigh: -5,
        temperatureLow: -10,
        snowfall: 15,
        windSpeed: 10,
      };

      const result = ForecastToActivityScore.calculate('skiing', goodSkiConditions);

      expect(result.score).toBeGreaterThan(70);
      expect(result.date).toBe(mockDate);
      expect(result.reason).toContain('15cm fresh');
    });

    it('should calculate low score for poor skiing conditions', () => {
      const poorSkiConditions: DayWeatherForecast = {
        ...weatherForecast,
        temperatureHigh: 10,
        snowfall: 0,
        windSpeed: 40,
      };

      const result = ForecastToActivityScore.calculate('skiing', poorSkiConditions);

      expect(result.score).toBeLessThan(30);
      expect(result.date).toBe(mockDate);
    });
  });

  describe('surfing score', () => {
    it('should return zero score when no marine data is provided', () => {
      const result = ForecastToActivityScore.calculate('surfing', weatherForecast);

      expect(result.score).toBe(0);
      expect(result.reason).toBe('No marine data');
    });

    it('should calculate high score for good surfing conditions', () => {
      const goodSurfConditions = {
        ...marineForecast,
        waveHeightMax: 1.5,
        wavePeriodMax: 12,
      };

      const calmWeather = {
        ...weatherForecast,
        windSpeed: 10,
        precipitationChance: 0.1,
      };

      const result = ForecastToActivityScore.calculate('surfing', calmWeather, goodSurfConditions);

      expect(result.score).toBeGreaterThan(70);
      expect(result.reason).toContain('1.5m @ 12s');
    });
  });

  describe('indoor sightseeing score', () => {
    it('should calculate high score for bad outdoor conditions', () => {
      const badOutdoorConditions: DayWeatherForecast = {
        ...weatherForecast,
        precipitationChance: 0.9,
        windSpeed: 30,
        temperatureHigh: 35,
        temperatureLow: 28,
      };

      const result = ForecastToActivityScore.calculate('indoor_sightseeing', badOutdoorConditions);

      expect(result.score).toBeGreaterThan(70);
      expect(result.reason).toContain('Rain 90%');
    });

    it('should calculate low score for nice outdoor conditions', () => {
      const niceOutdoorConditions: DayWeatherForecast = {
        ...weatherForecast,
        precipitationChance: 0.1,
        windSpeed: 5,
        temperatureHigh: 22,
        temperatureLow: 16,
      };

      const result = ForecastToActivityScore.calculate('indoor_sightseeing', niceOutdoorConditions);

      expect(result.score).toBeLessThan(30);
    });
  });

  describe('outdoor sightseeing score', () => {
    it('should calculate high score for ideal outdoor conditions', () => {
      const idealOutdoorConditions: DayWeatherForecast = {
        ...weatherForecast,
        temperatureHigh: 20,
        temperatureLow: 16,
        precipitationChance: 0,
        windSpeed: 5,
        cloudCover: 0.1,
      };

      const result = ForecastToActivityScore.calculate('outdoor_sightseeing', idealOutdoorConditions);

      expect(result.score).toBeGreaterThan(80);
      expect(result.reason).toContain('18°C');
    });

    it('should calculate low score for poor outdoor conditions', () => {
      const poorOutdoorConditions: DayWeatherForecast = {
        ...weatherForecast,
        temperatureHigh: 40,
        temperatureLow: 30,
        precipitationChance: 0.8,
        windSpeed: 40,
        cloudCover: 0.9,
      };

      const result = ForecastToActivityScore.calculate('outdoor_sightseeing', poorOutdoorConditions);

      expect(result.score).toBeLessThan(30);
    });
  });
});
