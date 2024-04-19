<template>
  <div class="flex flex-col w-full min-h-screen">
    <header class="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
      <span>PDGA Members</span>
    </header>
    <main class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <NuxtPage></NuxtPage>
    </main>
  </div>
</template>

<style lang="css">
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Inter', sans-serif;
  --font-sans: 'Inter';
}

body {
  font-family: 'Inter', sans-serif;
  --font-sans: 'Inter';
}
</style>
