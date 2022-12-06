<script setup>
    const currentSalary = ref()
    const properSalary = ref()
    const firstDate = ref()
    const secondDate = ref()

    // get initial differential amount
    const initialDifferentialAmount = computed(()=>{
      return Math.max(0, properSalary.value - currentSalary.value)
    })


    // check the first day and last day of dates given
    // determine first day of 1st date
    const firstDayOfFirstDate = computed(()=>{
      if(dayjs(firstDate.value).isValid()){
        return dayjs(firstDate.value).startOf("month").format("MM/DD/YYYY")
      } else {
        return 0
      }
    })

    // determine last day of 1st date
    const lastDayOfFirstDate = computed(() => {
      if(dayjs(firstDate).isValid()) {
        return dayjs(firstDate.value).endOf("month").format("MM/DD/YYYY")
      } else {
        return 0
      }
    })


        // determine first day of 1st date
    const firstDayOfSecondDate = computed(()=>{
      if(dayjs(secondDate.value).isValid()){
        return dayjs(secondDate.value).startOf("month").format("MM/DD/YYYY")
      } else {
        return 0
      }
    })

    // determine last day of 1st date
    const lastDayOfSecondDate = computed(() => {
      if(dayjs(secondDate).isValid()) {
        return dayjs(secondDate.value).endOf("month").format("MM/DD/YYYY")
      } else {
        return 0
      }
    })

</script>


<template>


</template>
    
