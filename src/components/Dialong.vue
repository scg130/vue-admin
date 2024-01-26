<template>
  <div class="dialong">
	<el-dialog
		:title="dialog.title"
		type="primary"
		size="small"
		:close-on-press-escape = "false"
		:modal-append-to-body = "false"
		:close-on-click-modal = "false"
		:visible.sync="dialog.show">
		<el-form :model="formDate" ref="formdoalog" :rules="formdialog" label-width="100px">
			<el-form-item label="分类名称" prop="name">
				<el-input type="text" v-model="formDate.name"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input type="number" v-model="formDate.sort"></el-input>
			</el-form-item>
			<el-form-item label="是否显示" prop="is_show">
        <el-radio-group v-model="formDate.is_show">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
			</el-form-item>
			<el-form-item label="分类频道" prop="channel">
				<el-radio-group v-model="formDate.channel">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>  
			</el-form-item>
			<el-form-item>
				<el-button  @click="dialog.show = false">取消</el-button>
				<el-button type="primary"  @click="dialongAdd('formdoalog')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Dialong",
  props: {
    dialog: Object,
    formDate: Object
  },
  data() {
    return {
      format_type_list: [
        "分类名称",
        "排序",
        "分类频道",
        "是否显示"
      ],
      formdialog: {
        name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        channel: [{ required: true, message: "请选择频道", trigger: "blur" }],
        is_show: [{ required: true, message: "请选择是否显示", trigger: "blur" }]
      }
    };
  },
  methods: {
    dialongAdd(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.formDate)
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.formDate.cate_id}`;
          this.formDate.sort = parseInt(this.formDate.sort);
          this.$axios.post(HOST+`/novel/category/${url}`, this.formDate).then(res => {
            if (res.status === 401) {
              next("/login");
              return
            }
            
            if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                }),
              this.dialog.show = false;
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
