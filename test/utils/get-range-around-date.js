import moment from 'moment';

/**
 * Gets time range around some moment.
 *
 * @param {Date} date
 * @param {number} delta
 * @param {moment.unitOfTime.DurationConstructor} deltaUnit
 * @return {{start:Date, end:Date}}
 */
export default function getRangeAroundDate(
  date,
  delta = 1,
  deltaUnit = 'minute'
) {
  const deltaDuration = moment.duration(delta, deltaUnit);

  const start = moment(date)
    .subtract(deltaDuration)
    .toDate();
  const end = moment(date)
    .add(deltaDuration)
    .toDate();

  return {start, end};
}
