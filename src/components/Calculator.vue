<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

const currentSalary = ref(0);
const properSalary = ref(0);
const firstDate = ref("12/01/2022");
const secondDate = ref("12/31/2022");

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
//calculate difference in months
const differenceInMonths = computed(() => {
  if (dayjs(firstDate.value).isSame(dayjs(secondDate.value), "month")) {
    return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
  } else {
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
//
</script>

<template>
  
</template>
