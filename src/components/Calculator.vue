<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

dayjs.extend(dayBusinessDays);

const currentSalary = ref(25439);
const properSalary = ref(27877);
const firstDate = ref("01/03/2022");
const secondDate = ref("05/15/2022");

//=================================================================================
// get initial differential amount
const initialDifferentialAmount = computed(() => {
  return Math.max(0, properSalary.value - currentSalary.value);
});


//=================================================================================
// check the first day and last day of dates given
// kung tanawon mo do pattern, maubra anay imaw it sangka utility function para gamiton it ibang functions
const firstAndLastDay = (date, startOrEnd) => {
  const formattedDate = dayjs(date.value)[startOrEnd]("month").format("MM/DD/YYYY"); //The square bracket notation (e.g. [startOrEnd]) is used in this code to access a property or method on an object dynamically, based on the value of the startOrEnd argument. This is known as computed property names in JavaScript, and it allows you to access properties on an object using a variable or expression instead of a static string.
  return formattedDate === "Invalid Date" ? 0 : formattedDate;
}

const firstDayOfFirstDate = computed(() => firstAndLastDay(firstDate, "startOf"));
const lastDayOfFirstDate = computed(() => firstAndLastDay(firstDate, "endOf"));
const firstDayOfSecondDate = computed(() => firstAndLastDay(secondDate, "startOf"));
const lastDayOfSecondDate = computed(() => firstAndLastDay(secondDate, "endOf"));

//================================================================================
// gina-check kung do gintype sa unang date hay unang adlaw gid it buean
const checkFirstDate = computed(() => {
  return dayjs(firstDate.value).isSame(dayjs(firstDate.value).startOf("month"));
});

// gina-check kung do gintype sa pangaywang date hay unang adlaw gid it buean
const checkSecondDate = computed(() => {
  return dayjs(secondDate.value).isSame(
    dayjs(secondDate.value).endOf("month"),
    "date"
  );
});

//================================================================================
//get month and day of given dates
const getDateValues = (date) => {
  return {
    month: dayjs(date.value).month() + 1,
    day: dayjs(date.value).date(),
  };
}

const getMonthOfFirstDay = computed(() => getDateValues(firstDate).month);
const getDayOfFirstDate = computed(() => getDateValues(firstDate).day);
const getDayOfLastDateOfFirstDate = computed(() => getDateValues(lastDayOfFirstDate).day);
const getMonthOfSecondDay = computed(() => getDateValues(secondDate).month);
const getDayOfSecondDate = computed(() => getDateValues(secondDate).day);
const getDayOfFirstDateOfSecondDate = computed(() => getDateValues(firstDayOfSecondDate).day);
const getDayOfLastDateOfSecondDate = computed(() => getDateValues(lastDayOfSecondDate).day);

//================================================================================
//calculate difference in months
const differenceInMonths = computed(() => {
  if(dayjs(checkFirstDate.value).isSame(dayjs(checkSecondDate.value))) {
    return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
  } else if((dayjs(checkFirstDate.value) && dayjs(checkSecondDate.value)) === false && 
  (dayjs(secondDate.value).diff(firstDate.value, "month")-1) < 0) {
    return 0
  } else if ((dayjs(checkFirstDate.value) && dayjs(checkSecondDate.value)) === false && 
  (dayjs(secondDate.value).diff(firstDate.value, "month")-1) > 0){
    return dayjs(secondDate.value).diff(firstDate.value, "month") - 1;
  } else if ((dayjs(checkFirstDate.value) === false && dayjs(checkSecondDate.value)=== true) &&
   (getMonthOfFirstDay === getMonthOfSecondDay.value) && dayjs(secondDate.value).isSame(dayjs(secondDate.value).endOf("month")) 
    && ((dayjs(secondDate.value).diff(firstDate.value, "month"))+1)<=31) {
      return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
  } else if ((dayjs(checkFirstDate.value) === false && dayjs(checkSecondDate.value)=== true) &&
   (getMonthOfFirstDay === getMonthOfSecondDay.value) && dayjs(secondDate.value).isSame(dayjs(secondDate.value).endOf("month")) 
    && ((dayjs(secondDate.value).diff(firstDate.value, "month"))+1)>=31) {
      return dayjs(secondDate.value).diff(firstDate.value, "month");
  } 
});

//================================================================================
//calculate total calendar days
const totalCalendarDays = (startDate, endDate) => { //Alternatively, you could use a single function to calculate the total number of calendar days, and then pass the appropriate arguments to this function to avoid repeating the same code multiple times.
  const days = dayjs(endDate.value).diff(startDate.value, "day") + 1; //These refactorings make the code more concise and easier to read, while also avoiding the repetition of similar code. Additionally, using a function like this can make the code more flexible and reusable, if you need to calculate the total number of calendar days in other parts of your code.
  return isNaN(days) ? 0 : days;
}

const totalCalendarDaysFirst = computed(() => totalCalendarDays(firstDate, lastDayOfFirstDate));
const totalCalendarDaysSecond = computed(() => totalCalendarDays(firstDayOfSecondDate, secondDate));

