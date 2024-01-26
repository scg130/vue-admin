<template>
  <div class="dialog">
	<el-dialog
		:title="dialong.title"
		type="primary"
		size="small"
		:close-on-press-escape = "true"
		:modal-append-to-body = "false"
		:close-on-click-modal = "false"
		:visible.sync="dialong.show">
		<el-form :model="vipData" ref="formdoalog" :rules="formdialong" label-width="100px">
			<el-form-item label="最小章节编号" prop="min_chapter">
				<el-input type="number" v-model="vipData.min_chapter"></el-input>
			</el-form-item>
			<el-form-item label="最大章节编号" prop="max_chapter">
				<el-input type="number" v-model="vipData.max_chapter"></el-input>
			</el-form-item>
      <el-form-item label="是否设置vip" prop="is_vip">
        <el-radio-group v-model="vipData.is_vip">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
      </el-form-item>
			<el-form-item>
				<el-button  @click="dialong.show = false">取消</el-button>
				<el-button type="primary"  @click="dialongAdd('formdoalog')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "NovelVipDialong",
  props: {
    dialong: Object,
    vipData: Object
  },
  data() {
    return {
      formdialong: {
        min_chapter: [{ required: true, message: "请输入最小章节编号", trigger: "blur" }],
        max_chapter: [{ required: true, message: "请输入最大章节编号", trigger: "blur" }],
      }
    };
  },
  methods: {
    dialongAdd(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          this.vipData.min_chapter = parseInt(this.vipData.min_chapter);
          this.vipData.max_chapter = parseInt(this.vipData.max_chapter);
          this.$axios.post(HOST+`/novel/novel/vip/${this.vipData.id}`, this.vipData).then(res => {
            if (res.status === 401) {
              next("/login");
              return
            }
            
            if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                }),
              this.dialong.show = false;
              this.$emit("update");
              //清空内容
              this.form = {};
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
