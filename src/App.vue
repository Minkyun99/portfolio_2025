<template>
  <div id="app">
    <nav v-if="showNav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNav: false, // 기본값으로 Nav 숨기기
    };
  },
};
</script>
