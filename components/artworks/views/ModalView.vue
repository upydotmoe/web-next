<template>
  <div 
    class="work-container work-view"
    :class="!isModal ? 'w-full' : 'w-full 2xl:w-4/6 2xl:mx-auto p-2 md:p-6 theme-color'"
  >
    <!-- Left side: Image view; total of views, likes, comments, and other works by user -->
    <div class="left-side" :class="{ 'overflow-y-scroll mr-6': isModal }">
      <div v-if="previewMode && !deleteSuccess" class="p-4 mb-4 w-full text-center text-black bg-yellow-200 rounded-md theme-color-secondary">
        <div class="flex flex-row justify-center mb-2">
          <Icon :name="'alert-outline'" />
          <div>You are currently viewing the preview mode, this work isn't published yet.</div>
        </div>
        <div class="font-bold cursor-pointer">
          <span class="text-red-500" @click="deleteConfirmationDialog = true">
            {{ $t('artworks.deleteArtwork') }}
          </span>

          <!-- Delete confirmation -->
          <div v-show="deleteConfirmationDialog">
            <span class="mr-2 font-normal">
              {{ $t('alert.areYouSure') }} <span class="italic">({{ $t('alert.youCannotUndoThisAction') }})</span>
            </span>

            <span class="mr-2 text-red-500 hover:underline" @click="deleteWork(artworkDetail.id)">
              {{ $t('yes') }}
            </span>
            <span class="hover:underline" @click="deleteConfirmationDialog = false">
              {{ $t('no') }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="deleteSuccess" class="alert-success">
        {{ $t('artworks.successDelete') }}
      </div>

      <div v-show="showExplicitAlert" class="flex flex-row justify-between p-3 mb-2 text-black align-middle bg-yellow-200 rounded">
        <span class="mr-4">{{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}</span>

        <button class="primary-button" @click.prevent="removeFilter()">
          {{ $t('show') }}
        </button>
      </div>

      <!-- Image list -->
      <div class="image-list">
        <!-- explicit content alert -->
        <viewer :images="images" class="overflow-hidden rounded-md">
          <img 
            v-for="src in images" 
            :key="src" 
            v-lazy="src"
            :src="src" 
            class="overflow-hidden mb-2 rounded cursor-pointer image image-layer unselectable"
            :class="[{ 'blur-lg unclickable': showExplicitAlert }, showExplicitAlert ? 'brightness-50' : 'brightness-100']"
            loading="lazy"
            @error="imageLoadError"
          />
        </viewer>
      </div>

      <!-- Intereaction area -->
      <div 
        v-show="auth.loggedIn"
        class="interactions"
      >
        <!-- Counter -->
        <div class="reaction-counters">
          <!-- Total of views -->
          <span
            v-show="artworkDetail.views > 0" 
            class="counter"
          >
            <b>{{ shortNumber(artworkDetail.views) }}</b> {{ $t('count.views') }}
          </span>
          
          <!-- Total of likes -->
          <span 
            v-if="artworkDetail._count"
            v-show="artworkDetail._count.artwork_likes > 0" 
            class="counter"
          >
            <b>{{ thousand(artworkDetail._count.artwork_likes) }}</b> {{ $t('count.likes') }}
          </span>

          <!-- Total of comments -->
          <span 
            v-if="artworkDetail._count"
            v-show="artworkDetail._count.artwork_comments > 0" 
            class="counter"
          >
            <b>{{ thousand(artworkDetail._count.artwork_comments) }}</b> {{ $t('count.comments') }}
          </span>
          
          <!-- Total of saves -->
          <span 
            v-if="artworkDetail._count"
            v-show="artworkDetail._count.artwork_collection_has_works" 
            class="counter"
          >
            <b>{{ thousand(artworkDetail._count.artwork_collection_has_works) }}</b>
          </span>
        </div>

        <!-- Reactions -->
        <div v-if="auth.loggedIn && !previewMode" class="reactions">
          <!-- Like -->
          <span @click="liked ? unlike() : like()">
            <Icon 
              v-show="liked"
              id="likeButton"
              :name="'heart'" 
              class="text-red-500 hover:text-red-500"
            />
            <Icon 
              v-show="!liked"
              :name="'heart-outline'" 
              class="hover:text-red-500"
            />
          </span>

          <!-- Save -->
          <span 
            v-if="auth.loggedIn"
            @click="showCollectionSelectionModal()"
          >
            <Icon 
              v-show="saved"
              id="save-to-collection-button"
              :name="'bookmark'" 
              class="text-blue-500 hover:text-blue-500"
            />
            <Icon 
              v-show="!saved"
              :name="'bookmark-outline'" 
              class="hover:text-blue-500"
            />
          </span>

          <!-- Add to album -->
          <span 
            v-if="auth.loggedIn && (artworkDetail.users && auth.user.id === artworkDetail.users.id)"
            @click="showAlbumSelectionModal()"
          >
            <Icon 
              v-show="inAlbum"
              id="save-to-album-button"
              :name="'folder-open'" 
              class="text-green-500 hover:text-green-500"
            />
            <Icon 
              v-show="!inAlbum"
              :name="'folder-open-outline'" 
              class="hover:text-blue-500"
            />
          </span>

          <!-- ellipsis other interaction -->
          <div class="inline-block relative z-30 dropdown">
            <button 
              type="button" 
              aria-haspopup="true" 
              aria-expanded="true" 
              aria-controls="headlessui-menu-items-feed-more-options"
            >
              <span>
                <Icon
                  :name="'ellipsis-vertical-outline'" 
                  class="align-middle icon icon-color"
                />
              </span>
            </button>
            <div class="invisible z-50 rounded-md opacity-0 transition-all duration-300 transform origin-top-right scale-95 -translate-y-2 dropdown-menu">
              <div 
                id="headlessui-menu-items-feed-more-options"
                class="absolute right-0 p-1 mt-2 w-56 rounded-md shadow-lg origin-top-right outline-none theme-color"
                aria-labelledby="headlessui-menu-button-1" 
                role="menu"
              >
                <!-- Open / Open in New Tab (Only show in modal view) -->
                <nuxt-link 
                  v-if="isModal" 
                  :to="'/work/'+artworkDetail.id" 
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                >
                  <Icon :name="'enter-outline'" class="mr-2 text-base" /> {{ $t('open') }}
                </nuxt-link>
                <nuxt-link 
                  v-if="isModal" 
                  :to="'/work/'+artworkDetail.id" 
                  target="_blank" 
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                >
                  <Icon :name="'open-outline'" class="mr-2 text-base" /> {{ $t('openInNewTab') }}
                </nuxt-link>
                
                <div v-if="isModal" class="custom-divider" />

                <div
                  v-if="auth.loggedIn && artworkDetail.users && auth.user.id != artworkDetail.users.id && !auth.user.is_admin && !auth.user.is_moderator"
                  :to="'#'" 
                  class="flex py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                  :class="{ 'rounded-t-md': !isModal }"
                  @click="showReportModal()"
                >
                  <Icon :name="'flag-outline'" class="mr-2 text-base" /> {{ $t('report') }}
                </div>
                <div
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 cursor-pointer theme-color hover:button-color parent-icon hover:text-white"
                  @click="copyLink('/work/'+artworkDetail.id)" 
                >
                  <Icon :name="'link-outline'" class="mr-2 text-base" /> {{ $t('copySharableLink') }}
                </div>

                <div v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id" class="custom-divider" />

                <nuxt-link 
                  v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id"
                  :to="'/works/update/'+artworkDetail.id"
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                >
                  <Icon :name="'settings-outline'" class="mr-2 text-base" /> {{ $t('update') }}
                </nuxt-link>
                <!-- <div
                  v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id"
                  :to="'/works/update/'+artworkDetail.id"
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 cursor-pointer theme-color hover:button-color parent-icon hover:text-white"
                  @click="unpublish()"
                >
                  <Icon :name="'eye-off-outline'" class="mr-2 text-base" /> {{ $t('unpublish') }}
                </div> -->
                <div 
                  v-if="auth.loggedIn && artworkDetail.users && auth.user.id === artworkDetail.users.id" 
                  :to="'/work/'+artworkDetail.id" 
                  class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 cursor-pointer bg-danger hover:button-color parent-icon hover:text-white"
                  @click="openModal('work-deletion-confirm-modal')"
                >
                  <Icon :name="'trash-outline'" class="mr-2 text-base" /> {{ $t('delete') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- section info -->
      <ModalViewInfo
        :section="section"
        class="flex-md-hidden"
        :is-modal="isModal"
        :artwork-detail="artworkDetail"
        :preview-mode="previewMode"
        :is-desktop="true"
      />

      <!-- Other artworks by user that currently viewing (show only on desktop) -->
      <ArtistWorks
        v-if="!loading"
        class="mb-6 hidden-md-flex"
        :artwork-detail="artworkDetail"
        :view="view"
        :is-href="!isModal"
        :keep-artist-page-number="keepArtistPageNumber"
        :pagination-per-page="isModal ? 4 : 4"
      />
    </div>

    <!-- Right side: artwork information, comment section -->
    <div class="right-side" :class="{ 'pr-3 overflow-y-scroll': isModal }">
      <!-- section info -->
      <ModalViewInfo
        :section="section"
        class="hidden-md-flex"
        :is-modal="isModal"
        :artwork-detail="artworkDetail"
        :preview-mode="previewMode"
        :is-desktop="false"
      />

      <!-- other artworks by user (only show in smaller or mobile device) -->
      <ArtistWorks 
        v-if="!loading"
        class="flex-md-hidden"
        :artwork-detail="artworkDetail"
        :view="view"
        :is-href="!isModal"
        :keep-artist-page-number="keepArtistPageNumber"
        :pagination-per-page="isModal ? 4 : 4"
      />

      <!-- comment section -->
      <section class="comments">
        <!-- comment text box -->
        <div v-if="auth.loggedIn && !previewMode" class="comment-box">
          <div class="flex flex-col">
            <div class="flex relative flex-col">
              <textarea
                v-model="commentInput"
                class="input form-input"
                :class="[{ 'cursor-not-allowed': submitCommentLoading }, { 'theme-color-secondary textarea': isModal }]"
                :readonly="submitCommentLoading"
                cols="30"
                :rows="commentInput != null && commentInput != '' ? '8' : '0'"
                :placeholder="$t('comments.inputPlaceholder')"
                :maxlength="commentMaxChar"
                data-gramm="false"
              />
              <span 
                v-show="commentInput != null && commentInput != ''" 
                class="absolute left-4 bottom-6 py-1 px-2 text-white rounded-md button-color"
              >
                {{ commentCharLeft }}
              </span>
              <span class="absolute right-2 bottom-5 py-1 px-2" @click.prevent="submitComment()">
                <Icon 
                  v-show="commentInput != null && commentInput != '' && !submitCommentLoading"
                  :name="'prism'" 
                  class="text-xl transition-all duration-100 rotate-90 cursor-pointer text-colored"
                />
                <Spinner v-show="submitCommentLoading" />
              </span>
            </div>
          </div>
        </div>

        <div v-if="!auth.loggedIn" class="p-4 mb-4 text-center rounded-md theme-color-secondary">
          {{ $t('comments.loginOrRegisterToLeaveComment') }}
        </div>

        <!-- comment list -->
        <div class="comment-content">
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="flex flex-row w-full comment-item"
          >
            <nuxt-link class="mr-2" :to="'/profile/u/'+comment.users.username">
              <img class="w-10 h-10 avatar" :src="avatarCoverUrl(comment.users.avatar_bucket, comment.users.avatar_filename)" @error="imageLoadError">
            </nuxt-link>
            <div class="w-full">
              <div 
                class="p-4 w-full rounded-md"
                :class="!isModal ? 'theme-color' : 'theme-color-secondary'"
              >
                <div class="flex justify-between">
                  <nuxt-link :to="'/profile/u/'+comment.users.username" class="mb-2 text-xs font-medium transition-all duration-150 cursor-pointer hover:font-bold">
                    {{ comment.users.name }}
                  </nuxt-link>
                  <div class="comment-time">
                    {{ formatDate(comment.created_at, true) }}
                  </div>
                </div>
                <div>
                  {{ comment.comment }}
                </div>
                <div class="mt-4 reactions">
                  <div 
                    class="cursor-pointer hover:underline"
                    @click="activeReplyTray == comment.id ? hideReplies(comment.id) : showReplies(comment.id)"
                  >
                    <span v-if="comment._count.artwork_comment_has_replies > 0">
                      <b>{{ shortNumber(comment._count.artwork_comment_has_replies) }}</b> 
                      {{ comment._count.artwork_comment_has_replies > 1 ? $t('comments.replies.replies').toLowerCase() : $t('comments.replies.reply').toLowerCase() }} 
                    </span>
                  </div>
                  <div v-if="auth.loggedIn" class="flex flex-row">
                    <span class="reaction" @click="likedComments.includes(comment.id) ? unlikeComment(comment.id) : likeComment(comment.id)">
                      <Icon v-show="!likedComments.includes(comment.id)" :name="'heart-outline'" class="text-gray-500 hover:text-red-500" />
                      <Icon v-show="likedComments.includes(comment.id)" :id="'comment-like-button-'+comment.id" :name="'heart'" class="text-red-500 hover:text-red-500" />
                      {{ shortNumber(comment._count.artwork_comment_has_likes) }}
                    </span>
                    <span class="reaction" @click="showReplyInput(comment.id)">
                      <Icon :name="'arrow-undo-outline'" class="text-gray-500 hover:text-blue-500" />
                    </span>

                    <!-- Other comment interaction buttons -->
                    <div class="inline-block relative ml-2 dropdown">
                      <button 
                        type="button" 
                        aria-haspopup="true" 
                        aria-expanded="true" 
                        aria-controls="headlessui-menu-items-feed-more-options"
                        @click="showReplyInputId = 0"
                      >
                        <span>
                          <Icon
                            :name="'ellipsis-vertical-outline'" 
                            class="align-middle icon icon-color"
                          />
                        </span>
                      </button>
                      <div class="invisible z-50 rounded-md opacity-0 transition-all duration-300 transform origin-top-right scale-95 -translate-y-2 cursor-pointer dropdown-menu">
                        <div 
                          id="headlessui-menu-items-feed-more-options" 
                          class="absolute right-0 z-50 p-1 mt-2 w-56 rounded-md border shadow-lg origin-top-right outline-none border-color theme-color"
                          aria-labelledby="headlessui-menu-button-1" 
                          role="menu"
                        >
                          <nuxt-link 
                            :to="'/profile/u/'+comment.users.username" 
                            class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                            @click.prevent 
                          >
                            <Icon :name="'person-outline'" class="mr-2 text-base" /> {{ $t('viewProfile') }}
                          </nuxt-link>
                          <div
                            v-if="auth.loggedIn && auth.user.id === comment.users.id"
                            class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                            @click="deleteComment(comment.id)"
                          >
                            <Icon :name="'trash-outline'" class="mr-2 text-base" /> {{ $t('delete') }}
                          </div>
                          <nuxt-link 
                            v-if="auth.loggedIn && auth.user.id !== comment.users.id"
                            :to="'#'" 
                            class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                            @click.prevent 
                          >
                            <Icon :name="'flag-outline'" class="mr-2 text-base" /> {{ $t('report') }}
                          </nuxt-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reply input -->
              <div 
                v-if="auth.loggedIn" 
                v-show="showReplyInputId === comment.id"
                class="-mb-4 comment-box"
              >
                <div class="flex flex-col">
                  <div class="flex relative flex-col">
                    <textarea
                      :id="'reply-'+comment.id"
                      v-model="replyInput"
                      class="mt-2 w-full input form-input"
                      :class="[{ 'cursor-not-allowed': submitReplyLoading }, { 'theme-color-secondary textarea': isModal }]"
                      :readonly="submitReplyLoading"
                      cols="30"
                      :rows="replyInput != null && replyInput != '' ? '5' : '0'"
                      :placeholder="$t('comments.replies.write')"
                      :maxlength="replyMaxChar"
                      data-gramm="false"
                    />
                    <span 
                      v-show="replyInput != null && replyInput != ''" 
                      class="absolute left-4 bottom-6 py-1 px-2 text-white rounded-md button-color"
                    >
                      {{ replyCharLeft }}
                    </span>
                    <span class="absolute right-2 bottom-5 py-1 px-2" @click.prevent="submitReply(comment.id)">
                      <Icon 
                        v-show="replyInput != null && replyInput != '' && !submitReplyLoading"
                        :name="'prism'" 
                        class="text-xl transition-all duration-100 rotate-90 cursor-pointer text-colored"
                      />
                      <Spinner v-show="submitReplyLoading" />
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Comment replies -->
              <div 
                :id="'comment-replies-'+comment.id"
                class="hidden flex-col mt-2"
              > 
                <div 
                  v-if="commentReplies[comment.id] && commentReplies[comment.id].length"
                  class="w-full"
                >
                  <span class="float-left mb-2 text-xs italic text-color-secondary">{{ $t('comments.replies.replies') }}</span>
                  <span 
                    class="float-right text-xs cursor-pointer hover:font-semibold"
                    @click="hideReplies(comment.id)" 
                  >
                    {{ $t('hide') }}
                  </span>
                </div>
                <div 
                  v-for="reply in commentReplies[comment.id]"
                  :key="reply.id"
                  class="p-3 mb-2 w-full rounded-md border-l-4"
                  :class="!isModal ? 'theme-color' : 'theme-color-secondary'"
                >
                  <div 
                    class="flex flex-row justify-between"
                  >
                    <nuxt-link :to="'/profile/u/'+reply.users.username" class="flex flex-row leading-6">
                      <img class="mr-2 w-6 h-6 rounded-full" :src="avatarCoverUrl(reply.users.avatar_bucket, reply.users.avatar_filename)" @error="imageLoadError">
                      <span class="transition-all duration-150 cursor-pointer hover:font-bold">{{ reply.users.name }}</span>
                    </nuxt-link>
                    <span class="leading-6 comment-time">
                      {{ formatDate(reply.created_at, true) }}
                    </span>
                  </div>

                  <!-- The reply -->
                  <div class="mt-2">
                    {{ reply.content }}
                  </div>

                  <!-- Reactions -->
                  <div v-if="auth.loggedIn" class="mt-2 reactions">
                    <span />
                    <div class="flex flex-row">
                      <span class="reaction" @click="likedReplies.includes(reply.id) ? unlikeReply(reply.id) : likeReply(reply.id)">
                        <Icon v-show="likedReplies.includes(reply.id)" :id="'reply-like-button-'+reply.id" :name="'heart'" class="text-red-500 hover:text-red-500" />
                        <Icon v-show="!likedReplies.includes(reply.id)" :name="'heart-outline'" class="text-gray-500 hover:text-red-500" />
                        {{ shortNumber(reply._count.artwork_comment_reply_has_likes) }}
                      </span>
                      
                      <!-- Other reply interaction buttons -->
                      <div class="inline-block relative ml-2 dropdown">
                        <button 
                          type="button" 
                          aria-haspopup="true" 
                          aria-expanded="true" 
                          aria-controls="headlessui-menu-items-feed-more-options"
                        >
                          <span>
                            <Icon
                              :name="'ellipsis-vertical-outline'" 
                              class="align-middle icon icon-color"
                            />
                          </span>
                        </button>
                        <div class="invisible z-50 rounded-md opacity-0 transition-all duration-300 transform origin-top-right scale-95 -translate-y-2 cursor-pointer dropdown-menu">
                          <div 
                            id="headlessui-menu-items-feed-more-options" 
                            class="absolute right-0 z-50 p-1 mt-2 w-56 rounded-md border shadow-lg origin-top-right outline-none border-color theme-color"
                            aria-labelledby="headlessui-menu-button-1" 
                            role="menu"
                          >
                            <nuxt-link 
                              :to="'/profile/u/'+reply.users.id" 
                              class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                              @click.prevent 
                            >
                              <Icon :name="'person-outline'" class="mr-2 text-base" /> {{ $t('viewProfile') }}
                            </nuxt-link>
                            <div
                              v-if="auth.loggedIn && auth.user.id === reply.users.id"
                              class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                              @click="deleteReply(comment.id, reply.id)"
                            >
                              <Icon :name="'trash-outline'" class="mr-2 text-base" /> {{ $t('delete') }}
                            </div>
                            <nuxt-link 
                              v-if="auth.loggedIn && auth.user.id !== reply.users.id"
                              :to="'#'" 
                              class="flex z-50 py-2 px-3 w-full rounded-md transition-all duration-150 theme-color hover:button-color parent-icon hover:text-white"
                              @click.prevent 
                            >
                              <Icon :name="'flag-outline'" class="mr-2 text-base" /> {{ $t('report') }}
                            </nuxt-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  v-if="commentReplies[comment.id] && showLoadMoreReplies" 
                  class="text-center transition ease-in-out delay-75 cursor-pointer hover:font-semibold hover:underline text-color-secondary"
                  @click="loadMoreReplies(comment.id)"
                >
                  {{ $t('comments.replies.loadMore') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="artworkDetail._count"
          v-show="artworkDetail._count.artwork_comments > 3 && showLoadOlderComments"
          class="primary-button"
          @click.prevent="loadMoreComments(artworkDetail.id)"
        >
          {{ $t('comments.loadOlder') }}
        </div>

        <div v-show="comments.length && !showLoadOlderComments" class="w-full text-xs italic text-center">
          {{ $t('comments.reachedTheEnd') }}
        </div>

        <div v-if="auth.loggedIn && !comments.length && !previewMode" class="mt-4 w-full text-xs italic text-center">
          {{ $t('comments.noCommentYet') }}
        </div>
      </section>
      <!-- end of comment section -->
    </div>

    <!-- add or remove from selected collection(s) -->
    <!-- <ManageSave 
      v-if="!loading"
      id="collection-selection-modal"
      ref="collectionSelectionModalRef"
      :work-id="artworkDetail.id"
      class="modal"
      @save="save"
    /> -->

    <!-- add or remove from selected album(s) -->
    <!-- <ManageAlbum
      v-if="!loading && (auth.loggedIn && artworkDetail.users && auth.user.id == artworkDetail.users.id)"
      id="album-selection-modal"
      ref="albumSelectionModalRef"
      :modal-id="'album-selection-modal'"
      :work-id="artworkDetail.id"
      class="modal"
      @addedToAlbum="addedToAlbum"
    /> -->

    <!-- Work deletion confirmation dialog -->
    <ConfirmationDialog
      id="work-deletion-confirm-modal"
      :modal-id="'work-deletion-confirm-modal'"
      :message="`${$t('alert.areYouSure')} ${$t('alert.youCannotUndoThisAction')}`"
      class="modal"
      @onAccept="deleteWork(artworkDetail.id)"
    />

    <!-- Report modal -->
    <!-- <ReportModal 
      id="report-modal"
      ref="reportModalRef"
      class="modal"
      :type="'artwork'"
      :post-id="artworkDetail.id"
      :report-status="reportStatus"
    /> -->
    
    <!-- Link copied notification -->
    <SplashAlert 
      v-show="copied"
      id="copy-alert"
      :text="'Link copied'"
      :icon="'copy-outline'"
    />
  </div>
</template>

<script setup>
import 'viewerjs/dist/viewer.css'

import { useClipboard } from '@vueuse/core'

// components
import ModalViewInfo from './ModalViewInfo.vue'
import ArtistWorks from '~/components/artworks/views/ArtistWorks.vue'
import Icon from '~/components/globals/Icon.vue'
import Spinner from '~/components/globals/Spinner.vue'
// import ManageSave from '~/components/artworks/ManageSave.vue'
// import ManageAlbum from '~/components/albums/ManageAlbum'
import ConfirmationDialog from '~/components/globals/ConfirmationDialog.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
// import ReportModal from '~/components/reports/ReportModal.vue'

// stores
import authStore from '@/stores/auth.store'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const { applyExplicitFilter, removeExplicitFilter, generateSemiCompressedArtworkUrl } = useImage()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const reportApi = useReport(oApiConfiguration, fetchOptions())

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  section: {
    type: String,
    default: ''
  }
})

const auth = authStore()
const { $router, env } = useNuxtApp()

watch(() => $router.query, () => {
  // close modal on changing route or going back to previous page
  closeArtworkModals()

  // close collection selection modal
  useModal().closeModal('collection-selection-modal')

  // close album selection modal
  useModal().closeModal('album-selection-modal')

  // close report modal
  useModal().closeModal('report-modal')
})

onMounted(() => {
  if (props.id !== '') {
    view(props.id)
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArtworkModals()
    }
  })
})

const closeArtworkModals = () => {
  useModal().closeModal(`${props.section}-modal`)
}

const showExplicitAlert = ref(false)
const removeFilter = () => {
  showExplicitAlert.value = false
  removeExplicitFilter()
}

const isModal = props.id === ''

/** Increase view count */
const increaseView = async (workId) => {
  await artworkApi.incraseViewCount(workId)
}

/** Open the modal view function */
const previewMode = ref(false)

const loading = ref(true)
const keepArtistPageNumber = ref(false)

const artworkDetail = ref({})
const images = ref([])
const liked = ref(false)
const saved = ref(false)
const inAlbum = ref(false)

const view = async (selectedWorkId, keepArtistPageNumberParam = false) => {
  comments.value = []
  commentReplies.value = []
  keepArtistPageNumber.value = keepArtistPageNumberParam
  
  loading.value = true

  // fetch artwork detail
  const [data, error] = await artworkApi.getWorkById(selectedWorkId)

  if (error) {
    showError()
  } else {
    artworkDetail.value = data

    images.value = []
    data.artwork_assets.forEach((asset) => {                                                    
      images.value.push(generateSemiCompressedArtworkUrl(asset.bucket, asset.filename, true))
    })
    
    if ((!auth.loggedIn && data.is_explicit) || (data.is_explicit && !auth.user.user_settings.show_explicit)) {
      showExplicitAlert.value = true
      applyExplicitFilter()
    } else {
      showExplicitAlert.value = false
    }

    liked.value = data.liked
    saved.value = data.saved
    inAlbum.value = data.in_album

    // get publish status, if it's not published yet, redirect non-authorized user to homepage, otherwise show the artwork
    const published = useDate().formatApiToWeb(data.scheduled_post) < useDate().currentUtcTime()
    if (!published) {
      if (auth.user.id !== data.users.id) {
        $router.push('/')
      } else {
        previewMode.value = true
      }
    } else {
      // fetch comments
      await getComments(selectedWorkId)

      // Get report status if user is logged in, if user alreadey reported the post, then prevent user to re-report it
      if (auth.loggedIn) {
        await getReportStatus(selectedWorkId)
      }

      // increase view count
      if (!auth.loggedIn || auth.user.id !== data.users.id) {
        await increaseView(selectedWorkId)
      }
    }
  }

  loading.value = false
}

const reportStatus = ref({})
const getReportStatus = async (workId) => {
  const [report, error] = await reportApi.getReportStatus({
    type: 'artwork',
    postId: workId
  })

  if (error) {
    // todo: handle error
  } else if (report.length) {
    reportStatus.value = report[0]
  } else {
    reportStatus.value = {}
  }
}

/** Likes */
const like = async () => {
  const [success, error] = await artworkApi.like({
    workId: artworkDetail.value.id
  })
  
  if (success) {
    liked.value = true

    // animate
    const likeButton = document.getElementById('likeButton')
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlike = async () => {
  const [success, error] = await artworkApi.unlike({
    workId: artworkDetail.value.id
  })
  
  if (success) {
    liked.value = false
  } else {
    // todo: handle error
  }
}

/** Comments */
// comments
const comments = ref([])
const commentPagination = reactive({
  perPage: 3,
  page: 0
})
const commentIndexes = ref([])

const fetchComments = async (workId) => {
  const [data, error] = await artworkApi.getComments({
    workId,
    pagination: {
      page: commentPagination.page,
      perPage: commentPagination.perPage
    }
  })

  if (data) {
    if (data.pagination.current_page === data.pagination.first_last.last_page) {
      showLoadOlderComments.value = false
    } else {
      showLoadOlderComments.value = true
    }

    // collect liked artwork by current user logon
    data.comments.forEach((comment) => {
      if (comment.liked) {
        likedComments.value.push(comment.id)
      }

      // push comment id to comment indexes, used to remove the comment from comments ref when deleting a comment
      commentIndexes.value.push(comment.id)
    })

    return data.comments
  } else {
    // todo: handle error
  }
}

/** Get first few comments */
const getComments = async (workId) => {
  try {
    const firstFewComments = await fetchComments(workId)

    firstFewComments.forEach(comment => comments.value.push(comment))
  } catch (error) {
    // 
  } 
}

/** Load more comments (comment pagination) */
const showLoadOlderComments = ref(false)
const loadMoreComments = async (workId) => {
  try {
    commentPagination.page += 1
    const moreComments = await fetchComments(workId)

    moreComments.forEach(comment => comments.value.push(comment))
  } catch (error) {
    // 
  }
}

const commentInput = ref()
const commentMaxChar = 200
const commentCharLeft = computed(() => (commentInput.value != null && commentInput.value !== '') ? commentMaxChar - commentInput.value.length : commentMaxChar)

/** Submit a comment */
const submitCommentLoading = ref(false)
const submitComment = async () => {
  submitCommentLoading.value = true

  try {
    const [success, data, error] = await artworkApi.addComment({
      workId: artworkDetail.value.id,
      comment: commentInput.value
    })

    if (success) {
      commentInput.value = ''
      comments.value.splice(0, 0, data)
      comments.value.join()

      // push comment id to comment indexes
      commentIndexes.value.splice(0, 0, data.id)
      commentIndexes.value.join()
    } else {
      // todo: handle error
    }
  } catch (error) {
    // 
  }

  submitCommentLoading.value = false
}

const deleteComment = async (commentId) => {
  const [success, error] = await artworkApi.deleteComment({
    commentId
  })

  // remove deleted comment from `comments` ref
  if (success) {
    const indexOfIdToRemove = commentIndexes.value.indexOf(commentId)
    comments.value.splice(indexOfIdToRemove, 1)

    commentIndexes.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const likedComments = ref([])
const likeComment = async (commentId) => {
  const [success, error] = await artworkApi.likeComment({
    commentId
  })
  
  if (success) {
    likedComments.value.push(commentId)

    // animate
    const likeButton = document.getElementById(`comment-like-button-${commentId}`)
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlikeComment = async (commentId) => {
  const [success, error] = await artworkApi.unlikeComment({
    commentId
  })

  if (success) {
    const indexOfIdToRemove = likedComments.value.indexOf(commentId)
    likedComments.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

/** Replies */
const commentReplyPagination = reactive({
  perPage: 2,
  page: 0
})
const commentReplies = ref([])
const commentReplyIndexes = ref([])
const showLoadMoreReplies = ref(true)

const fetchReplies = async (commentId) => {
  const [replies, pagination, error] = await artworkApi.getCommentReplies({
    commentId,
    pagination: {
      page: commentReplyPagination.page,
      perPage: commentReplyPagination.perPage
    }
  })

  if (error) {
    // todo: handle error
  } else {
    if (pagination.current_page === pagination.first_last.last_page) {
      showLoadMoreReplies.value = false
    }

    // push reply id to reply indexes, used for delete reply function
    replies.map(reply => commentReplyIndexes.value.push(reply.id))

    return replies
  }
}

const activeReplyTray = ref(0)
const showReplies = async (commentId) => {
  showLoadMoreReplies.value = true
  commentReplyIndexes.value = []

  try {
    const data = await fetchReplies(commentId)
    commentReplies.value = {
      [commentId]: data
    }

    // collect liked replies
    data.forEach((reply) => {
      if (reply.liked) {
        likedReplies.value.push(reply.id)
      }
    })

    if (activeReplyTray.value) {
      hideReplies(activeReplyTray.value)
    }

    const commentReplyEl = document.getElementById(`comment-replies-${commentId}`)
    commentReplyEl.classList.add('flex')
    commentReplyEl.classList.remove('hidden')

    activeReplyTray.value = commentId
  } catch (error) {
    // 
  }
}

const hideReplies = (commentId) => {
  const commentReplyEl = document.getElementById(`comment-replies-${commentId}`)
  commentReplyEl.classList.remove('flex')
  commentReplyEl.classList.add('hidden')
}

const loadMoreReplies = async (commentId) => {
  commentReplyPagination.page += 1
  try {
    const data = await fetchReplies(commentId)
    data.forEach((reply) => {
      commentReplies.value[commentId].push(reply)
    })
  } catch (error) {
    // 
  }
}

const showReplyInputId = ref(0)
const showReplyInput = async (commentId) => {
  await showReplies(commentId)
  showReplyInputId.value = commentId
}

const replyInput = ref()
const replyMaxChar = 200
const replyCharLeft = computed(() => (replyInput.value != null && replyInput.value !== '') ? replyMaxChar - replyInput.value.length : replyMaxChar)

/** Submit reply */
const submitReplyLoading = ref(false)
const submitReply = async (commentId) => {
  submitReplyLoading.value = true

  try {
    const [success, data, error] = await artworkApi.addReply({
      commentId,
      reply: replyInput.value
    })

    if (success) {
      // expand replies div
      showReplies(commentId)
      
      replyInput.value = ''
      commentReplies.value[commentId].splice(0, 0, data)
      commentReplies.value[commentId].join()

      showReplyInputId.value = 0

      // push reply id to reply indexes
      commentReplyIndexes.value.splice(0, 0, data.id)
      commentReplyIndexes.value.join()
    } else {
      // todo: handle error
    }
  } catch (error) {
    // 
  }

  submitReplyLoading.value = false
}

const deleteReply = async (commentId, replyId) => {
  const [success, error] = await artworkApi.deleteReply({
    replyId
  })

  if (success) {
    const indexOfIdToRemove = commentReplyIndexes.value.indexOf(replyId)
    commentReplies.value[commentId].splice(indexOfIdToRemove, 1)

    commentReplyIndexes.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

const likedReplies = ref([])
const likeReply = async (replyId) => {
  const [success, error] = await artworkApi.likeReply({
    replyId
  })

  if (success) {
    likedReplies.value.push(replyId)
    
    // animate
    const likeButton = document.getElementById(`reply-like-button-${replyId}`)
    likeButton.classList.add('animate-bounce')
    setInterval(() => {
      likeButton.classList.remove('animate-bounce')
    }, 2500)
  } else {
    // todo: handle error
  }
}

const unlikeReply = async (replyId) => {
  const [success, error] = await artworkApi.unlikeReply({
    replyId
  })
  
  if (success) {
    const indexOfIdToRemove = likedReplies.value.indexOf(replyId)
    likedReplies.value.splice(indexOfIdToRemove, 1)
  } else {
    // todo: handle error
  }
}

/** Show error on fetch failure */
const isError = ref(false)
const showError = () => {
  isError.value = true
}

/** Cancel publish or delete work */
const deleteConfirmationDialog = ref(false)
const deleteSuccess = ref(false)
const deleteWork = async (workId) => {
  const [success, error] = await artworkApi.deleteWork({
    workId: [workId]
  })

  if (success) {
    deleteSuccess.value = true

    setTimeout(() => {
      $router.push('/')
    }, 1500)
  } else {
    // todo: handle error
  }
}

/** 
 * ====================================================================================================================
 * COLLECTIONS
 * ====================================================================================================================
*/
/**
 * Show collection selection modal
 * When triggering this action it will automatically fetch where the item were saved, and
 * automatically select the selected collections.
 */
const collectionSelectionModalRef = ref(null)
const showCollectionSelectionModal = () => {
  useModal().openModal('collection-selection-modal')
  collectionSelectionModalRef.value.fetchCurrentSaved()
}

/**
 * This method will be triggered via event handling called `@save` on component `ManageSave` 
 * once the user selects a collection and clicks the save button, and it will automatically close 
 * the modal and update the collection selection.
 */
const save = (unsaved) => {
  if (unsaved) {
    saved.value = false
  } else {
    saved.value = true
  }

  // animate
  useBounceAnimation().animate('save-to-collection-button')
}

/** 
 * ====================================================================================================================
 * ALBUMS
 * ====================================================================================================================
*/

/**
 * Show album selection modal
 * When triggering this action it will automatically fetch where the item were saved and 
 * automatically select the selected albums.
 */
const albumSelectionModalRef = ref(null)
const showAlbumSelectionModal = () => {
  useModal().openModal('album-selection-modal')
  albumSelectionModalRef.value.fetchCurrentSaved()
}

/**
 * This method will be triggered via event handling called `@addedToAlbum` on component `ManageAlbum` 
 * once the user selects an album and clicks the save button, and it will automatically close 
 * the modal and update the album selection.
 */
const addedToAlbum = (unsaved) => {
  if (unsaved) {
    inAlbum.value = false
  } else {
    inAlbum.value = true
  }

  // animate
  useBounceAnimation().animate('save-to-album-button')
}

/**
 * ====================================================================================================================
 * MISC
 * ====================================================================================================================
 */
// Copy current work url to clipboard
const copied = ref(false)
let splashInterval
const copyLink = (link) => {
  const source = ref(env.APP_URL + link)
  const { copy } = useClipboard({ source })
  copy()

  // show splash notification
  useSplash().splash(splashInterval, copied, 'copy-alert')
}

/**
 * @reportModal
 * Show report modal
 */
const reportModalRef = ref(null)
const showReportModal = () => {
  useModal().openModal('report-modal')
}

defineExpose({
  view
})
</script>

<style lang="scss" scoped>
@import "~/assets/css/artworks/view.scss";

.mini-profile-info {
  @apply w-full px-4 py-6 mb-2 border-b cursor-pointer z-50;
}

// emojis
.emoji-invoker { transition: all 0.2s }
.emoji-invoker:hover { transform: scale(2.1) }
.emojis:after { content: ""; flex: auto }
</style>
