<script setup>
    import { ref, computed, watch, watchEffect } from 'vue'
    import dayjs from "dayjs"
    import dayjsBusinessDays from "dayjs-business-days"
    import { round } from "mathjs/number"
    
    dayjs.extend(dayjsBusinessDays)
    
    const currentSalary = ref("")
    const properSalary = ref("")
    const firstDate = ref("01/03/2022")
    const secondDate = ref("09/04/2022")
    
    
    watch(currentSalary, () => {
      currentSalary.value =  currentSalary.value.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        console.log(currentSalary.value)
    })

    watch(properSalary, () => {
      properSalary.value =  properSalary.value.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        console.log(currentSalary.value)
    })
    
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
        <div class="mt-6">
            <input type="text" placeholder="Current Salary" 
            class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
            v-model="currentSalary">
        </div>

        <div class="mt-6">
            <input type="text" placeholder="Proper Salary" 
            class="w-56 text-2xl bg-gray-300 p-3 rounded-lg focus:outline-none"
            v-model="properSalary">
        </div>

    </template>
    
    <style scoped>
    
    </style>
    