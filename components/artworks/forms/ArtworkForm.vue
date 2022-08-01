<template>
  <div>
   <!-- VV -->
  </div>
</template>

<script>
import axios from 'axios'

import vueFilePond from 'vue-filepond'

// filepond configuration
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// stores
import authStore from '@/stores/auth.store'

// components
import Spinner from '~/components/globals/Spinner.vue'
import Icon from '~/components/globals/Icon.vue'

// composables
import useApiFetch from '~/composables/useApiFetch'
import useSetting from '~/composables/useSetting'
import useDate from '~/composables/useDate'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

export default {
  components: {
    FilePond,
    Spinner,
    Icon
  },
  setup () {
    const auth = authStore()
    const { $router } = useNuxtApp()
    const authToken = auth.strategy.token.get()
    const apiUrl = process.env.API_URL

    // composables
    const { oApiConfiguration, fetchOptions } = useApiFetch()

    watch(() => $router.query, () => {
      resetForm()
    })

    onMounted(() => {
      if (!auth.loggedIn) {
        $router.push('/')
      }

      fetchSetting()
    })

    const resetForm = () => {
      artworkFiles.value = []
      tags.value = []
      inputData.value.isExplicit = false
    }

    // Fetch setting relate to artwork upload
    const setting = useSetting(oApiConfiguration, fetchOptions())
    const fetchSetting = async () => {
      const settingMaxFileCount = await setting.getSetting('artwork_max_uploads')
      maxFileCount.value = settingMaxFileCount

      const settingMaxFileSize = await setting.getSetting('artwork_max_file_size')
      maxFileSize.value = settingMaxFileSize

      labelIdleText.value = '<div class=\'text-xxs\'><div>Pick or drop up to ' + maxFileCount.value + ' files here</div><div>PNG, JPG up to ' + maxFileSize.value + 'MB</div></div>'
    }

    // 
    const labelIdleText = ref('')
    const artworkFiles = ref([])

    const handleFilePondUpdateFile = (files) => {
      artworkFiles.value = files.map(files => files.file)
    }

    const inputData = ref({
      title: '',
      description: '',
      tags: '',
      isExplicit: false,
      publishDate: null
    })
    const tags = ref([])

    const alert = ref({
      showFileTooBig: false
    })

    const maxFileSize = ref(5)
    const maxFileCount = ref(1)
    const uploading = ref(false)
    const uploadSuccess = ref(false)
    const uploadError = ref(false)
    const uploadErrorMessage = ref('')
    const storeArtwork = async () => {
      alert.value.showFileTooBig = false

      // collect picked tags and convert to acceptable API format
      const tagValues = []
      tags.value.forEach((tag) => {
        tagValues.push(tag.value)
      })

      // 
      const formData = new FormData()
      formData.append('title', inputData.value.title)
      formData.append('description', inputData.value.description)
      formData.append('tags', tagValues.toString())
      formData.append('is_explicit', inputData.value.isExplicit ? 1 : 0)
      formData.append('scheduled_post', 
        !['', null].includes(inputData.value.publishDate) ?? useDate().formatDateToApi(inputData.value.publishDate) !== 'Invalid Date' ? useDate().formatDateToApi(inputData.value.publishDate) : null
      )

      // check if size is exceeded max file size restriction
      for (let i = 0; i < artworkFiles.value.length; i++) {
        if (artworkFiles.value[i].size > (maxFileSize.value * 1000000)) {
          alert.value.showFileTooBig = true
        }

        if (!alert.value.showFileTooBig) {
          const file = artworkFiles.value[i]
          formData.append('files[]', file)

          // collect file orders, count start from 1
          formData.append('file_order[]', i)
        }
      }

      if (!alert.value.showFileTooBig) {
        // proceed to send data to API
        uploading.value = true
        uploadSuccess.value = false

        await axios.post(
          process.env.API_URL + '/artworks/post',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: authToken
            }
          }
        ).then(({ data }) => {
          if (data.success) {
            const workId = data.data.id

            uploadSuccess.value = true
            setTimeout(() => {
              redirect(app.localePath(`/work/${workId}`))
            }, 1000)
          } else {
            showError()
          }
        }).catch((_) => {
          showError()
        })
      }

      uploading.value = false
    }

    const isError = ref(false)
    const showError = () => {
      isError.value = true
    }

    return {
      resetForm,
      
      apiUrl,
      
      handleFilePondUpdateFile,
      labelIdleText,
      maxFileCount,

      inputData,
      tags,
      alert,
      
      artworkFiles,

      maxFileSize,
      uploading,
      uploadSuccess,
      uploadError,
      uploadErrorMessage,

      storeArtwork,

      isError
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {
    @apply mb-1;
  }
}
</style>
