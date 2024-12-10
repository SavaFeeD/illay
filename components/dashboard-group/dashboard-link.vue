<script setup lang="ts">
interface IProps {
  to: string
};
defineProps<IProps>();
</script>

<template>
  <div
    class="dashboard-link"
    :class="{
      'dashboard-link_active': $route.path === to
    }"
  >
    <NuxtLink class="link" :to="to"><slot /></NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
  .dashboard-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    &_active {
      background: linear-gradient(0deg, #9807FF 0%, #8C46FE 100%);
    }
    &:hover {
      background: linear-gradient(0deg, #9807FF 0%, #8C46FE 100%);
    }
    &:focus {
      background: linear-gradient(0deg, #9807FF 0%, #8C46FE 100%);
    }
  }

  .link {
    display: flex;
    width: 100%;
    padding: 7px 0;
    text-align: center;
    justify-content: center;
  }
</style>