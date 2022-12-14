<script setup>
import { ref, computed, onMounted, watchEffect} from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

dayjs.extend(dayBusinessDays);

const currentSalary = ref('');
const properSalary = ref('');
const firstDate = ref('');
const secondDate = ref('');


//=================================================================================
// get initial differential amount
const initialDifferentialAmount = computed(() => {
  const properSalaryValue = parseFloat(properSalary.value.toString().replace(/[^0-9.]/g, ''));
  const currentSalaryValue = parseFloat(currentSalary.value.toString().replace(/[^0-9.]/g, ''));
  return isNaN(properSalaryValue) || isNaN(currentSalaryValue) ? 0 : Math.max(0, properSalaryValue - currentSalaryValue);
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
//format all data to two decimal places as well as insert commas in thousands and millions place


const round = (num, decimalPlaces) => Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

const formatComma = (num) => {
  watchEffect(()=> 
    num.value = num.value.toString().replace(/[^0-9]/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    num.value = parseFloat(num.value.replace(/,/g, ''))
  }

const formattedCurrentSalary = ()=> formatComma(currentSalary)
const formattedProperSalary = ()=> formatComma(properSalary)

const formattedInitialDifferentialAmount = computed(() => {
  return isNaN(initialDifferentialAmount.value) ? 0 : parseFloat(round(initialDifferentialAmount.value, 2));
});

const formattedCalculatedDifferential = computed(()=> {
  return isNaN(calculatedDifferential.value) ? 0 : parseFloat(round(calculatedDifferential.value,2))
})

const formattedGsisPshare = computed(()=> {
  return isNaN(gsisPshare.value) ? 0 : parseFloat(round(gsisPshare.value,2))
})

const formattedGsisGshare = computed(()=> {
  return isNaN(gsisGshare.value) ? 0 : parseFloat(round(gsisGshare.value,2))
})

const formattedWithholdingTax = computed(()=> {
  return isNaN(withholdingTax.value) ? 0 : parseFloat(round(withholdingTax.value,2))
})

const formattedGrossSalDiff = computed(()=> {
  return isNaN(grossSalDiff.value) ? 0 : parseFloat(round(grossSalDiff.value,2))
})

const formattedSDBonus = computed(()=>{
  return isNaN(sdBonus.value) ? 0 : parseFloat(round(sdBonus.value,2))
})

const formattedLessGsis = computed(()=>{
  return isNaN(lessGsis.value) ? 0 : parseFloat(round(lessGsis.value,2))
})


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
<div class="flex flex-col md:flex-row  justify-center items-center w-full h-auto">
    <div class="flex justify-center items-center w-full h-screen">
      <div class="bg-white w-full h-full lg:w-[90%] md:h-[90%]">
        <div class="w-full h-auto p-2 bg-violet-700 text-white font-bold text-lg rounded-lg">Input</div>
      </div>
    </div>
    <div class="flex justify-center items-center w-full h-screen">
      <div class="bg-white w-full h-full lg:w-[90%] md:h-[90%] rounded-lg">
        <div class="w-full h-auto p-2 bg-violet-700 text-white font-bold text-lg rounded-lg">Results</div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Current Salary</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span>{{currentSalary.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Proper Salary</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span>{{properSalary.toLocaleString('en-PH') }}</div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Amount</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedInitialDifferentialAmount.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">From</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span>{{firstDate.toLocaleString('en-PH')}}</div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">To</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span>{{secondDate.toLocaleString('en-PH')}}</div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Gross Salary Diff</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedCalculatedDifferential.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">SD Bonus</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedSDBonus.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Gross + SD Bonus</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedGrossSalDiff.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">GSIS</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedGsisPshare.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Less GSIS</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedLessGsis.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Tax</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{formattedWithholdingTax.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Total Deductions</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{totalDeduction.toLocaleString('en-PH')}}</span></div>
        </div>
        <div class="grid grid-cols-2 w-full h-auto p-1 lg:p-2 gap-x-2 border-b border-gray-200">
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base">Net Amount</div>
          <div class="col-span-2 md:col-span-1 font-bold text-sm lg:text-base"><span class="pl-20 pr-10">P</span><span class="text-lg">{{netAmount.toLocaleString('en-PH')}}</span></div>
        </div>

      </div>
    </div>
</div>


 <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-0">
    <div class="col-span-1 flex justify-center items-start h-auto md:h-screen">   
      <form class="flex flex-col justify-start items-center w-full md:w-1/2 h-full gap-3">
        <p class="flex w-full justify-start pt-10 font-bold text-2xl">Input</p>
          <p class="flex w-full justify-center font-bold text-xl">Salary</p>
          <label>Current Salary:</label>
          <input placeholder="Current Salary" v-model="currentSalary" @input="formattedCurrentSalary"  class="w-3/4 border border-gray-300 rounded-md p-2" />
          <label>Actual Salary:</label>
          <input placeholder="Actual Salary" v-model="properSalary" @input="formattedProperSalary" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <p class="flex w-full justify-center font-bold text-xl">Period Covered</p>
          <label>From:</label>
          <input placeholder="from" v-model="firstDate" class="w-3/4 border border-gray-300 rounded-md p-2" />
          <label>To:</label>
          <input placeholder="to" v-model="secondDate" class="w-3/4 border border-gray-300 rounded-md p-2" />
      </form>
    </div>
    <div class="col-span-1 flex flex-col justify-start items-center h-screen">
      <div class="flex flex-col gap-2 w-auto h-full">
        <p class="flex w-full justify-start pt-10 font-bold text-2xl">Results</p>
      <table class="flex justify-center items-center gap-2">
      <tr class="flex flex-col text-left gap-y-2">
        <th class="h-[1%]">Current Salary</th>
        <th class="h-[1%]">Actual Salary</th>
        <th class="h-[1%]">Amount</th>
        <th class="h-[1%]">From</th>
        <th class="h-[1%]">To</th>
        <th class="h-[1%]">Total Gross Differential Amount</th>
        <th class="h-[1%]">SD Bonus</th>
        <th class="h-[1%]">Total Gross + SD Bonus</th>
        <th class="h-[1%]">GSIS</th>
        <th class="h-[1%]">Less GSIS</th>
        <th class="h-[1%]">Withholding Tax</th>
        <th class="h-[1%]">Total Deduction</th>
        <th class="h-[1%]">Net Amount</th>
      </tr>
      <tr class="flex flex-col text-right gap-y-2">
        <td class="h-[1%]">{{currentSalary.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{properSalary.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{formattedInitialDifferentialAmount.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{firstDate.toLocaleString('en-PH')}}</td>
        <td class="h-[1%]">{{secondDate.toLocaleString('en-PH')}}</td>
        <td class="h-[1%]">{{formattedCalculatedDifferential.toLocaleString('en-PH')}}</td>
        <td class="h-[1%]">{{formattedSDBonus.toLocaleString('en-PH')}}</td>
        <td class="h-[1%]">{{formattedGrossSalDiff.toLocaleString('en-PH')}}</td>
        <td class="h-[1%]">{{formattedGsisPshare.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{formattedLessGsis.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{formattedWithholdingTax.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{totalDeduction.toLocaleString('en-PH') }}</td>
        <td class="h-[1%]">{{netAmount.toLocaleString('en-PH') }}</td>
      </tr>
    </table>
    <div class="flex justify-center items-center">
      <button type="submit" class="text-white text-center py-2 px-10 bg-black border rounded-lg">Copy</button>
      <button type="submit" class="text-white text-center py-2 px-10 bg-black border rounded-lg">Reset</button>
    </div>
      </div>
    </div>
  </div> -->
</template>
