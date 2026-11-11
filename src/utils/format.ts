/**
 * Number and currency formatting utilities.
 */

export function formatNumber(num: number, useKoreanUnits = true): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num < 0) return '-' + formatNumber(-num, useKoreanUnits);

  const rounded = Math.floor(num);

  if (useKoreanUnits) {
    if (rounded < 10000) {
      return rounded.toLocaleString();
    }
    if (rounded < 100000000) { // 1억 미만 (만 단위)
      const man = Math.floor(rounded / 10000);
      const remainder = Math.floor((rounded % 10000) / 100);
      return remainder > 0 ? `${man}.${Math.floor(remainder / 10)}만` : `${man}만`;
    }
    if (rounded < 1000000000000) { // 1조 미만 (억 단위)
      const eok = (rounded / 100000000).toFixed(2);
      return `${parseFloat(eok)}억`;
    }
    if (rounded < 10000000000000000) { // 1경 미만 (조 단위)
      const jo = (rounded / 1000000000000).toFixed(2);
      return `${parseFloat(jo)}조`;
    }
    const gyeong = (rounded / 10000000000000000).toFixed(2);
    return `${parseFloat(gyeong)}경`;
  }

  // Western units: K, M, B, T, Qa
  if (rounded < 1000) return rounded.toLocaleString();
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const i = Math.floor(Math.log10(rounded) / 3);
  if (i >= suffixes.length) return rounded.toExponential(2);
  const formatted = (rounded / Math.pow(10, i * 3)).toFixed(1);
  return `${parseFloat(formatted)}${suffixes[i]}`;
}

export function formatTimeDuration(seconds: number): string {
  const sec = Math.floor(seconds);
  if (sec < 60) return `${sec}초`;
  const minutes = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (minutes < 60) {
    return remSec > 0 ? `${minutes}분 ${remSec}초` : `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  return `${hours}시간 ${remMin}분`;
}
