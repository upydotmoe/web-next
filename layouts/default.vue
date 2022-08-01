<template>
  <div>
    <Nuxt 
      keep-alive
      :exclude="['/post', 'post', 'pages/post', '/pages/post']"
    />
  </div>
</template>
