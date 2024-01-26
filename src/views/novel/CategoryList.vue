<template>
  <div class="fundlist">
    <div>
      <el-form :inline="true" ref="search_data" :model="search_data" :rules="rules">
				<!-- <el-form-item label="请选择时间">
					<el-date-picker
						v-model="search_data.startDate"
						type="datetime"
						placeholder="选择开始时间">
					</el-date-picker>
							---
					<el-date-picker
						v-model="search_data.endDate"
						type="datetime"
						placeholder="选择结束时间">
					</el-date-picker>
				</el-form-item> -->
        <el-form-item label="分类名:">
					<el-input type="text" v-model="search_data.name" placeholder="请输入分类名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size ="small" icon="el-icon-search" @click='handleSearc()'>查询</el-button>
				</el-form-item>
        <el-form-item class="btnRight">
            <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddMoney()'>添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
          v-if="tableData.length > 0"
          :data="tableData"
          min-height="460px"
          border
					:default-sort = "{prop: 'date', order: 'descending'}"
          style="width: 100%">
      <el-table-column
          label="ID"
          align='center'
          width="70">
          <template slot-scope="scope">
            <span>{{scope.row.cate_id}}</span>
          </template>
      </el-table-column>
      <el-table-column
        label="分类名称"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分类频道"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.channel == 1 ? "男" : "女"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.is_show == 1 ? "是" : "否"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        width="250"
				sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="padding-left: 10px;">{{ scope.row.date | moment }}</span>
        </template>
      </el-table-column>
      
      <el-table-column 
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit( scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete( scope.row)">删除</el-button>
						<!-- <el-popover
							placement="top"
							width="160"
							v-model="visible">
							<p>确定要删除吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button size="mini" type="text" @click="visible = false">取消</el-button>
								<el-button type="primary" size="mini" @click="getDeleteVisible(scope.$index, scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" @click="handleDelete(scope.row)">删除</el-button>
						</el-popover> -->
        </template>
      </el-table-column>
    </el-table>
		<div v-else class="txt">{{message}}</div>
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
    <Dialong :dialog="dialog" :formDate="formDate" @update="getProfiles"></Dialong>
  </div>
</template>

<script>
// @ is an alias to /src
import Dialong from '../../components/Dialong'
export default {
  name: 'FundList',
    data () {
        return {
					visible: false,
					message:"数据不存在",
					search_data:{
					user_name:""
				},
				rules:{
					name:[
						{required: true,message: '分类名不能为空', trigger: 'blur' }
					]
				},
					filterTabDate:[], //查询数据
					paginations:{
						page_index:1, //当前位于哪页
						total:0, //总数
						page_size:5, //一页显示多少条
						page_sizes:[5,10,15,20], //每页显示多少条
						layout:'total, sizes, prev, pager, next, jumper'
					},
          tableData:[],  //数据
					allTableData:[], //分页数据
          dialog:{  //弹出框
            title:'',
            show:false,
            option:'edit'
          },
          formDate: {  //添加编辑删除需要传的字段
            name: "",
            sort: "",
            is_show: "",
            channel: "",
            cate_id:0,
          },
        }
    },
    created () {
      this.getProfiles()  
    },
    methods:{
      getProfiles() {
        this.$axios.post(HOST+'/novel/category/list',{
          name:this.search_data.name,
          pagnation:{
          page:this.paginations.page_index,
          page_size:this.paginations.page_size,
          },
        }).then(res => {
                if (res.status === 401) {
                    next("/login");
                    return
                }

					if (res.data.code === 0){
						const data = res.data.data;
            if (data != null) {
              this.tableData = data;
              this.paginations.total = data.total;
            } else {
              this.tableData = [];
              this.paginations.total = 0;
            }
            this.setPaginations(res.data.pagnation);
					}
				}).catch(err => console.log(err))
      },
      handleEdit(row) { //编辑信息
        this.dialog={
          title:'编辑信息',
          show:true,
          option:'edit'
        }
        this.formDate = {
          name:row.name,
          sort:row.sort,
          is_show:row.is_show,
          channel:row.channel,
          cate_id: row.cate_id
        }
      },
      handleDelete(row){  //删除数据
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
						this.$axios.delete(HOST+`/novel/category/del/${row.cate_id}`).then(res => {

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
								this.getProfiles();  
						})
					
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
      },
			getDeleteVisible(index,row){
				// console.log(row)
				this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
					this.$message({
						message: '删除成功',
						type: 'success'
					})
				})
				this.getProfiles(); 
				this.visible = false;//隐藏弹出框
			},
      onAddMoney(){  //添加信息
        this.dialog={
          title:'添加信息',
          show:true,
          option:'add'
        }
        this.formDate = {
          name: "",
          channel: "",
          is_show: "",
          sort: ""
        }
      },
			setPaginations(paginaton){
        this.paginations.page_index = paginaton.page;
        this.paginations.page_size = paginaton.page_size;
        this.paginations.total = paginaton.total;
			},
			handleSizeChange(page_size){
				this.paginations.page_index = 1;
				this.paginations.page_size = page_size;
			},
			handleCurrentChange(page){
				this.getProfiles(); 
			},
			handleSearc() { //查询
        this.tableData = [];
        this.setPaginations({
          page:this.paginations.page_index,
          page_size:this.paginations.page_size,
        })
				this.getProfiles();
			}
    },
    components:{
      Dialong
    }
}
</script>
<style scoped>
.fundlist {
  padding: 10px;
}
.btnRight{
  float: right;
}
.paginations{
	text-align: right;
	margin-top: 10px;
}
.txt {
	padding: 20px 0;
	background: #eee;
	font-size: 16px;
	text-align: center;
	color: #606266;
}
</style>
