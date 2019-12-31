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
            @click="$router.push(tag['name'])"
            :key="tag['name']"
            :class="Object.is(activeKey, tag['name']) ? 'tagItemActive' : ''"
      >
        {{tag['meta']['title']}}
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
    }
  },
  data() {
    return {
      activeIndex: -1
    }
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
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
      font-size: 1.5rem;
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
      cursor: pointer;
      background: #efefef;

      &.tagItemActive {
        background: #37bb44;
        color: #efefef;
      }
    }
  }
}
</style>
