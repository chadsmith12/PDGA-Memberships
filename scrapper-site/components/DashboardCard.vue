<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden">
    <div class="space-y-1.5 p-6 flex flex-row items-center border-b">
      <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm text-muted-foreground ml-auto">
        <span class="font-semibold text-2xl">
          <slot></slot>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
type CardPropsType = {
  title: string
}

defineProps<CardPropsType>()
</script>
