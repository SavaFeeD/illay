<script setup lang="ts">
const modalStore = useModalStore();

const isOpen = computed(() => modalStore.isOpen);
const key = computed(() => modalStore.getKey);
const options = computed(() => modalStore.getOptions);

function close() {
  modalStore.hide();
}
</script>

<template>
  <div class="modal" v-if="isOpen">
    <div class="modal__background" @click="close"></div>
    <div
      class="modal__content"
      :class="[
        { 'modal__content--top': options?.position === 'top' },
      ]"
    >
      <div class="modal__content__wrapper">
        <save-modal     v-if="key === 'save'"     />
        <rename-modal   v-if="key === 'rename'"   />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    z-index: 1000000000000000000;

    &__background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(0, 0, 255, 0.164) 0%, rgba(255, 0, 195, 0.048) 100%);
    }

    &__content {
      display: flex;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      max-width: 450px;
      width: 100%;
      border-radius: 10px;
      padding: 2px;
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);

      &--top {
        top: 20%;
      }
    }

    &__content__wrapper {
      padding: 25px 15px;
      background: #181818;
      border-radius: 10px;
      width: 100%;
    }
  }
</style>