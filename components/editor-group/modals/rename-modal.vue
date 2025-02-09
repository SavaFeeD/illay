<script lang="ts" setup>
const workplaceStore = useWorkplaceStore();
const modalStore = useModalStore();

const newName = ref('');
const isInvalid = ref(false);

const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
const data = computed(() => modalStore.getOptions?.data);
const who = computed(() => data.value?.who);
const before = computed(() => data.value?.before);
const id = computed(() => data.value?.id);
const title = computed(() => {
  return `Rename ${who.value}`;
});

function rename() {
  if (!selectedWorkplace.value) return console.warn('No selected workplace');
  if (!id.value) return console.warn(`No ${who.value} id`);
  if (!newName.value?.trim()) {
    isInvalid.value = true;
    return console.warn('No new name');
  }

  switch (who.value) {
    case 'painter':
      selectedWorkplace.value.editor.drawAccumulatorService.renamePainter(id.value, newName.value);
      break;
    case 'layer':
      selectedWorkplace.value.editor.drawAccumulatorService.renameLayer(id.value, newName.value);
      break;
  }

  modalStore.hide();
}

watch(before, (value) => {
  newName.value = value;
}, { immediate: true, deep: true });

watch(newName, (value) => {
  if (value) {
    isInvalid.value = false;
  }
});
</script>

<template>
  <div class="rename-modal-content">
    <h2 class="rename-modal-content__title">{{ title }}</h2>
    <form
      class="input-wrapper"
      :title="`rename ${who.value}`"
      @submit.prevent="rename"
    >
      <input
        v-model="newName"
        type="text"
        name="project-title"
        id="project-title"
        class="input-wrapper__input"
        :class="{ 'input-wrapper__input--invalid': isInvalid }"
        :placeholder="`${who} title`"
      />
      <button
        class="input-wrapper__submit"
        type="submit"
        @submit="rename"
      >
        <span>save</span>
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.rename-modal-content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-size: 20px;
    font-weight: 700;
  }
}

.input-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;

  &__label {
    position: absolute;
    left: 6px;
    font-size: 22px;
    font-weight: 200;
    color: #ffffffab;
  }

  &__input {
    color: #ffffff;
    padding: 8px 65px 8px 16px;
    background-color: #242424;
    border: none;
    border-radius: 5px;
    width: 100%;
    font-size: 18px;

    &--invalid {
      outline: 1px solid rgba(122, 0, 37, 0.801);
    }
  }

  &__submit {
    background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>