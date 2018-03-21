import getRangeAroundDate from './get-range-around-date';

/**
 * Gets time range +/-30sec around current moment.
 *
 * @return {{nowStart:Date, nowEnd:Date}}
 */
export default function getRangeAroundNow() {
  const now = new Date();
  const {start: nowStart, end: nowEnd} = getRangeAroundDate(now, 30, 'seconds');
  return {nowStart, nowEnd};
}
