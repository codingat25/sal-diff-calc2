<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

dayjs.extend(dayBusinessDays);

const currentSalary = ref("");
const properSalary = ref("");

const firstDate = ref("");
const secondDate = ref("");


//=================================================================================
// get initial differential amount
const initialDifferentialAmount = computed(() => {
  const properSalaryValue = parseFloat(
    properSalary.value.toString().replace(/[^0-9.]/g, "")
  );
  const currentSalaryValue = parseFloat(
    currentSalary.value.toString().replace(/[^0-9.]/g, "")
  );
  return isNaN(properSalaryValue) || isNaN(currentSalaryValue)
    ? 0
    : Math.max(0, properSalaryValue - currentSalaryValue);
});

//=================================================================================
// check the first day and last day of dates given
// kung tanawon mo do pattern, maubra anay imaw it sangka utility function para gamiton it ibang functions
const firstAndLastDay = (date, startOrEnd) => {
  const formattedDate = dayjs(date.value)
    [startOrEnd]("month")
    .format("MM/DD/YYYY"); //The square bracket notation (e.g. [startOrEnd]) is used in this code to access a property or method on an object dynamically, based on the value of the startOrEnd argument. This is known as computed property names in JavaScript, and it allows you to access properties on an object using a variable or expression instead of a static string.
  return formattedDate === "Invalid Date" ? 0 : formattedDate;
};

const firstDayOfFirstDate = computed(() =>
  firstAndLastDay(firstDate, "startOf")
);
const lastDayOfFirstDate = computed(() => firstAndLastDay(firstDate, "endOf"));
const firstDayOfSecondDate = computed(() =>
  firstAndLastDay(secondDate, "startOf")
);
const lastDayOfSecondDate = computed(() =>
  firstAndLastDay(secondDate, "endOf")
);

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
};

const getMonthOfFirstDay = computed(() => getDateValues(firstDate).month);
const getDayOfFirstDate = computed(() => getDateValues(firstDate).day);
const getDayOfLastDateOfFirstDate = computed(
  () => getDateValues(lastDayOfFirstDate).day
);
const getMonthOfSecondDay = computed(() => getDateValues(secondDate).month);
const getDayOfSecondDate = computed(() => getDateValues(secondDate).day);
const getDayOfFirstDateOfSecondDate = computed(
  () => getDateValues(firstDayOfSecondDate).day
);
const getDayOfLastDateOfSecondDate = computed(
  () => getDateValues(lastDayOfSecondDate).day
);


//==========================================================================================

//
const differenceInMonths = computed(() => {
  const { month: startMonth, day: startDay } = getDateValues(firstDate);
  const { month: endMonth, day: endDay } = getDateValues(secondDate);
  if (checkFirstDate.value && checkSecondDate.value) {
    return endMonth - startMonth + 1;
  } else if (startMonth === endMonth) {
    return 0;
  } else {
    return endMonth - startMonth;
  }
});

//================================================================================
//calculate total calendar days
const totalCalendarDays = (startDate, endDate) => {
  //Alternatively, you could use a single function to calculate the total number of calendar days, and then pass the appropriate arguments to this function to avoid repeating the same code multiple times.
  const days = dayjs(endDate.value).diff(startDate.value, "day") + 1; //These refactorings make the code more concise and easier to read, while also avoiding the repetition of similar code. Additionally, using a function like this can make the code more flexible and reusable, if you need to calculate the total number of calendar days in other parts of your code.
  return isNaN(days) ? 0 : days;
};

const totalCalendarDaysFirst = computed(() =>
  totalCalendarDays(firstDate, lastDayOfFirstDate)
);
const totalCalendarDaysSecond = computed(() =>
  totalCalendarDays(firstDayOfSecondDate, secondDate)
);

//================================================================================
//determine full month of days given
const fullMonth = (startDate, endDate) =>
  dayjs(endDate.value).diff(startDate.value, "day") + 1; //One way to refactor this code is to use a single function to calculate the number of days in a full month, and then pass the appropriate arguments to this function to avoid repeating the same code multiple times.

const fullMonthOfFirstDay = computed(() =>
  fullMonth(firstDayOfFirstDate, lastDayOfFirstDate)
);
const fullMonthOfSecondDay = computed(() =>
  fullMonth(firstDayOfSecondDate, lastDayOfSecondDate)
);

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
  return arrayedDates.filter((arrayed) => dayjs(arrayed).isBusinessDay())
    .length;
};

const businessDaysFirstDate = computed(() =>
  getBusinessDays(
    getMonthOfFirstDay.value,
    getDayOfFirstDate.value,
    getDayOfLastDateOfFirstDate.value,
    getYear.value
  )
);

const businessDaysSecondDate = computed(() =>
  getBusinessDays(
    getMonthOfSecondDay.value,
    getDayOfFirstDateOfSecondDate.value,
    getDayOfSecondDate.value,
    getYear.value
  )
);

