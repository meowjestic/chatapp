// ~/plugins/actioncable.js
import { createConsumer } from '@rails/actioncable'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const cable = createConsumer(`wss://backend-chat-service-production.up.railway.app/api/v1/cable`) // Replace with your Rails server URL

  // Register the cable object globally
  nuxtApp.provide('cable', cable)
})
