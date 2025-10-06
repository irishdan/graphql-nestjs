import { DayMarineForecast, DayWeatherForecast } from '~/weather/forecast.dto';

class ForecastToActivityScore {
  calculate(
    activity: 'skiing' | 'surfing' | 'indoor_sightseeing' | 'outdoor_sightseeing',
    weatherForecast: DayWeatherForecast,
    marineForecast?: DayMarineForecast,
  ): { date: string; score: number; reason?: string } {
    if (marineForecast && weatherForecast.date !== marineForecast.date) {
      throw new Error('Marine and weather forecast dates do not match');
    }

    switch (activity) {
      case 'skiing':
        return this.calculateSkiingScore(weatherForecast);
      case 'surfing':
        return this.calculateSurfingScore(weatherForecast, marineForecast);
      case 'indoor_sightseeing':
        return this.calculateIndoorSightseeingScore(weatherForecast);
      case 'outdoor_sightseeing':
        return this.calculateOutdoorSightseeingScore(weatherForecast);
      default:
        throw new Error('Unknown activity');
    }
  }

  private calculateSkiingScore(weather: DayWeatherForecast): { date: string; score: number; reason: string } {
    // Assume we have a base snow depth of 25cm or use snowfall as a base estimate
    const estimatedBaseDepth = weather.snowfall * 5; // Simple estimation
    const base = this.clamp01(estimatedBaseDepth / 50);
    const fresh = this.band(weather.snowfall, 5, 20);
    const cold = this.band(-weather.temperatureHigh, 2, 10);
    // Convert km/h to m/s approximately (divide by 3.6)
    const windInMS = weather.windSpeed / 3.6;
    const wind = 1 - this.map01(windInMS, 6, 12);

    let s = 0.45 * base + 0.25 * fresh + 0.15 * cold + 0.15 * wind;
    s *= weather.temperatureHigh <= 0 ? 1.0 : 0.7;

    return {
      date: weather.date,
      score: Math.round(100 * this.clamp01(s)),
      reason: `${weather.snowfall}cm fresh, base ${Math.round(estimatedBaseDepth)}cm, max ${weather.temperatureHigh}°C, wind ${windInMS.toFixed(1)}m/s`,
    };
  }

  private calculateSurfingScore(
    weather: DayWeatherForecast,
    marine?: DayMarineForecast,
  ): { date: string; score: number; reason: string } {
    if (!marine) {
      return { date: weather.date, score: 0, reason: 'No marine data' };
    }

    const waves = this.band(marine.waveHeightMax, 0.8, 1.8);
    const period = this.band(marine.wavePeriodMax, 8, 14);
    const windInMS = weather.windSpeed / 3.6;
    const wind = 1 - this.map01(windInMS, 5, 10);
    const rain = 1 - this.map01(weather.precipitationChance, 0.2, 0.8);

    const s = 0.45 * waves + 0.3 * period + 0.2 * wind + 0.05 * rain;

    return {
      date: weather.date,
      score: Math.round(100 * this.clamp01(s)),
      reason: `${marine.waveHeightMax}m @ ${marine.wavePeriodMax}s, wind ${windInMS.toFixed(1)}m/s`,
    };
  }

  private calculateIndoorSightseeingScore(weather: DayWeatherForecast): {
    date: string;
    score: number;
    reason: string;
  } {
    const avgTemp = (weather.temperatureHigh + weather.temperatureLow) / 2;
    const cold = this.map01(8 - avgTemp, -10, 8);
    const hot = this.map01(avgTemp - 28, -5, 10);
    const rain = this.map01(weather.precipitationChance, 0.2, 0.8);
    const windInMS = weather.windSpeed / 3.6;
    const wind = this.map01(windInMS, 6, 12);

    const s = this.clamp01(0.35 * Math.max(cold, hot) + 0.45 * rain + 0.2 * wind);

    return {
      date: weather.date,
      score: Math.round(100 * s),
      reason: `Rain ${Math.round(weather.precipitationChance * 100)}% / wind ${windInMS.toFixed(1)}m/s`,
    };
  }

  private calculateOutdoorSightseeingScore(weather: DayWeatherForecast): {
    date: string;
    score: number;
    reason: string;
  } {
    const avgTemp = (weather.temperatureHigh + weather.temperatureLow) / 2;
    const temp = 1 - Math.abs((avgTemp - 18) / 12); // peak at ~18°C
    const windInMS = weather.windSpeed / 3.6;
    const wind = 1 - this.map01(windInMS, 6, 12);
    const rain = 1 - this.map01(weather.precipitationChance, 0.1, 0.7);
    const cloud = 1 - this.map01(weather.cloudCover, 0.2, 0.9);

    const s = this.clamp01(0.4 * temp + 0.3 * rain + 0.2 * wind + 0.1 * cloud);

    return {
      date: weather.date,
      score: Math.round(100 * s),
      reason: `${Math.round(avgTemp)}°C, rain ${Math.round(weather.precipitationChance * 100)}%`,
    };
  }
  // Helper functions
  private clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
  }

  private map01(value: number, min: number, max: number): number {
    return this.clamp01((value - min) / (max - min));
  }

  private band(value: number, min: number, max: number): number {
    return this.map01(value, min, max);
  }
}

export default new ForecastToActivityScore();
