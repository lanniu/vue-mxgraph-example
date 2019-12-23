<template>
  <el-dialog title="改变状态" :visible="dialogVisible" width="30%">
    <template v-if="!R.isNil(mCell)">
      <el-radio-group v-model="mStatus">
        <el-radio v-for="status in mCell['customerOptionalStatus']" :key="status" :label="status">{{status}}</el-radio>
      </el-radio-group>
    </template>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'changeStatusDialog',
  data() {
    return {
      dialogVisible: false,
      mCell: null,
      mStatus: ''
    }
  },
  methods: {
    openDialog(cell) {
      this.mCell = cell
      this.dialogVisible = true
      this.$nextTick(() => {
        this.mStatus = cell['customerStatus']
      })
    },
    confirm() {
      this.mCell['customerStatus'] = this.mStatus
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
