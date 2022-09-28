<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from "dayjs"
import dayjsBusinessDays from "dayjs-business-days"
import { round } from "mathjs/number"

dayjs.extend(dayjsBusinessDays)

const currentSalary = ref("")
const properSalary = ref("")
const firstDate = ref("01/03/2022")
const secondDate = ref("09/04/2022")

const initialDifferentialAmount = computed(() => {
  return (properSalary.value - currentSalary.value <= 0) ? 0 : properSalary.value - currentSalary.value
})

const firstDayOfFirstDate = computed(() => {
  return (dayjs(firstDate.value).startOf("month").format("MM/DD/YYYY") === "Invalid Date") ? 0 : dayjs(firstDate.value).startOf("month").format("MM/DD/YYYY")
})

const lastDayOfFirstDate = computed (() => {
  return (dayjs(firstDate.value).endOf("month").format("MM/DD/YYYY") === "Invalid Date") ? 0 : dayjs(firstDate.value).endOf("month").format("MM/DD/YYYY")
})


</script>

<template>
  <p>{{initialDifferentialAmount}}</p>
  <p>{{firstDayOfFirstDate}}</p>
  <p>{{lastDayOfFirstDate}}</p>
</template>

<style scoped>

</style>
