<template>
    <div>
        <img class="index" src="../assets/images/index.png">
    </div>
</template>
<script>
import "@/assets/scss/CV.scss";
import "@/assets/scss/iconfont/iconfont.scss";
import "@/assets/scss/github-markdown.scss";

export default {
  mounted() {
    setTimeout(() => {
      this.$router.push({
        name: "list"
      });
    }, 2000);
  }
};
</script>
<style>
.index {
  width: 100%;
  background-color: #fff;
  margin-top: 40%;
}
</style>