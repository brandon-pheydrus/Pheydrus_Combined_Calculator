/**
 * Time conversion utilities for astrology
 * Handles timezone conversions and Julian Day calculations
 */

import '@js-temporal/polyfill';
import type { JulianDay } from './types';

// Temporal is injected into globalThis by the polyfill
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Temporal: any;

const JD_AT_UNIX_EPOCH = 2440587.5;
const MS_PER_DAY = 86400000;

export interface BirthDateTimeInput {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm:ss
  timeZone: string; // IANA timezone (e.g., "America/New_York")
}

/**
 * Convert local birth date/time to UTC Date
 * Uses Temporal API for accurate timezone handling
 *
 * @param input - Birth date, time, and timezone
 * @returns UTC Date object
 */
export function birthLocalToUtcDate({ date, time, timeZone }: BirthDateTimeInput): Date {
  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const second = 0;

  // Create Plain DateTime (no timezone)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plainDt = (Temporal as any).PlainDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
  });

  // Create ZonedDateTime with specified timezone
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zdt = (Temporal as any).ZonedDateTime.from({
    timeZone,
    year: plainDt.year,
    month: plainDt.month,
    day: plainDt.day,
    hour: plainDt.hour,
    minute: plainDt.minute,
    second: plainDt.second,
  });

  // Convert to UTC Instant and get milliseconds
  const instant = zdt.toInstant();
  const epochMillis = Number(instant.epochMilliseconds);

  return new Date(epochMillis);
}

/**
 * Convert UTC Date to Julian Day Number
 *
 * @param utcDate - UTC Date object
 * @returns Julian Day Number
 */
export function utcDateToJulianDay(utcDate: Date): JulianDay {
  return utcDate.getTime() / MS_PER_DAY + JD_AT_UNIX_EPOCH;
}

/**
 * Convert Julian Day Number to UTC Date
 *
 * @param jd - Julian Day Number
 * @returns UTC Date object
 */
export function julianDayToUtcDate(jd: JulianDay): Date {
  return new Date((jd - JD_AT_UNIX_EPOCH) * MS_PER_DAY);
}

/**
 * Convert local birth date/time to Julian Day
 * Combines birthLocalToUtcDate and utcDateToJulianDay
 *
 * @param input - Birth date, time, and timezone
 * @returns Julian Day Number
 */
export function birthLocalToJulianDay(input: BirthDateTimeInput): JulianDay {
  const utcDate = birthLocalToUtcDate(input);
  return utcDateToJulianDay(utcDate);
}

/**
 * Calculate Julian Day using raw date components
 * Alternative method for direct calculation
 *
 * @param year - Gregorian year
 * @param month - Month (1-12)
 * @param day - Day (with decimal for time)
 * @returns Julian Day Number
 */
export function dateComponentsToJulianDay(year: number, month: number, day: number): JulianDay {
  let Y = year;
  let M = month;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const D = day;
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;

  return jd;
}

/**
 * Format date/time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Get current UTC offset for a timezone
 */
export function getTimezoneOffset(timeZone: string, date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = new Map(formatter.formatToParts(date).map((p) => [p.type, p.value]));

  const tzDate = new Date(
    `${parts.get('year')}-${parts.get('month')}-${parts.get('day')}T${parts.get('hour')}:${parts.get('minute')}:${parts.get('second')}Z`
  );

  return (date.getTime() - tzDate.getTime()) / (1000 * 60 * 60); // offset in hours
}
