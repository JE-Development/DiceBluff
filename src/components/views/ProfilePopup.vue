

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask-saved center">
      <div class="center">
        <div class="modal-container-saved" style="background: #00000022">
          <div style="justify-content: center">
            <div class="center-horizontal" style="margin-top: 20px">
              <div>


                <div style="height: 20px"></div>

                <div ref="header" class="center-horizontal main-grid">
                  <img
                      v-for="(dat) in pbList"

                      :src="'../../src/assets/pb/' + dat + '.png'" class="pb pb-select pointer" @click="click(dat)"/>
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
      pbList: import.meta.env.VITE_PB.split(","),
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

    click(dat){
      this.handlePb(dat)
    },
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