<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask-saved">
      <div class="modal-wrapper-saved">
        <div class="modal-container-saved" style="background: #00000022">
          <div style="justify-content: center">
            <div class="center full-size" style="margin-top: 20px">
              <div>

                <div class="center-horizontal">
                  <p>{{ lang.register.tutorialInfo }}</p>
                </div>

                <div class="center-horizontal">
                  <UIButton :title="lang.register.gameInstructionsButton" @click="onInstruction" color="line2" />
                </div>

                <div class="center-horizontal">
                  <UIButton :title="lang.register.tutorialButton" @click="onTutorial" color="line1" />
                </div>

                <h1 class="white">{{ headline }}</h1>
                <div class="button-layout center-horizontal">
                  <UIButton :title="lang.gamePage.cancel" @click="cancelled" color="fifth-color-background" />
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

import UIButton from "@/components/views/UIButton.vue";

export default {
  name: "ChooseTutorialPopup",
  components: { UIButton },

  props: {
    show: Boolean,
    players: Array,
    errorNoPlayer: String,
    headline: String,
    lang: Object
  },
  data() {
    return {
      names: [],
    }
  },


  created() {

  },

  mounted() {

  },

  methods: {
    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },

    cancelled() {
      this.$emit("cancel")
    },
    onTutorial() {
      this.$emit("tutorial")
    },
    onInstruction() {
      this.$emit("instruction")
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