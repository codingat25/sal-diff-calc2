<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

dayjs.extend(dayBusinessDays);

const currentSalary = ref(0);
const properSalary = ref(0);
const firstDate = ref("mm/dd/yyyy");
const secondDate = ref("mm/dd/yyyy");

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
//Difference in months
//================================================================================
//calculate difference in months

// const differenceInMonths = computed(() => {
//   if(dayjs(checkFirstDate.value) && dayjs(checkSecondDate.value) === true) {
//     console.log(1)
//     return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
//   } 
//   else if((checkFirstDate.value === false && checkSecondDate.value === false) && 
//   (dayjs(secondDate.value).diff(firstDate.value, "month")-1) < 0) {
//     console.log(2)
//     return 0
//   } 
//   else if((checkFirstDate.value === false && checkSecondDate.value === false) && 
//   (dayjs(secondDate.value).diff(firstDate.value, "month")-1) > 0){
//     console.log(3)
//     return dayjs(secondDate.value).diff(firstDate.value, "month") - 1;
//   } 
//   else if ((checkFirstDate.value === false && checkSecondDate.value === true) &&
//    (getMonthOfFirstDay.value !== getMonthOfSecondDay.value) && dayjs(secondDate.value).isSame(dayjs(secondDate.value).endOf("month")) 
//     && ((dayjs(secondDate.value).diff(firstDate.value, "month"))+1)<=31) {
//       console.log(4)
//       return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
//   } 
//   else if ((checkFirstDate.value === false && checkSecondDate.value === true) &&
//    (getMonthOfFirstDay.value !== getMonthOfSecondDay.value) && dayjs(secondDate.value).isSame(dayjs(secondDate.value).endOf("month")) 
//     && ((dayjs(secondDate.value).diff(firstDate.value, "month"))+1)>=31) {
//       console.log(5)
//       return dayjs(secondDate.value).diff(firstDate.value, "month");
//   } 
//   else if ((checkFirstDate.value === true && checkSecondDate.value === false) &&
//    (getMonthOfFirstDay.value === getMonthOfSecondDay.value)) {
//     console.log(6)
//       return dayjs(secondDate.value).diff(firstDate.value, "month");
//   } 
//   else if ((checkFirstDate.value === true && checkSecondDate.value === false) &&
//    (getMonthOfFirstDay.value !== getMonthOfSecondDay.value)) 
//    {
//     console.log(7)
//       return dayjs(secondDate.value).diff(firstDate.value, "month");
//   }
// });


//==========================================================================================

//
const differenceInMonths = computed(() => {
  const { month: startMonth, day: startDay } = getDateValues(firstDate);
  const { month: endMonth, day: endDay } = getDateValues(secondDate);
  if (checkFirstDate.value && checkSecondDate.value) {
    return endMonth - startMonth + 1;
  }
  else if (startMonth === endMonth) {
    return 0;
  }
  else {
    return endMonth - startMonth;
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
const formattedFirstDate = computed(() => dayjs(firstDate.value).format("MM/DD/YYYY"))
const formattedSecondDate = computed(() => dayjs(secondDate.value).format("MM/DD/YYYY"))
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
</script>


<template>


  <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-0">
    <div class="col-span-1 flex justify-center items-start h-auto md:h-screen">   
      <form class="flex flex-col justify-center items-center w-full md:w-1/2 h-full">
        <p class="flex w-full justify-start pt-10 font-bold text-2xl">Input</p>
          <p class="flex w-full justify-center font-bold text-xl">Salary</p>
          <label>Current Salary:</label>
          <input placeholder="Current Salary" v-model="currentSalary" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <br />
          <label>Actual Salary:</label>
          <input placeholder="Actual" v-model="properSalary" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <br />
          <p class="flex w-full justify-center font-bold text-xl">Period Covered</p>
          <label>From:</label>
          <input placeholder="from" v-model="firstDate" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <br />
          <label>To:</label>
          <input placeholder="to" v-model="secondDate" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <br />
          <button type="submit" class="text-white text-center w-3/4 py-2 bg-black border rounded-lg">Calculate</button>
      </form>
    </div>
    <div class="col-span-1 flex flex-col justify-start items-center h-screen">
      <div class="flex flex-col gap-2 w-auto h-full">
        <p class="flex w-full justify-start pt-10 font-bold text-2xl">Results</p>
      <table class="flex justify-center items-center gap-2">
      <tr class="flex flex-col text-left gap-y-2">
        <th>Current Salary</th>
        <th>Actual Salary</th>
        <th>Amount</th>
        <th>From</th>
        <th>To</th>
        <th>Total Gross Differential Amount</th>
        <th>SD Bonus</th>
        <th>Total Gross + SD Bonus</th>
        <th>GSIS</th>
        <th>Less GSIS</th>
        <th>Withholding Tax</th>
        <th>Total Deduction</th>
        <th>Net Amount</th>
      </tr>
      <tr class="flex flex-col text-right gap-y-2">
        <td>{{formattedCurrentSalary}}</td>
        <td>{{formattedProperSalary}}</td>
        <td>{{formattedInitialDifferentialAmount}}</td>
        <td>{{formattedFirstDate}}</td>
        <td>{{formattedSecondDate}}</td>
        <td>{{formattedCalculatedDifferential}}</td>
        <td>{{formattedSdBonus}}</td>
        <td>{{formattedGrossSalDiff}}</td>
        <td>{{formattedGsisPshare}}</td>
        <td>{{formattedLessGsis}}</td>
        <td>{{formattedWithholdingTax}}</td>
        <td>{{totalDeduction}}</td>
        <td>{{netAmount}}</td>
      </tr>
    </table>
    <div class="flex justify-center items-center">
      <button type="submit" class="text-white text-center py-2 px-10 bg-black border rounded-lg">Copy</button>
      <button type="submit" class="text-white text-center py-2 px-10 bg-black border rounded-lg">Edit</button>
    </div>
      </div>
 
    </div>
  </div>
</template>
