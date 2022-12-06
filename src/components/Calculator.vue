<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import dayBusinessDays from "dayjs-business-days";

const currentSalary = ref(0);
const properSalary = ref(0);
const firstDate = ref("12/01/2022");
const secondDate = ref("12/31/2022");

// get initial differential amount
const initialDifferentialAmount = computed(() => {
  return Math.max(0, properSalary.value - currentSalary.value);
});

// check the first day and last day of dates given
// check first date
const checkFirstDate = computed(() => {
  return dayjs(firstDate.value).isSame(dayjs(firstDate.value).startOf("month"));
});

// check second date
const checkSecondDate = computed(() => {
  return dayjs(secondDate.value).isSame(
    dayjs(secondDate.value).endOf("month"),
    "date"
  );
});

//calculate difference in months
const differenceInMonths = computed(() => {
  if (dayjs(firstDate.value).isSame(dayjs(secondDate.value), "month")) {
    return dayjs(secondDate.value).diff(firstDate.value, "month") + 1;
  } else {
    return dayjs(secondDate.value).diff(firstDate.value, "month");
  }
});

//calculate total calendar days
const totalCalendarDaysFirst = computed(() => {
  if (
    dayjs(firstDate.value).isSame(dayjs(firstDate.value).startOf("month")) &&
    dayjs(lastDayOfFirstDate.value).isSame(
      dayjs(lastDayOfFirstDate.value).endOf("month")
    )
  ) {
    return dayjs(lastDayOfFirstDate.value).diff(firstDate.value, "day") + 1;
  } else {
    return dayjs(lastDayOfFirstDate.value).diff(firstDate.value, "day");
  }
});

const totalCalendarDaysSecond = computed(() => {
  if (
    dayjs(secondDate.value).isSame(dayjs(secondDate.value).startOf("month")) &&
    dayjs(lastDayOfsecondDate.value).isSame(
      dayjs(lastDayOfsecondDate.value).endOf("month")
    )
  ) {
    return dayjs(lastDayOfsecondDate.value).diff(secondDate.value, "day") + 1;
  } else {
    return dayjs(lastDayOfsecondDate.value).diff(secondDate.value, "day");
  }
});

//calculate total number of days in a month

//1st date
const fullMonthOfFirstDate = computed(() => {
  if (
    dayjs(firstDayOfFirstDate.value).isSame(
      dayjs(firstDayOfFirstDate.value).startOf("month")
    ) &&
    dayjs(lastDayOfFirstDate.value).isSame(
      dayjs(lastDayOfFirstDate.value).endOf("month")
    )
  ) {
    return (
      dayjs(lastDayOfFirstDate.value).diff(firstDayOfFirstDate.value, "day") + 1
    );
  } else {
    return 0;
  }
});

//2nd date
const fullMonthOfSecondDate = computed(() => {
  if (
    dayjs(firstDayOfSecondDate.value).isSame(
      dayjs(firstDayOfSecondDate.value).startOf("month")
    ) &&
    dayjs(lastDayOfSecondDate.value).isSame(
      dayjs(lastDayOfSecondDate.value).endOf("month")
    )
  ) {
    return (
      dayjs(lastDayOfSecondDate.value).diff(firstDayOfSecondDate.value, "day") +
      1
    );
  } else {
    return 0;
  }
});
</script>

<template></template>
