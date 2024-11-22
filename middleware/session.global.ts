export default defineNuxtRouteMiddleware((to, from) => {
    const username = useCookie('username')
    // console.log(username.value)
    
    if(!username.value && to.path !== '/') {
      return navigateTo('/')
    }
  })