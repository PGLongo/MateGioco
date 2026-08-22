<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()

// L'HTML servito porta lang="it" da nuxt.config (defaultLocale). Qui lo riallineiamo alla
// lingua effettivamente rilevata, insieme a titolo e description: erano fissi in italiano
// anche con interfaccia in inglese
useHead({
  htmlAttrs: {
    lang: locale
  },
  title: () => t('app.title'),
  meta: [
    { name: 'description', content: () => t('app.description') }
  ]
})
</script>
