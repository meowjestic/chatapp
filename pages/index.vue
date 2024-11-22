<template>
    <div class="flex flex-1 flex-col relative">
        <div class="p-4 py-8 rounded-t-md bg-slate-300 font-bold">
            Lobby
        </div>
        <div class="flex flex-col h-full flex-1 p-4 gap-4 overflow-auto">
            <a :href="'/chat/' + room.id" v-for="room in rooms" :key="room.key">
                <div class="bg-slate-200 p-4 rounded-md">
                    <div class="text-lg font-bold">
                        {{ room.name }}
                    </div>
                    <div class="text-sm text-slate-600">
                        {{ room.desc }}
                    </div>
                    <div class="text-xs text-slate-600">
                        Creator : {{ room.owner }}
                    </div>
                </div>
            </a>
        </div>
        <div class="absolute bottom-2 right-2">
            <button class="btn" onclick="my_modal_5.showModal()">Add Room</button>
        </div>
    </div>

    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <label class="form-control w-full mb-4">
                <div class="label">
                    <span class="label-text">Room name</span>
                </div>
                <input type="text" placeholder="Enter the room name" class="w-full p-4 rounded-md border"
                    v-model="room_name" />
            </label>
            <label class="form-control w-full mb-4">
                <div class="label">
                    <span class="label-text">Room Description</span>
                </div>
                <input type="text" placeholder="Enter the room description" class="w-full p-4 rounded-md border"
                    v-model="room_desc" />
            </label>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn bg-success text-white" @click="createRoom">Create</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<script setup>
const config = useRuntimeConfig()
const username = useCookie('username')
const rooms = ref([])
const room_name = ref("")
const room_desc = ref("")

// set username
if (import.meta.client) {
    if (!username.value) {
        let name = prompt("Enter your username")
        username.value = name
    }

    const { data, pending, error } = await useFetch(`${config.public.apiBase}/rooms`,
        {
            method: "GET",
            onResponse({ request, response, options }) {
                if (response.status == 200) {
                    rooms.value = [...response._data, ...rooms.value]
                    // console.log(rooms.value)
                }
                // console.log(rooms.value)
            }
        }
    );


}

const createRoom = async () => {
    if(room_name.value == "" || room_desc.value == ""){
        return
    }
    // console.log(`here`)
    const { data, pending, error } = await useFetch(`${config.public.apiBase}/rooms`, {
        method: "POST",
        body: { name: room_name.value, desc: room_desc.value, username: username.value },
        onResponse({ request, response, options }) {
            if (response.status == 200) {
                rooms.value.push(response._data)
                // console.log(response._data)
            }
        }
    })
}

</script>