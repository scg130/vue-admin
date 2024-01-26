<template>
  <div class="staff">
    <div class="search-box">
			<el-form
				:inline="true"
				ref="search_data"
				:rules="rules"
				:model="search_data"
			>
				<el-form-item label="账号:">
					<el-input type="text" v-model="search_data.user_name" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click='onScreeoutUser("search_user")'>筛选</el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="staff-top">
        <el-form :inline="true">
            <el-form-item class="btnRight">
                <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddMoney()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
      <div class="tables">
           <el-table
            :data="userData"
            border
            style="width: 100%">
            <el-table-column
                label="ID"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="用户名"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="邮箱"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.email }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="手机"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
             <el-table-column
                label="锁定"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.state == 1 ? "是" : "否"}}</span>
                </template>
            </el-table-column>
            <!--
            <el-table-column
                label="生日"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.birthday | moment }}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="创建日期"
                align="center"
                width="250">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <UserDialong :dialong="dialong" :form="form" @UserData="userInfo"></UserDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import UserDialong from "../components/UserDialong";
export default {
  name: "Staff",
  data() {
    return {
      userData: [], //数据存储
      dialong: {
        //弹出框
        show: false,
        title: "",
        disabled: false,
        option: "edit"
      },
      form: {   //添加和删除需要传递的字段名
        user_name: "",
        id: "",
        email: "",
        phone: "",
        passwd: "",
        state: 2,
        role_ids: [],
      },
      search_data:{
					user_name:""
				},
				rules:{
					user_name:[
						{required: true,message: '账号不能为空', trigger: 'blur' }
					]
				}
    };
  },
  methods: {
    onScreeoutUser() {
				// this.paginations.total = 100;
				this.$axios.post(HOST+'/admin/api/users',this.search_data).then(res => {
          if (res.status === 401) {
            next("/login");
            return
          }

					if (res.data.code === 0){
						const data = res.data.data;
						this.userData = data;
						// console.log(this.tableData)
					}
				})
			},
    userInfo() {
      this.$axios
        .post(HOST+'/admin/api/users').then(res => {
          if (res.status === 401) {
            next("/login");
            return
          }
          if (res.status == 200) {
            if (res.data.code === 0) {
              const data = res.data.data;
              this.userData = data;
            }
          }
        }).catch(err => console.log(err));
    },
    handleEdit(index, row) {
			// console.log(row)
      //编辑
      this.dialong = {
        title: "编辑信息",
        show: true,
        disabled: true,
        option:"edit"
      }
      var ids = row.role_ids == null ? [] : row.role_ids;
      this.form = {
          user_name: row.user_name,
          email: row.email,
          phone: row.phone,
          passwd: "",
          state: row.state,
          id:row.id,
          role_ids: ids
      }
    },
    handleDelete(index, row) {
      //删除数据
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(HOST+`/admin/api/user/del/${row.id}`).then(res => {
            if (res.status === 401) {
              next("/login");
              return
            }
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          this.onScreeoutUser();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddMoney() {
      //添加内容
      this.dialong = {
        title: "添加信息",
        show: true,
        disabled: false,
        option:"add"
      }
      this.form = {
        user_name: "",
        email: "",
        phone: "",
        passwd: "",
        confirm_passwd: "",
        state: 2,
        role_ids: []
      }
    }
  },
  created() {
    this.userInfo();
  },
  components: {
    UserDialong
  }
};
</script>
<style scoped>
.staff {
  margin: 10px;
}
.btnRight {
  float: right;
}
</style>
