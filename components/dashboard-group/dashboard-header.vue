<template>
  <div class="dashboard-header">
    <h2 class="title"><slot name="title" /></h2>
  </div>
</template>

<style lang="scss" scoped>
  .title {
    color: #ffffff;
    font-size: 36px;
    margin: 35px 0;
  }
</style>