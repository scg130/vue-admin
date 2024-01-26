<template>
  <div class="nofind">
    <el-dialog
      :title="dialong.title"
      type="primary"
      size="small"
      :close-on-press-escape="true"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="cancel"
      :visible.sync="dialong.show"
    >
      <el-form :model="form" ref="formdoalog" :rules="formdialog" label-width="80px">
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="ICON" prop="icon">
          <!-- <el-input v-model="form.icon"></el-input> -->
            <el-select v-model="form.icon" placeholder="请选择">
                <el-option
                v-for="item in iconData"
                :key="item.value"
                :label="item.value"
                :value="item.value" 
                :class="item.value"
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="PATH" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="API" prop="api">
          <el-input v-model="form.api"></el-input>
        </el-form-item>

        <el-form-item label="展示：" prop="show">
            <el-radio-group v-model="form.show">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="锁定：" prop="state">
            <el-radio-group v-model="form.state">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="父级菜单" prop="pid">
            <el-select v-model="form.pid" placeholder="请选择">
                <el-option
                v-for="item in menuData"
                :key="item.id"
                :label="item.name"
                :value="item.name" 
                >
                </el-option>
            </el-select>
        </el-form-item> -->

        <el-form-item label="父级菜单" prop="pid">
            <el-select 
	            v-model="form.pidName"
	            filterable placeholder="请选择"
	            :filter-method="filterTree" 
	            @visible-change="changeValue($event)">
                <el-option style="height: auto" value="pidName">
                    <el-tree
                        ref="treeForm"
                        :data="menuData"
                        default-expand-all
                        node-key="id"
                        show-checkbox
                        :default-checked-keys="[this.form.pid]"
                        check-strictly
                        :filter-node-method="filterNode"
                        @check="handleCheckChange"
                    />
                </el-option>
            </el-select>
        </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="addHandle('formdoalog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "MenuDialong",
  data() {
    return {
      formdialog: {
        name: [{ required: true, message: "菜单名不能为空", trigger: "blur" }],
        state: [{required: true, message: "请选择状态", trigger: "change"}],
        icon: [{ required: true, message: "ICON不能为空", trigger: "blur" }],
        path: [{ required: true, message: "PATH不能为空", trigger: "blur" }],
        api: [{ required: true, message: "API不能为空", trigger: "blur" }],
        show: [{required: true, message: "请选择是否展示", trigger: "change"}],
      },
      iconData: [
            {value: 'el-icon-menu'},
            {value: 'el-icon-platform-eleme'},
            {value: 'el-icon-setting'},
            {value: 'el-icon-message'},
            {value: 'el-icon-date'},
            {value: 'el-icon-search'},
            {value: 'el-icon-star-on'},
            {value: 'el-icon-star-off'},
            {value: 'el-icon-delete'},
            {value: 'el-icon-document'},
            {value: 'el-icon-tickets'},
            {value: 'el-icon-upload'},
            {value: 'el-icon-download2-circle'},
            {value: 'el-icon-error'},
            {value: 'el-icon-warning'},
            {value: 'el-icon-question'},
            {value: 'el-icon-info'},
            {value: 'el-icon-service'},
      ],
      menuData: [],
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  methods: {
    cancel() {
      this.dialong.show = false;
      this.$nextTick(() => {
          this.$refs.treeForm.setCheckedKeys([]);
      })
    },
    initTree() {
      this.$axios.get(HOST+'/admin/api/menu/show_tree').then(res => {
                if (res.status === 401) {
                    next("/login");
                    return
                }

					if (res.data.code === 0){
            this.menuData = res.data.data;
					}
				})
    },
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.form)
          let url =
            this.dialong.option == "add" ? "add" : `edit/${this.form.id}`;
          this.$axios.post(HOST+`/admin/api/menu/${url}`, this.form).then(res => {
            if (res.status === 401) {
              next("/login");
              return
            }
            
            if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                }),
              (this.dialong.show = false);
              this.$emit("MenuData");
              //清空内容
              this.form.value = {};
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
            this.initTree();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 自定义过滤方法
	filterTree(val) {
	    this.form.pid = val
	    this.$refs.treeForm.filter(val)
	},
	// 下拉框出现/隐藏时触发
	changeValue(val) {
	if (!val) {
	    this.$refs.treeForm.filter('')
	  }
	},
	//过滤
	filterNode(value, data) {
	   if (!value) return true
	   return data.label.indexOf(value) !== -1
	 },
	// 单选并赋值
	 /**
     * 当复选框被点击的时候触发,传递了两个对象
     * 依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，
     * 树目前的选中状态对象包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
     * @param data
     * @param checked
     */
	handleCheckChange(data, checked) {
	  this.form.pidName = data.label
	  this.form.pid = data.id
	  if (checked.checkedKeys !== '') {
	  /**
         * 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
         * 该方法接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，
         * 参数若为 true 则仅设置叶子节点的选中状态，
         * 默认值为 false
         */
	    this.checkedId = data.id
	    this.$refs.treeForm.setCheckedKeys([data.id], true)
	  } else {
	    this.$refs.treeForm.setCheckedKeys([])
	  }
	},
  },
  created() {
    this.initTree();
  },
};
</script>
<style scoped>
</style>
