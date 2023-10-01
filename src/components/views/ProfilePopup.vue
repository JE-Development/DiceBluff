

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask-saved">
      <div class="modal-wrapper-saved">
        <div class="modal-container-saved" style="background: #00000022">
          <div style="justify-content: center">
            <div class="center-horizontal" style="margin-top: 20px">
              <div>


                <div style="height: 20px"></div>

                <div ref="header" class="center-horizontal main-grid">
                  <img src="../../assets/pb/bugs.png" class="pb pb-select pointer" @click="click1"/>
                  <img src="../../assets/pb/dog.png" class="pb pb-select pointer" @click="click2"/>
                  <img src="../../assets/pb/glow.png" class="pb pb-select pointer" @click="click3"/>
                  <img src="../../assets/pb/mike.png" class="pb pb-select pointer" @click="click4"/>
                  <img src="../../assets/pb/sigma.png" class="pb pb-select pointer" @click="click5"/>
                  <img src="../../assets/pb/sponge.png" class="pb pb-select pointer" @click="click6"/>
                  <img src="../../assets/pb/squid.png" class="pb pb-select pointer" @click="click7"/>
                  <img src="../../assets/pb/stick.png" class="pb pb-select pointer" @click="click8"/>
                  <img src="../../assets/pb/stonks.png" class="pb pb-select pointer" @click="click9"/>
                  <img src="../../assets/pb/sus.png" class="pb pb-select pointer" @click="click10"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>



<script>

export default {
  name: "ProfilePopup",

  props: {
    show: Boolean,
  },
  data(){
    return{
      savedContent: [],
    }
  },


  created() {

  },

  methods: {
    onClose(){
      this.$emit("close")
    },
    getCookies(key){
      return this.$cookies.get(key);
    },
    setCookies(key, value){
      return this.$cookies.set(key, value, 2147483647);
    },

    handlePb(name){
      this.setCookies("pb", name)
      this.onClose()
    },

    click1(){
      this.handlePb("bugs")
    },
    click2(){
      this.handlePb("dog")
    },
    click3(){
      this.handlePb("glow")
    },
    click4(){
      this.handlePb("mike")
    },
    click5(){
      this.handlePb("sigma")
    },
    click6(){
      this.handlePb("sponge")
    },
    click7(){
      this.handlePb("squid")
    },
    click8(){
      this.handlePb("stick")
    },
    click9(){
      this.handlePb("stonks")
    },
    click10(){
      this.handlePb("sus")
    }
  },

}
</script>

<style>
.modal-mask-saved {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper-saved {
  display: table-cell;
}

.modal-container-saved {
  display: block;
  width: 90vw;
  margin: 0px auto;
  padding: 5px 5px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}


@media (max-width: 740px) {
/*
  .modal-container-saved{
    width: 90vw;
  }*/

}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}


.modal-enter-from .modal-container-saved,
.modal-leave-to .modal-container-saved {
  opacity: 0;
}
</style>