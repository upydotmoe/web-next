import { defineStore } from "pinia"

export default defineStore('auth', () => {
  const loggedIn = ref(false)
  const user = ref({
    id: 1,
    username: "admin",
    pen_name: "admin",
    name: "Super Admin",
    location: "Indonesia",
    avatar_driver: "backblaze",
    avatar_bucket: null,
    avatar_b2_file_id: null,
    avatar_filename: null,
    email_verified: 1,
    is_moderator: 0,
    is_admin: 1,
    bio: "I'm the super admin.",
    gender: "m",
    email: "ahmad.uji1902@gmail.com",
    cover_driver: "backblaze",
    cover_bucket: null,
    cover_b2_file_id: null,
    cover_filename: null,
    created_at: "2022-07-26T06:25:44.000Z",
    user_socials: {
      user_id: 1,
      facebook: null,
      instagram: null,
      patreon: null,
      twitter: null,
      youtube: null,
      twitch: null,
      discord: null
    },
    user_settings: {
      user_id: 1,
      language: "en-US",
      dark_mode: 0,
      show_explicit: 0
    }
  })

  const login = async () => {
    loggedIn.value = true
  }

  const logout = async () => {
    loggedIn.value = false
  }

  return {
    loggedIn,
    user,
    login,
    logout
  }
}, {
  persist: true
})