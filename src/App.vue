<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return {
      dataList: [
        {
          name: 'xmh',//人名
          logTime: '',
          content: ''
        },
        {
          name: 'xmh',
          logTime: '',
          content: ''
        },
      ]
    }
  },
  methods:{
    toA(){
      this.$router.push({path: '/A'})
    },
    toB(){
      this.$router.push({path: '/B'})
    },

  },
  mounted(){
    this.$router.push({path: '/A'})
  },
  components: {

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
