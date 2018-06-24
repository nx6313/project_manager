<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1f1f1f;
}

html, body {
  padding: 0;
  margin: 0;
  font-size: 16px;
}

.flex-r {
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-direction: row;
    align-items: center;
}

.flex-col {
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-direction: column;
}

.flex-1 {
    flex: 1 1 auto;
}

.flex-c {
    justify-content: center;
}

.flex-b {
    justify-content: space-between;
}

.flex-a {
    justify-content: space-around;
}

.flex-s {
    justify-content: flex-start;
}

.flex-e {
    justify-content: flex-end;
}

.center {
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: center;
    align-items: center;
}

@-webkit-keyframes circleProgressLoad_right{
    0%{
        -webkit-transform: rotate(-135deg);
    }
    50%,100%{
        -webkit-transform: rotate(45deg);
    }
}
@keyframes circleProgressLoad_right{
    0%{
        -webkit-transform: rotate(-135deg);
    }
    50%,100%{
        -webkit-transform: rotate(45deg);
    }
}

@-webkit-keyframes circleProgressLoad_left{
    0%,50%{
        -webkit-transform: rotate(-135deg);
    }
    100%{
        -webkit-transform: rotate(45deg);
    }
}
@keyframes circleProgressLoad_left{
    0%,50%{
        -webkit-transform: rotate(-135deg);
    }
    100%{
        -webkit-transform: rotate(45deg);
    }
}

@-webkit-keyframes spin{
    100%{
        -webkit-transform: rotate(360deg);
    }
}
@keyframes spin{
    100%{
        -webkit-transform: rotate(360deg);
    }
}
</style>
