<template>
  <div>1112</div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    getData() {
      this.$axios({
          method:'post',
          url:'testApi/market-service/market/list',
          data:{}
      }).then((response) =>{          //这里使用了ES6的语法
          console.log(response)       //请求成功返回的数据
      })
    }
  },
  components: {},
  computed: {},
}
</script>
<style lang='less' scoped>
</style>