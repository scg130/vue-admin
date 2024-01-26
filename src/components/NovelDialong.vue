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
		<el-form :model="formDate" ref="formdoalog" :rules="formdialong" label-width="100px">
			<el-form-item label="小说名" prop="name">
				<el-input type="text" v-model="formDate.name"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input type="text" v-model="formDate.author"></el-input>
			</el-form-item>
      <el-form-item  label="分类" prop="cate_id">
        <el-select v-model="formDate.cate_id" placeholder="请选择">
          <el-option
            v-for="item in dialong.categories"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="img" prop="img">
				<el-input type="text" v-model="formDate.img"></el-input>
        <div class="div_el">
          <el-image :src="formDate.img" />
        </div>
			</el-form-item>
      <el-form-item label="排序" prop="sort">
				<el-input type="number" v-model="formDate.sort"></el-input>
			</el-form-item>
      <el-form-item label="总章节" prop="chapter_total">
				<el-input type="text" disabled v-model="formDate.chapter_total"></el-input>
			</el-form-item>
      <el-form-item label="最新章节" prop="chapter_current">
				<el-input type="text" disabled v-model="formDate.chapter_current"></el-input>
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
  name: "Dialong",
  props: {
    dialong: Object,
    formDate: Object
  },
  data() {
    return {
      formdialong: {
        name: [{ required: true, message: "小说名不能为空", trigger: "blur" }],
        author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
        img: [{ required: true, message: "img不能为空", trigger: "blur" }],
        cate_id: [{ required: true, message: "分类不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      }
    };
  },
  methods: {
    dialongAdd(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          const url =
            this.dialong.option == "add" ? "add" : `edit/${this.formDate.id}`;
          this.formDate.sort = parseInt(this.formDate.sort);
          this.$axios.post(HOST+`/novel/novel/${url}`, this.formDate).then(res => {
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
