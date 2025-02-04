<script setup lang="ts">
interface IProps {
  name: string;
  options: string[];
  initialFirst?: boolean;
};
const props = defineProps<IProps>();

const emits = defineEmits(['change']);

const selected = ref('');

if (props.initialFirst) {
  selected.value = props.options[0];
}

function selectOption() {
  emits('change', selected.value);
}
</script>

<template>
  <div class="radio-button">
    <div
      class="option"
      :class="{
        'option_active': selected === option,
        'options_has-last': options.length >= 3,
      }"
      v-for="(option, order) in options"
      :key="`${option}-${order}`"
    >
      <label
        :for="`${option}-${order}`"
        class="option__label"  
      >
        {{ option }}
      </label>
      <input
        class="option__input"  
        type="radio"
        :name="name"
        :id="`${option}-${order}`"
        :value="option"
        v-model="selected"
        @change="selectOption"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .radio-button {
    border: 1px solid #535460;
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    overflow: hidden;
  }
  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px 6px;

    &_active {
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
    }
    &:nth-child(1) {
      border-right: 1px solid #535460;
    }
    
    &__label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      cursor: pointer;
      color: #ffffff;
    }
    
    &__input {
      display: none;
    }
  }

  .options_has-last:nth-last-child(1) {
    border-left: 1px solid #535460;
  }

</style>