//==================================================================================
//check if data is eligible for mid-year and year-end
const midYearEligible = computed(() => {
  const formatFirstDate = dayjs(firstDate.value).format('MM/DD/YYYY')
  const formatSecondDate = dayjs(secondDate.value).format('MM/DD/YYYY')
  return (
    formatFirstDate <= midYearDate.value &&
    formatSecondDate >= midYearDate.value
  );
});

const yearEndEligible = computed(() => {
  const formatFirstDate = dayjs(firstDate.value).format('MM/DD/YYYY')
  const formatSecondDate = dayjs(secondDate.value).format('MM/DD/YYYY')
  return (
    formatFirstDate <= yearEndDate.value &&
    formatSecondDate>= yearEndDate.value
  );
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
    differential +=
      (initialDifferentialAmount.value / 22) * businessDaysSecondDate.value;
  } else if (checkFirstDate.value === false && checkSecondDate.value === true) {
    differential +=
      (initialDifferentialAmount.value / 22) * businessDaysFirstDate.value;
  } else if (
    checkFirstDate.value === false &&
    checkSecondDate.value === false
  ) {
    differential +=
      (initialDifferentialAmount.value / 22) * businessDaysSecondDate.value;
    differential +=
      (initialDifferentialAmount.value / 22) * businessDaysFirstDate.value;
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

const grossSalDiff = computed(
  () => calculatedDifferential.value + sdBonus.value
);

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
  let share =
    initialDifferentialAmount.value * differenceInMonths.value * gsisPS.value;

  if (checkFirstDate.value === false && checkSecondDate.value === true) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfFirstDay.value) *
      totalCalendarDaysFirst.value *
      gsisPS.value;
  } else if (checkFirstDate.value === true && checkSecondDate.value === false) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfSecondDay.value) *
      totalCalendarDaysSecond.value *
      gsisPS.value;
  } else if (
    checkFirstDate.value === false &&
    checkSecondDate.value === false
  ) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfFirstDay.value) *
      totalCalendarDaysFirst.value *
      gsisPS.value;
    share +=
      (initialDifferentialAmount.value / fullMonthOfSecondDay.value) *
      totalCalendarDaysSecond.value *
      gsisPS.value;
  }

  return share;
});

