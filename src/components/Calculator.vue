<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import dayjs from "dayjs"
import dayjsBusinessDays from "dayjs-business-days"
import { round } from "mathjs/number"

dayjs.extend(dayjsBusinessDays)

const currentSalary = ref("")
const properSalary = ref("")
const firstDate = ref("")
const secondDate = ref("")


watch(currentSalary, () => {
  currentSalary.value = currentSalary.value.replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

watch(properSalary, () => {
  properSalary.value = properSalary.value.replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

watch(firstDate, () => {
  firstDate.value = dayjs(firstDate.value).format("MM/DD/YYYY")
})

watch(secondDate, () => {
  secondDate.value = secondDate.value.replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

const initialDifferentialAmount = computed(() => {
  return (properSalary.value - currentSalary.value <= 0) ? 0 : properSalary.value - currentSalary.value
})

const firstDayOfFirstDate = computed(() => {
  return (dayjs(firstDate.value).startOf("month").format("MM/DD/YYYY") === "Invalid Date") ? 0 : dayjs(firstDate.value).startOf("month").format("MM/DD/YYYY")
})

const lastDayOfFirstDate = computed(() => {
  return (dayjs(firstDate.value).endOf("month").format("MM/DD/YYYY") === "Invalid Date") ? 0 : dayjs(firstDate.value).endOf("month").format("MM/DD/YYYY")
})

</script>


    
<template>
  <div class="mt-6">
    <input type="text" placeholder="Current Salary" class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
      v-model="currentSalary">
  </div>

  <div class="mt-6">
    <input type="text" placeholder="Proper Salary" class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
      v-model="properSalary">
  </div>

  <div class="mt-6">
    <input type="text" placeholder="MM/DD/YYYY" class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
      v-model="firstDate">
  </div>

  <div class="mt-6">
    <input type="text" placeholder="MM/DD/YYYY" class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
      v-model="secondDate">
  </div>

</template>
    
<style scoped>

</style>
    