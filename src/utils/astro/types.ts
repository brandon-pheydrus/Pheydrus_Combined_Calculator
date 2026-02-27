/**
 * Core type definitions for astrology calculations
 */

export type AngleKey = 'ASC' | 'DSC' | 'MC' | 'IC';
export type PlanetKey =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export type LonLat = {
  lon: number; // -180..180
  lat: number; // -90..90
};

export type JulianDay = number;

export interface PlanetPosition {
  planet: PlanetKey;
  lon: number; // 0..360
  lat: number;
  distance: number;
  isRetro: boolean;
}

export interface Angles {
  asc: number; // 0..360
  dsc: number; // 0..360
  mc: number; // 0..360
  ic: number; // 0..360
}

export interface Houses {
  system: 'placidus' | 'whole-sign';
  cusps: number[]; // length 12
}

export interface AngularHit {
  planet: PlanetKey | string;
  angle: AngleKey;
  orbDegrees: number;
}

export interface PlanetWithHouse {
  key: string;
  lon: number;
  signIndex: number;
  house: number;
}
