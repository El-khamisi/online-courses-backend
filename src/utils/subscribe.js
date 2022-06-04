const { plansNames } = require('../services/plans/plans.model');

exports.subscribe = (plan, currEnd) => {
  if (!Object.values(plansNames).includes(plan)) {
    throw new Error(`Provide valid plan name-${plan}`);
  }

  const date = currEnd ? new Date(currEnd.split('T')[0]) : new Date();
  switch (plan) {
    case plansNames.Monthly:
      return (() => {
        const [month, day, year] = [date.getMonth(date.setMonth(date.getMonth() + 1)) + 1, date.getDate(), date.getFullYear()];
        return `${year}-${month}-${day}`;
      })();

    case plansNames.Biannual:
      return (() => {
        const [month, day, year] = [date.getMonth(date.setMonth(date.getMonth() + 6)) + 1, date.getDate(), date.getFullYear()];
        return `${year}-${month}-${day}`;
      })();

    case plansNames.Annual:
      return (() => {
        const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear(date.setFullYear(date.getFullYear() + 1))];
        return `${year}-${month}-${day}`;
      })();
    default:
      throw new Error(`Provide valid plan name-${plan}`);
  }
};
