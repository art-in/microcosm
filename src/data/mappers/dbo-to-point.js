import Point from "model/entities/Point";

/**
 * Maps dbo to point model
 * @param {object} dbo
 * @return {Point}
 */
export default function dboToPoint(dbo) {
  return new Point(dbo);
}
