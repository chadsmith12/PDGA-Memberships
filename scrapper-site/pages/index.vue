<template>
  <div class="grid gap-6 max-w-6xl w-full mx-auto">
    <div class="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Average Members per day">
        {{ averagePerDay.toFixed(0) }}
      </DashboardCard>
      <DashboardCard title="New Members Yesterday">
        {{ membersYesterday }}
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/database"

const client = useSupabaseClient<Database>()

const { data: members } = await useAsyncData('tasks', async () => {
  const { data } = await client.from('daily_new_members').select('*')

  return data!.map(item => {
    return {
      date: new Date(item.date!),
      newMembers: item.new_members!
    }
  })
})

const averagePerDay = computed(() => {
  const newPerDay = members.value?.map(item => item.newMembers)
  if (!newPerDay) {
    return 0;
  }

  let sum = 0;
  for (const number of newPerDay) {
    sum += number
  }

  return sum / newPerDay.length
})

const membersYesterday = computed(() => {
  if (!members.value) {
    return 0
  }
  return members.value.at(-1)?.newMembers
})
</script>
