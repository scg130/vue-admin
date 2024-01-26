<template>
 
  <el-container class="auth-container">
    <el-header style="width:100%;margin:15px 0px;padding:0px 15px;">
 
      <el-row class="el-row-bg">
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click="dialogFormVisible=true">新增角色</el-button>
 
          <el-button type="primary" icon="el-icon-edit-outline" @click="saveAuth">保存角色权限</el-button>
        </el-col>
 
      </el-row>
    </el-header>
 
    <el-container class="auth-container">
      <el-aside class="auth-aside">
        <el-tree style="height:100%;" :data="data" @check="handleCheckChange" show-checkbox default-expand-all node-key="id"
          ref="authTree" highlight-current :props="defaultProps">
        </el-tree>
      </el-aside>
      <el-main class="auth-main">
 
        <!--数据表格-->
        <el-table size="medium" :loading="true" :header-cell-style="{background:'#eef1f6',color:'#606266'}" ref="singleTable"
          :highlight-current-row="true" @row-click="rowClick" :data="result" style="width: 100%">
          <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="name" label="角色名称" width="200" align="left">
            <template slot-scope="scope">
              <el-link @click="queryRoleModuleId(scope.row.menu_ids)">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="800">
            <!--slot-scope:类似将每一行的row对象封装到槽中，之后直接从scope中获取row对象信息即可-->
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-edit-outline" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑角色信息</el-button>
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除角色</el-button>
            </template>
          </el-table-column>
        </el-table>
 
        <!--分页组件-->
        <div class="div-pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            :page-sizes="[8, 10, 20,30]" :page-size="rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
 
        <!--弹出框-->
        <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogFormVisible" @close="dialogClose">
          <el-form :label-position="labelPosition" :model="roleForm" :rules="rules" ref="roleForm">
            <el-form-item prop="name" label="角色名称" :label-width="formLabelWidth">
              <input type="hidden" v-model="roleForm.id" />
              <el-input v-model="roleForm.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="dialogFormVisible = false" icon="el-icon-close">取 消</el-button>
            <el-button type="primary" @click="doFormSubmit" icon="el-icon-edit-outline">保 存</el-button>
          </div>
        </el-dialog>
 
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    name: 'rolemodel',
    data: function() {
      return {
        result: [],
        page: 1,
        rows: 8,
        total: 0,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        title: '新增角色',
        dialogFormVisible: false,
        formLabelWidth: '80px',
        labelPosition: 'right',
        roleForm: {
          id: null,
          name: null
        },
        //表单验证
        rules: {
          name: [{
            required: true,
            message: '请输入角色名称！',
            trigger: 'blur'
          }]
        },
        //权限Tree选中的节点
        moduleids: [],
        //获取table当前选中行row对象
        curRow: null
      };
    },
    methods: {
      //自定义索引
      indexMethod: function(index) {
        return (this.page - 1) * this.rows + (index + 1);
      },
      //分页
      handleSizeChange: function(rows) {
        this.page = 1;
        this.rows = rows;
        this.query();
      },
      handleCurrentChange: function(page) {
        this.page = page;
        this.query();
      },
      //Dialog弹出框的close方法
      dialogClose: function() {
        this.doFormReset();
      },
      //form表单重置
      doFormReset: function() {
        //通过form表单的ref属性来清空表单验证信息
        this.$refs['roleForm'].resetFields();
        //清空上一次表单的数据信息
        this.roleForm.id = null;
        this.roleForm.name = null;
 
        this.title = "新增角色";
      },
      //数据查询
      query: function(p) {
        var url = HOST + '/admin/api/roles';
        this.$axios.post(url).then(resp => {
          this.result = resp.data.data;
          this.total = resp.data.total;
        }).catch();
      },
      //表格行的单击事件
      rowClick: function(row, column, event) {
        this.curRow = row;
      },
      //数据表格行的编辑操作
      handleEdit: function(index, row) {
        //console.log(index, row);
        this.roleForm.id = row.id;
        this.roleForm.name = row.name;
        //设置对话框title
        this.title = "角色编辑";
        //显示对话框
        this.dialogFormVisible = true;
      },
      //数据表格行的删除操作
      handleDelete: function(index, row) {
        //console.log(index, row);
        this.$confirm('确认删除当前角色模块权限吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url = HOST + '/admin/api/role/del/'+row.id;
          this.$axios.delete(url).then(resp => {
            let data = resp.data;
            if (data.code == 0) {
              //跳转页面
              this.$message({
                message: "删除当前角色模块权限成功",
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.query();
            }
          }).catch();
        }).catch(() => {});
        this.query();
      },
      
      //表单提交
      doFormSubmit: function() {
        //默认新增
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            var url = HOST + '/admin/api/role/add';
            var params = {
              name: this.roleForm.name
            };
            if (this.title == "角色编辑") {
              url = HOST + '/admin/api/role/edit/' + this.curRow.id;
            }
            this.$axios.post(url, params).then(resp => {
              let data = resp.data;
              if (data.code == 0) {
                //跳转页面
                this.$message({
                  message: "角色编辑成功",
                  type: 'success'
                });
                this.dialogFormVisible = false;
                this.query();
              }
            }).catch();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.query(1);
      },
      saveAuth: function() {
        if (this.moduleids.length <= 0) {
          this.$message({
            showClose: true,
            message: '请选择权限分配给指定角色！',
            type: 'error'
          });
          return false;
        }
        if (null == this.curRow) {
          this.$message({
            showClose: true,
            message: '请选中你要分配权限的角色！',
            type: 'error'
          });
          return false;
        }
        if (this.curRow.roleId == 1) {
          return this.$message({
            type: 'error',
            message: '管理员不允许操作哦！'
          });
        }
        var params = {
          id: this.curRow.id,
          name: this.curRow.name,
          menu_ids: this.moduleids//传递参数时直接toString也更省事，后台只需切割一下。
        }
        var url = HOST + '/admin/api/role/edit/' + this.curRow.id;
        this.$axios.post(url, params).then(resp => {
          let data = resp.data;
          if (data.code == 0) {
            //跳转页面
            this.$message({
              message: "角色编辑成功",
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.query();
          }
        }).catch();
      },
      queryRoleModuleId: function(menu_ids) {
        //先清空，再查权限
        this.$refs['authTree'].setCheckedKeys([]);
          this.moduleids = menu_ids;
          if (this.moduleids) {
            this.$nextTick(() => {
              this.moduleids.forEach(value => { //真的大坑
                this.$refs.authTree.setChecked(value, true, false) //给树节点赋值
              });
              this.checkStrictly = false //重点： 赋值完成后 设置为false
            })
          }
      },
      handleCheckChange: function(data, checked) {
        //checked.checkedKeys  选中的节点id数组
        //checked.halfCheckedKeys 半选中节点id数组
        this.moduleids = checked.halfCheckedKeys.concat(checked.checkedKeys); //选中节点和半选中节点所有的id
        console.log(this.moduleids);
      }
    },
    created: function() {
      this.$nextTick
      //加载权限树
      var url = HOST+'/admin/api/menu/tree';
      this.$axios.get(url).then(resp => {
        this.data = resp.data.data;
      }).catch();
      //加载角色列表
      this.query(1);
    }
  }
</script>
<style scoped>
  .auth-container {
    height: 100%;
    width: 100%;
    display: flex;
    object-fit: fill;
 
  }
 
  .auth-aside {
    width: 200px !important;
    padding: 0px 10px;
    height: 100%;
    object-fit: fill;
    margin-left: 5px;
  }
 
  .auth-main {
    padding: 0px;
    height: 100%;
    margin-right: 15px;
  }
 
  .el-row-bg {
    padding-top: 10px;
    padding-left: 10px;
    color: #000000;
    font-weight: bold;
    height: 60px;
    background: #f4f4f5;
  }
</style>