//================================================================================
//determine full month of days given
const fullMonth = (startDate, endDate) => dayjs(endDate.value).diff(startDate.value, "day") + 1; //One way to refactor this code is to use a single function to calculate the number of days in a full month, and then pass the appropriate arguments to this function to avoid repeating the same code multiple times.

const fullMonthOfFirstDay = computed(() => fullMonth(firstDayOfFirstDate, lastDayOfFirstDate));
const fullMonthOfSecondDay = computed(() => fullMonth(firstDayOfSecondDate, lastDayOfSecondDate));

//================================================================================
//get current year
const getYear = computed(() =>
  dayjs(firstDate.value).isValid()
    ? dayjs(firstDate.value).year().toString()
    : 0
);

//================================================================================
//get mid year and year bonus eligibility
const midYearDate = computed(() => `05/15/${getYear.value}`);
const yearEndDate = computed(() => `10/31/${getYear.value}`);


//================================================================================
//compute business days
const getBusinessDays = (month, startDay, endDay, year) => {
  const arrayedDates = [];
  for (let i = startDay; i <= endDay; i++) {
    arrayedDates.push(`${month}/${i}/${year}`);
  }
  return arrayedDates.filter((arrayed) => dayjs(arrayed).isBusinessDay()).length;
}

const businessDaysFirstDate = computed(() => getBusinessDays(
  getMonthOfFirstDay.value,
  getDayOfFirstDate.value,
  getDayOfLastDateOfFirstDate.value,
  getYear.value
));

const businessDaysSecondDate = computed(() => getBusinessDays(
  getMonthOfSecondDay.value,
  getDayOfFirstDateOfSecondDate.value,
  getDayOfSecondDate.value,
  getYear.value
));

//==================================================================================
//check if data is eligible for mid-year and year-end
const midYearEligible = computed(() => {
  return firstDate.value <= midYearDate.value && secondDate.value >= midYearDate.value;
});

const yearEndEligible = computed(() => {
  return firstDate.value <= yearEndDate.value && secondDate.value >= yearEndDate.value;
});


//==================================================================================
//calculate tax rate
const taxPercentage = computed(() => {
  const annualSalary = properSalary.value * 12;

  if (annualSalary <= 250000) {
    return 0;
  } else if (annualSalary <= 400000) {
    return 0.2;
  } else if (annualSalary <= 800000) {
    return 0.25;
  } else if (annualSalary <= 2000000) {
    return 0.3;
  } else {
    return 0.32;
  }
});

//==================================================================================
//calculate salary differential

const calculatedDifferential = computed(() => {
  let differential = initialDifferentialAmount.value * differenceInMonths.value;

  if (checkFirstDate.value === true && checkSecondDate.value === false) {
    differential += (initialDifferentialAmount.value / 22) * businessDaysSecondDate.value;
  } else if (checkFirstDate.value === false && checkSecondDate.value === true) {
    differential += (initialDifferentialAmount.value / 22) * businessDaysFirstDate.value;
  } else if (checkFirstDate.value === false && checkSecondDate.value === false) {
    differential += (initialDifferentialAmount.value / 22) * businessDaysSecondDate.value;
    differential += (initialDifferentialAmount.value / 22) * businessDaysFirstDate.value;
  }

  return differential;
});

//==================================================================================
//calculate salary differential bonus

const sdBonus = computed(() => {
  if (midYearEligible.value && yearEndEligible.value) {
    return initialDifferentialAmount.value * 2;
  } else if (midYearEligible.value || yearEndEligible.value) {
    return initialDifferentialAmount.value;
  } else {
    return 0;
  }
});

//==================================================================================
//calculate gross salary differential

const grossSalDiff = computed(() => calculatedDifferential.value + sdBonus.value);

//==================================================================================
//calculate GSIS Rate
    //GSIS PS AND GS RATES
    const gsisPS = computed(() => {
      return 0.09;
    });

    const gsisGS = computed(() => {
      return 0.12;
    });


//==================================================================================
//calculate GSIS Personal Share 

const gsisPshare = computed(() => {
  let share = initialDifferentialAmount.value * differenceInMonths.value * gsisPS.value;

  if (checkFirstDate.value === false && checkSecondDate.value === true) {
    share += (initialDifferentialAmount.value / fullMonthOfFirstDay.value) * totalCalendarDaysFirst.value * gsisPS.value;
  } else if (checkFirstDate.value === true && checkSecondDate.value === false) {
    share += (initialDifferentialAmount.value / fullMonthOfSecondDay.value) * totalCalendarDaysSecond.value * gsisPS.value;
  } else if (checkFirstDate.value === false && checkSecondDate.value === false) {
    share += (initialDifferentialAmount.value / fullMonthOfFirstDay.value) * totalCalendarDaysFirst.value * gsisPS.value;
    share += (initialDifferentialAmount.value / fullMonthOfSecondDay.value) * totalCalendarDaysSecond.value * gsisPS.value;
  }

  return share;
});

