<template>
  <div class="flex flex-col flex-1 p-6">
    <!-- chat container -->
    <a href="/" class="justify-self-start">
      <button class="btn btn-circle top-2 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </a>
    <div class="flex flex-col h-full flex-1 p-4 gap-4 overflow-auto">
      <div class="w-fit  max-w-3/4 text-wrap flex flex-col h-fit" :class="{ 'self-end': message.username == username }"
        v-for="message in messages" :key="message.key">
        <div :class="{ 'self-end': message.username == username }">
          {{ message.username }}
        </div>
        <div class="rounded-2xl p-4 text-slate-50 bg-emerald-400 text-wrap"
          :class="{ 'bg-emerald-800': message.username == username }">
          {{ message.content }}
        </div>
      </div>
    </div>
    <div class="rounded-md bg-slate-200 w-full flex justify-self-end">
      <div class="relative w-full flex flex-1">
        <input type="text" v-model="newMessage" placeholder="Send message..." class="w-full p-4 rounded-l-md" />
      </div>
      <button class="flex-0 flex justify-center items-center px-4" @click="sendMessage">Send</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const config = useRuntimeConfig()

const route = useRoute()
const messages = ref([])
const newMessage = ref('')
const username = useCookie('username')


if (import.meta.client) {
  const { data, pending, error } = await useFetch(`${config.public.apiBase}/messages/${route.params.id}`,
    {
      method: "GET",
      onResponse({ request, response, options }) {
        if (response.status == 200) {
          messages.value = [...response._data, ...messages.value]
          // console.log(messages.value)
        }
        // console.log(messages.value)
      }
    }
  );


}


const cable = useNuxtApp().$cable

let chatChannel = null

// Subscribe to the chat channel on mount
onMounted(() => {
  chatChannel = cable.subscriptions.create(
    { channel: `ChatChannel`, room: route.params.id }, // Replace 'BestRoom' with your room name
    {
      received(data) {
        messages.value.push(data)
        console.log(data)
      },
    }
  )
})



// Send a message
const sendMessage = async () => {
  if (newMessage.value.trim() === '') return

  // Broadcast the message to the chat channel
  chatChannel.send({ content: newMessage.value, username: username.value, room: route.params.id })

  newMessage.value = ''
}

// set username


// Cleanup on component unmount
onUnmounted(() => {
  if (chatChannel) {
    chatChannel.unsubscribe()
  }
})
</script>