//==================================================================================
//calculate GSIS Government Share
const gsisGshare = computed(() => {
  let share =
    initialDifferentialAmount.value * differenceInMonths.value * gsisGS.value;

  if (checkFirstDate.value === false && checkSecondDate.value === true) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfFirstDay.value) *
      totalCalendarDaysFirst.value *
      gsisGS.value;
  } else if (checkFirstDate.value === true && checkSecondDate.value === false) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfSecondDay.value) *
      totalCalendarDaysSecond.value *
      gsisGS.value;
  } else if (
    checkFirstDate.value === false &&
    checkSecondDate.value === false
  ) {
    share +=
      (initialDifferentialAmount.value / fullMonthOfFirstDay.value) *
      totalCalendarDaysFirst.value *
      gsisGS.value;
    share +=
      (initialDifferentialAmount.value / fullMonthOfSecondDay.value) *
      totalCalendarDaysSecond.value *
      gsisGS.value;
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

const round = (num, decimalPlaces) =>
  Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

const formatComma = (num) => {
  watchEffect(
    () =>
      (num.value = num.value
        .toString()
        .replace(/[^0-9]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  );
  num.value = parseFloat(num.value.replace(/,/g, ""));
};

const formattedCurrentSalary = () => formatComma(currentSalary);
const formattedProperSalary = () => formatComma(properSalary);

const formattedInitialDifferentialAmount = computed(() => {
  return isNaN(initialDifferentialAmount.value)
    ? 0
    : parseFloat(round(initialDifferentialAmount.value, 2))
});

const formattedCalculatedDifferential = computed(() => {
  return isNaN(calculatedDifferential.value)
    ? 0
    : parseFloat(round(calculatedDifferential.value, 2));
});

const formattedGsisPshare = computed(() => {
  return isNaN(gsisPshare.value) ? 0 : parseFloat(round(gsisPshare.value, 2));
});

const formattedGsisGshare = computed(() => {
  return isNaN(gsisGshare.value) ? 0 : parseFloat(round(gsisGshare.value, 2));
});

const formattedWithholdingTax = computed(() => {
  return isNaN(withholdingTax.value)
    ? 0
    : parseFloat(round(withholdingTax.value, 2));
});

const formattedGrossSalDiff = computed(() => {
  return isNaN(grossSalDiff.value)
    ? 0
    : parseFloat(round(grossSalDiff.value, 2));
});

const formattedSDBonus = computed(() => {
  return isNaN(sdBonus.value) ? 0 : parseFloat(round(sdBonus.value, 2));
});

const formattedLessGsis = computed(() => {
  return isNaN(lessGsis.value) ? 0 : parseFloat(round(lessGsis.value, 2));
});


//==================================================================================
//format all data to two decimal places as well as insert commas in thousands and millions place

const formatDate = (date) => {
  const formattedDate = ref('');

  watchEffect(() => {
    formattedDate.value = (dayjs(date.value).format('MM/DD/YYYY'));
  });
  return formattedDate;
};

const formattedFirstDate = () => formatDate(firstDate);
const formattedSecondDate = () => formatDate(secondDate);

//==================================================================================
//finally the basic deductions

const totalDeduction = computed(() => {
  return formattedGsisPshare.value + formattedWithholdingTax.value;
});

const formattedTotalDeduction = computed(() => {
  return isNaN(totalDeduction.value) ? 0 : parseFloat(round(totalDeduction.value, 2));
});


const netAmount = computed(() => {
  return round(formattedGrossSalDiff.value - totalDeduction.value, 3);
});
</script>

<template>
  <div class="block md:flex flex-col w-full h-auto">
    <h1 class="my-4 p-2 font-bold text-5xl text-center text-sky-600">
      Salary Differential Calculator
    </h1>
    <div class="px-5 gap-2 block md:flex w-full h-full">
      <div class="w-full md:w-2/5">
        <div
          class="w-full min-h-auto md:h-auto lg:h-screen pb-16 bg-white border border-gray-700 rounded-md"
        >
          <h2 class="pl-5 pt-2 font-bold text-3xl text-left text-gray-800">
            Input
          </h2>
          <form action="" class="pl-5 pt-2 flex flex-col gap-2 xl:gap-3">
            <label for="" class="pt-5 text-xl">Current Salary</label>
             
            <input
              type="text" v-model="currentSalary" @input="formattedCurrentSalary"
              class="py-3 w-[95%] text-3xl text-gray-800 text-center rounded-lg border border-gray-500 focus:outline-sky-600"
            />
            <label for="" class="pt-5 text-xl">Actual Salary</label>
          
            <input
              type="text" v-model="properSalary" @input="formattedProperSalary"
              class="py-3 w-[95%] text-3xl text-gray-800 text-center rounded-lg border border-gray-500 focus:outline-sky-600"
            />
            <label for="" class="pt-5 text-xl">From <br>
              <i class="font-base text-sky-700 text-sm">(duration of unpaid salary differential)</i></label>
            <input
              type="date" v-model="firstDate"
              class="py-3 w-[95%] text-3xl text-gray-800 text-center rounded-lg border border-gray-500 focus:outline-sky-600"
            />
            <label for="" class="pt-5 text-xl">To</label>
            <input
              type="date" v-model="secondDate" 
              class="py-3 w-[95%] text-3xl text-gray-800 text-center rounded-lg border border-gray-500 focus:outline-sky-600"
            />
          </form>
        </div>
      </div>
      <div class="w-full md:w-3/5 pt-2 md:pt-0">
        <div
          class="w-full min-h-auto md:h-auto lg:h-screen pb-5 bg-white border border-gray-700 rounded-md"
        >
          <h2 class="pl-5 pt-2 font-bold text-3xl text-left text-gray-800">
            Results
          </h2>
          <div class="pl-5 pt-5 flex">
            <div class="flex justify-center items-center w-full h-full pb-2">
              <table class="w-full lg:w-3/4 mr-2">
                <tbody
                  class="text-left text-base md:text-xl text-gray-800 uppercase"
                >
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Current Salary</th>
                    <td>{{ currentSalary }}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Actual Salary</th>
                    <td>{{properSalary}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Difference</th>
                    <td>{{initialDifferentialAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">From</th>
                    <td>{{formattedFirstDate().value}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">To</th>
                    <td>{{formattedSecondDate().value}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Gross Differential</th>
                    <td>{{formattedCalculatedDifferential.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">SD Bonus</th>
                    <td>{{formattedSDBonus.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Gross + SD Bonus</th>
                    <td>{{formattedGrossSalDiff.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">GSIS PS</th>
                    <td>{{formattedGsisPshare.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Less GSIS</th>
                    <td>{{formattedLessGsis.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Tax</th>
                    <td>{{formattedWithholdingTax.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Total Deduction</th>
                    <td>{{formattedTotalDeduction.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                  <tr
                    class="pl-0 flex justify-between pt-4 md:pt-2 gap-x-20 md:gap-x-20 lg:gap-x-44 border-b-2 border-sky-200"
                  >
                    <th scope="row">Net Differential</th>
                    <td>{{netAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="pb-5 flex justify-center w-full h-auto">
            <button class="w-52 h-10 bg-sky-700 rounded-md text-white font-semibold">COPY</button> </div>
        </div>
      </div>
    </div>
  </div>
</template>