//==================================================================================
//calculate GSIS Government Share 
const gsisGshare = computed(() => {
  let share = initialDifferentialAmount.value * differenceInMonths.value * gsisGS.value;

  if (checkFirstDate.value === false && checkSecondDate.value === true) {
    share += (initialDifferentialAmount.value / fullMonthOfFirstDay.value) * totalCalendarDaysFirst.value * gsisGS.value;
  } else if (checkFirstDate.value === true && checkSecondDate.value === false) {
    share += (initialDifferentialAmount.value / fullMonthOfSecondDay.value) * totalCalendarDaysSecond.value * gsisGS.value;
  } else if (checkFirstDate.value === false && checkSecondDate.value === false) {
    share += (initialDifferentialAmount.value / fullMonthOfFirstDay.value) * totalCalendarDaysFirst.value * gsisGS.value;
    share += (initialDifferentialAmount.value / fullMonthOfSecondDay.value) * totalCalendarDaysSecond.value * gsisGS.value;
  }

  return share;
});

//==================================================================================
//basic computation of deductions
const lessGsis = computed(() => {
  return calculatedDifferential.value - gsisPshare.value;
});

const withholdingTax = computed(() => {
  return lessGsis.value * taxPercentage.value;
});

//==================================================================================
//format all data to two decimal places

const round = (num, decimalPlaces) => Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

const formattedProperSalary = computed(() => round(properSalary.value, 2));
const formattedCurrentSalary = computed(() => round(currentSalary.value, 2));
const formattedInitialDifferentialAmount = computed(() => round(initialDifferentialAmount.value, 2));
const formattedCalculatedDifferential = computed(() => round(calculatedDifferential.value, 2));
const formattedSdBonus = computed(() => round(sdBonus.value, 2));
const formattedGrossSalDiff = computed(() => round(grossSalDiff.value, 2));
const formattedGsisPshare = computed(() => round(gsisPshare.value, 2));
const formattedGsisGshare = computed(() => round(gsisGshare.value, 2));
const formattedLessGsis = computed(() => round(lessGsis.value, 2));
const formattedWithholdingTax = computed(() => round(withholdingTax.value, 2));

//==================================================================================
//finally the basic deductions 

const totalDeduction = computed(() => {
      return formattedGsisPshare.value + formattedWithholdingTax.value;
    });

const netAmount = computed(() => {
      return round(formattedGrossSalDiff.value - totalDeduction.value, 3);
    });


//my noob testing
console.log("Initial Differential Amount:",initialDifferentialAmount.value)
console.log("First Day of First Date:",firstDayOfFirstDate.value)
console.log("Last Day of First Date:",lastDayOfFirstDate.value)
console.log("First Day of Second Date",firstDayOfSecondDate.value)
console.log("Last Day of Second Date",lastDayOfSecondDate.value)
console.log("First Day of Month?",checkFirstDate.value)
console.log("Last Day of Month?",checkSecondDate.value)
console.log("Difference in Months:", differenceInMonths.value)
console.log("Total Calendar Days of First Date", totalCalendarDaysFirst.value)
console.log("Total Calendar Days of Second Date", totalCalendarDaysSecond.value)
console.log("Total number days of in a month of the first date:", fullMonthOfFirstDay.value)
console.log("Total number days of in a month of the second date:", fullMonthOfSecondDay.value)
console.log("Year:", getYear.value)
console.log("Mid Year date",midYearDate.value)
console.log("Year End date",yearEndDate.value)
console.log("Get month of first day",getMonthOfFirstDay.value )
console.log("Get day of first day",getDayOfFirstDate.value )
console.log("Get day of the last of the month of the first date haha!",getDayOfLastDateOfFirstDate.value )
console.log("Get month of second date",getMonthOfSecondDay.value )
console.log("Get the day of the second",getDayOfSecondDate.value )
console.log("Get day of second day",getDayOfFirstDateOfSecondDate.value )
console.log("Get day of the last of the month of the second date",getDayOfLastDateOfSecondDate.value )
console.log("Get business days of first date:", businessDaysFirstDate.value)
console.log("Get business days of second date:", businessDaysSecondDate.value)
console.log("Mid Year Eligible?", midYearEligible.value)
console.log("Year End Eligible?", yearEndEligible.value)
console.log("What's the tax percentage?", taxPercentage.value)
console.log("Actual Differential", calculatedDifferential.value)
console.log("SD Bonus", sdBonus.value)
console.log("Gross Salary Differential",grossSalDiff.value)
console.log("GSIS PS", gsisPS.value)
console.log("GSIS GS", gsisGS.value)
console.log("GSIS PS Share", gsisPshare.value)
console.log("GSIS GS Share", gsisGshare.value)
console.log("Less GSIS", lessGsis.value)
console.log("withholding tax", withholdingTax.value)
console.log("total deduction", totalDeduction.value)
console.log("net amout", netAmount.value)

const importantVariables = [
    formattedProperSalary.value,
    formattedCurrentSalary.value,
    formattedInitialDifferentialAmount.value,
    formattedCalculatedDifferential.value,
    formattedSdBonus.value,
    formattedGrossSalDiff.value,
    formattedGsisPshare.value,
    formattedGsisGshare.value,
    formattedLessGsis.value,
    formattedWithholdingTax.value
];

console.log(importantVariables);



</script>

<template>
  
</template>
