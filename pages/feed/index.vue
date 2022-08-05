<template>
  <Layout 
    :with-footer="true"
    :hide-side="isMobile()"
  >
    hello from feed
  </Layout>
</template>

<script setup>
// 
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.user-info {
  @apply flex flex-row;

  .avatar {
    @apply mr-3 w-10 h-10 rounded-md;
  }

  .name {
    .fullname {
      @apply text-tiny font-bold;
    }
    .username {
      @apply text-xs;
    }
  }
}

.interactions {
  @apply flex flex-row justify-between mb-6;

  .reaction-counters {
    .counter {
      @apply mr-3 whitespace-nowrap;

      ion-icon {
        @apply mr-1 text-lg text-gray-400 align-middle transition-all hover:text-gray-400;
      }

      span {
        @apply align-middle;
      }
    }
  }

  .reactions {
    span {
      @apply ml-3 whitespace-nowrap;

      ion-icon {
        @apply ml-1 text-xl align-middle transition-all cursor-pointer;
      }
    }
  }
}

.info {
  @apply mb-4;
  
  .creator-publish {
    @apply flex flex-row justify-between mb-2 align-middle;
  }
}
.comments {
  @apply mt-4;

  .comment-box {
    @apply mb-6;

    textarea {
      @apply mt-0 mb-0 w-full form-input input;
    }

    button {
      @apply w-full font-bold primary-button;
    }
  }

  .comment-content {
    .comment-order {
      @apply flex justify-end mb-4 w-full;

      button {
        @apply py-2 px-3 underline rounded-sm cursor-pointer;
      }
    }

    .comment-item {
      @apply mb-4;

      .comment-time {
        @apply italic;
        color: var(--link);
      }

      .reactions {
        @apply flex justify-end;

        .reaction {
          @apply ml-3 whitespace-nowrap;

          .icon {
            @apply mr-1 align-middle transition-all cursor-pointer;
          }
        }
      }
    }
  }
}

.option {
  @apply inline relative z-10 justify-end;

  .thumbnail {
    @apply transition-all cursor-pointer icon-color focus:outline-none;

    img {
      @apply object-cover w-9 h-9 rounded-md shadow-lg;
    }
  }

  .option-dropdown {
    @apply flex invisible z-20 flex-col opacity-0 transition-all duration-300 transform origin-top-right scale-95;

    .toggler {
      @apply absolute right-0 z-20 mt-2 rounded-md shadow-lg origin-top-right outline-none theme-color;

      .menu-wrapper {
        @apply p-1 rounded-md theme-color;

        .menu {
          @apply flex z-50 flex-row py-3 px-4 mx-auto w-full capitalize rounded-md cursor-pointer;

          ion-icon {
            @apply mr-2;
          }

          &:hover {
            @apply text-white;
            background: var(--button);
            border-color: var(--button);
          }
        }
      }
    }
  }
}
</style>
