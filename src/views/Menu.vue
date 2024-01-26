<template>
  <div class="staff">
    <div class="search-box">
			<el-form
				:inline="true"
				ref="search_data"
				:rules="rules"
				:model="search_data"
			>
				<el-form-item label="菜单名:">
					<el-input type="text" v-model="search_data.name" placeholder="请输入菜单名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click='onScreeoutMenu("search_menu")'>筛选</el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="staff-top">
        <el-form :inline="true">
            <el-form-item class="btnRight">
                <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddMenu()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
      <div class="tables">
           <el-table
            :data="menuData"
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
                label="菜单名"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="PATH"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.path }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="API"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.api }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="ICON"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.icon }}</span>
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
            <el-table-column
                label="左侧展示"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.show == 1 ? "是" : "否"}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="父级菜单"
                align="center"
                width="250">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.pid_name }}</span>
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
        <div class="div-pagination">
			<el-pagination
				@size-change="handleSizeChange"
        @current-change="handleCurrentChange"
				:current-page.sync="paginations.page_index"
				:page-sizes="paginations.page_sizes"
				:page-size="paginations.page_size"
				:layout="paginations.layout"
				:total="paginations.total">
			</el-pagination>
		</div>
      </div>
      <MenuDialong :dialong="dialong" :form="form" @MenuData="menuInfo"></MenuDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import MenuDialong from "../components/MenuDialong";
export default {
  name: "Menu",
  data() {
    return {
      paginations:{
						page_index:1, //当前位于哪页
						total:0, //总数
						page_size:10, //一页显示多少条
						page_sizes:[5,10,15,20], //每页显示多少条
						layout:'total, sizes, prev, pager, next, jumper'
					},
      menuData: [], //数据存储
      dialong: {
        //弹出框
        show: false,
        title: "",
        disabled: false,
        option: "edit"
      },
      form: {   //添加和删除需要传递的字段名
        name: "",
        icon: "",
        path: "",
        api:  "",
        pidName: "",
        show: 1,
        state: 2,
        pid: 0
      },
      search_data:{
					name:""
				},
				rules:{
					name:[
						{required: true,message: 'title不能为空', trigger: 'blur' }
					]
				}
    };
  },
  methods: {
			handleSizeChange(page_size){
				this.paginations.page_size = page_size;
        this.onScreeoutMenu();
			},
			handleCurrentChange(){
        this.onScreeoutMenu();
			},
      handlePage(pagnation){
        this.paginations.page_index = pagnation.page;
        this.paginations.page_size = pagnation.page_size;
        this.paginations.total = pagnation.total;
      },
    onScreeoutMenu() {
				this.$axios.post(HOST+'/admin/api/menus',{
          pagnation:{
          page:this.paginations.page_index,
          page_size:this.paginations.page_size,
        },
          name: this.search_data.name,
        }).then(res => {
                if (res.status === 401) {
                    next("/login");
                    return
                }

					if (res.data.code === 0){
						const data = res.data.data;
						this.menuData = data;
            this.handlePage(res.data.pagnation);
					}
				})
			},
    menuInfo() {
      this.$axios
        .post(HOST+'/admin/api/menus',{pagnation:{
          page:this.paginations.page_index,
          page_size:this.paginations.page_size
        }}).then(res => {
          if (res.status === 401) {
            next("/login");
            return
          }
          if (res.status == 200) {
            if (res.data.code === 0) {
              const data = res.data.data;
              this.menuData = data;
              this.handlePage(res.data.pagnation);
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
      this.form = {
          name: row.name,
          icon: row.icon,
          path: row.path,
          api:  row.api,
          show: row.show,
          state: row.state,
          pid: row.pid,
          id:  row.id,
          pidName:row.pid_name,
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
          this.$axios.delete(HOST+`/admin/api/menu/del/${row.id}`).then(res => {
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
            this.menuInfo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddMenu() {
      //添加内容
      this.dialong = {
        title: "添加菜单",
        show: true,
        disabled: false,
        option:"add"
      }
      this.form = {
        name: "",
        icon: "",
        path: "",
        api: "",
        show: 1,
        pid: 0,
        pidName:"",
        state: 2
      }
    }
  },
  created() {
    this.menuInfo();
  },
  components: {
    MenuDialong
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
