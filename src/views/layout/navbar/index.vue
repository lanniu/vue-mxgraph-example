<template>
  <div class="navbarContainer">
    <div class="titleContainer">
      <i class="collapseIcon"
         :class=" !isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold' "
         @click="collapse"
      />
      <span class="title">{{title}}</span>
    </div>
    <div class="tagsContainer">
      <span v-for="tag in Object.values(tagsContainer)"
            class="tagItem"
            @mouseup="clickHandler(tag, $event)"
            :key="tag['name']"
            :class="Object.is(activeKey, tag['name']) ? 'tagItemActive' : ''"
      >
        {{tag['meta']['title']}}
        <i class="tagCloseIcon el-icon-close"
           @mouseover="mouseoverHandler"
           @mouseleave="mouseleaveHandler"
           @click="deleteOneTagFromContainer(tag)"
        />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  computed: {
    tagsContainer() {
      return this.$store.getters.tagsContainer
    },
    isCollapse: {
      get() {
        return this.$store.getters.sidebarCollapse
      },
      set(val) {
        this.$store.commit('setSidebarCollapse', val)
      }
    },
    activeKey() {
      return Object.keys(this.tagsContainer)[this.activeIndex]
    },
    title() {
      return this.R.pathOr('', [this.activeIndex, 'meta', 'title'], Object.values(this.tagsContainer))
    }
  },
  watch: {
    $route: {
      handler() {
        this.addOneTagToContainer(this.$route)
      },
      immediate: true
    },
    activeKey() {
      if (this.R.isNil(this.activeKey)) {
        this.addOneTagToContainer(this.$route)
        return
      }
      this.$router.push(this.activeKey)
    }
  },
  data() {
    return {
      activeIndex: -1,
      deleteTimeOut: null
    }
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    clickHandler(tag, evt) {
      const {button} = evt

      if (Object.is(0, button)) {
        this.$router.push(tag['name'])
      }
      if (Object.is(1, button)) {
        this.deleteOneTagFromContainer(tag)
      }
    },
    mouseleaveHandler(evt) {
      if (!this.R.isNil(this.deleteTimeOut)) {
        clearTimeout(this.deleteTimeOut)
      }
      evt.target.parentNode.classList.remove('tagItemDelete')
      evt.target.classList.remove('el-icon-circle-close')
      evt.target.classList.add('el-icon-close') },
    mouseoverHandler(evt) {
      this.deleteTimeOut = setTimeout(() => {
        evt.target.parentNode.classList.add('tagItemDelete')
        evt.target.classList.remove('el-icon-close')
        evt.target.classList.add('el-icon-circle-close')
      }, 300)
    },
    deleteOneTagFromContainer(item) {
      this.$store.dispatch('deleteOneTagFromContainer', item)
      if (this.activeIndex >= Object.keys(this.tagsContainer).length) {
        this.activeIndex--
      }
      if (Object.is(-1, this.activeIndex)) {
        this.$router.push('welcome')
      }
    },
    async addOneTagToContainer(item) {
      this.activeIndex = await this.$store.dispatch('addOneTagToContainer', item)
    }
  }
}
</script>

<style lang="scss">
.navbarContainer {
  height: 100%;
  $titleContainerHeight: 30px;
  $tagsContainerHeight: calc(100% - #{$titleContainerHeight});

  .titleContainer {
    display: flex;
    align-items: center;
    height: $titleContainerHeight;
    border-bottom: 1px solid #efefef;

    .collapseIcon {
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: 0.5em;
    }

    .title {
      font-size: 1.2rem;
      margin-left: 1rem;
    }
  }

  .tagsContainer {
    height: $tagsContainerHeight;
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #efefef;

    .tagItem {
      font-size: 0.8rem;
      padding: 3px 10px;
      margin-left: 5px;
      background: #efefef;
      transition: all 0.3s;

      .tagCloseIcon {
        cursor: pointer;
      }

      &.tagItemActive {
        background: #37bb44;
        color: #efefef;
      }

      &.tagItemDelete {
        background: #bb3a3e;
        color: #efefef;
      }
    }
  }
}
</style>
