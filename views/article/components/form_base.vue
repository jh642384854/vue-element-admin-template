<template>
  <div class="app-container">
      <span v-if="isEdit == true">编辑页面</span>
      <span v-else>添加页面111</span>
  </div>
</template>

<script>
export default {
  name: 'Article Form',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  }
}
</script>