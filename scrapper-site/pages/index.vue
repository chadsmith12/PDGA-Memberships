<template>
  <div class="grid gap-6 max-w-6xl w-full mx-auto">
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden" data-v0-t="card">
        <div class="space-y-1.5 p-6 flex flex-row items-center border-b">
          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            Average Members per Day
          </h3>
          <p class="text-sm text-muted-foreground ml-auto">
            <span class="font-semibold text-2xl">{{ averagePerDay.toFixed(0) }}</span>
          </p>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden" data-v0-t="card">
        <div class="space-y-1.5 p-6 flex flex-row items-center border-b">
          <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
            New Members Yesterday
          </h3>
          <p class="text-sm text-muted-foreground ml-auto">
            <span class="font-semibold text-2xl">{{ membersYesterday }}</span>
          </p>
        </div>
      </div>
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
