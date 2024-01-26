<template>
	<div v-if="showCard" class="pay-list">
		<div class="search-box">
			<el-form
				:inline="true"
				ref="search_data"
				:model="search_data"
				>
				<el-form-item label="名称:">
					<el-input type="text" v-model="search_data.name" placeholder="请输入小说名"></el-input>
				</el-form-item>
				<el-form-item label="作者:">
					<el-input type="text" v-model="search_data.author" placeholder="请输入作者名"></el-input>
				</el-form-item>
				<el-form-item label="分类:">
					<el-select v-model="search_data.cate_id" placeholder="请选择">
						<el-option 
						v-for="item in search_data.cates"
						:key="item.value"
						:label="item.text"
						:value="item.value"
						>

						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click='onScreeoutMoney("search_data")'>筛选</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="search-box">
			<el-form
				:inline="true"
				ref="spider_data"
				:model="spider_data"
				>
				<el-form-item label="名称:">
					<el-input type="text" v-model="spider_data.name" placeholder="请输入小说全名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click='handleSpider({},true)'>爬取</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="tab-content">
			<el-table
				:data="tableData"
				style="width: 100%;height=70%  !important">
				<el-table-column
					label="ID"
					align='center'
					width="120">
					<template slot-scope="scope">
						<span style="color: rgb(0, 102, 204)">{{ scope.row.id }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="作者"
					align='name'
					width="120">
					<template slot-scope="scope">
						<span style="color:rgb(0, 208, 83)">+{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="image"
					align='center'
					width="120"
					height="40"
					>
					<template slot-scope="scope">
						<!-- <span style="color:rgb(0, 208, 83)">+{{ scope.row.img }}</span> -->
					<el-popover placement="top-start" trigger="hover">
						<div>
							<img :src="scope.row.img" alt="">
						</div>
						<span style="color:rgb(0, 208, 83)" slot="reference">+{{scope.row.img}}</span>
					</el-popover>
					</template>
				</el-table-column>
				<el-table-column
					label="作者"
					align='center'
					width="120">
					<template slot-scope="scope">
						<span style="color:rgb(0, 208, 83)">+{{ scope.row.author }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="分类下排序"
					align='center'
					width="120">
					<template slot-scope="scope">
						<span style="color:rgb(0, 208, 83)">{{ scope.row.sort }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="分类"
					align='center'
					:filters="fields.category.filter.list"
					:filter-method="filterType"
					width="120">
					<template slot-scope="scope">
						<el-tag :type="payTypeTag(scope.row.cate_id)">
							{{showCategory(scope.row.cate_id)}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					label="总章节"
					align='center'
					width="100"
					>
					<template slot-scope="scope">
						<span>{{scope.row.chapter_total}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="最新章节"
					align='center'
					width="100">
					<template slot-scope="scope">
						<span>{{ scope.row.chapter_current }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="创建时间"
					align='center'
					width="210">
					<template slot-scope="scope">
						<i class="el-icon-time"></i>
						<span style="color: rgb(102, 204, 255);margin-left: 10px">{{ scope.row.createAt | moment}}</span>
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
						type="success"
						@click="handleSpider(scope.row,false)">爬取</el-button>
					<el-button
						size="small"
						type="warning"
						@click="handleVip(scope.row.id)">vip章节</el-button>	
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
			
		<NovelDialong :dialong="dialong" :formDate="formDate" @update="getList"></NovelDialong>
		<NovelVipDialong :dialong="vipDialong" :vipData="vipData" @update="getList"></NovelVipDialong>
	</div>
</template>
  <script>
// @ is an alias to /src
const pinyin = require('js-pinyin');
import NovelDialong from '../../components/NovelDialong';
import NovelVipDialong from '../../components/NovelVipDialong';
var cateList = new Array();
cateList[0] = {
	text:"请选择",
	value:0
};
export default {
	name: 'Novel',
	data() {
		return {
			showCard:false,
			paginations:{
						page_index:1, //当前位于哪页
						total:0, //总数
						page_size:5, //一页显示多少条
						page_sizes:[5,10,15,20], //每页显示多少条
						layout:'total, sizes, prev, pager, next, jumper'
					},
			tableData:[],
			fields:{
				category:{
					filter:{
						list:cateList
					}
				}
			},
			dialong: {
				//弹出框
				show: false,
				title: "",
				disabled: false,
				option: "edit",
				categories: cateList,
			},
			vipDialong: {
				show: false,
				title: "",
				disabled: false,
				option: "vip",
			},
			vipData:{
				id:0,
				min_chapter:0,
				max_chapter:0,
				is_vip:1,
			},
			formDate: {
				id: "",
				cate_id: "",
				name: "",
				img: "",
				author: "",
				category: "",
				sort: "",
				chapter_total: "",
				chapter_current: "",
			},
			search_data:{
				name:"",
				cate_id:"",
				author: "",
				cates:cateList,
			},
			spider_data:{
				name:""
			}
		}
	},
	methods: {
		initCates(){
			this.$axios.post(HOST+'/novel/category/list',{"page":1,"page_size":9999}).then(res => {
				    if (res.status === 401) {
						next("/login");
						return
					}
					if (res.data.code == 0) {
						
						res.data.data.forEach((cate, index) => {
							cateList[index+1] = {
								text: cate.name,
								value: cate.cate_id
							}
						})
						this.showCard = true;
					} 
					cateList[0] = {
								text: "请选择",
								value: 0
							};
					console.log(cateList)
			});
		},
		getList() {
			this.$axios.post(HOST+'/novel/novel/list',{
					name:this.search_data.name,
					author:this.search_data.author,
					cate_id:parseInt(this.search_data.cate_id),
					pagnation:{
						page:this.paginations.page_index,
						page_size:this.paginations.page_size,
					},
        }).then(res => {
				if (res.status === 401) {
						next("/login");
						return
				}
				if (res.data.code == 0) {
					if (res.data.data != null) {
					this.tableData = res.data.data;
					this.paginations.total = res.data.paginations;
					} else {
					this.tableData = [];
					this.paginations.total = 0;
					}
					this.setPaginations(res.data.pagnation);
				}
			})
		},
		showCategory(cate_id) {
			var cate = "未知";
			cateList.forEach(function(item) {
				if (item.value == cate_id) {
					cate = item.text;
					return ;
				}
			});	
			return cate;
		},
		handleSpider(row,is_spider){
			var name = "";
			if (is_spider) {
				name = this.spider_data.name;
			} else {
				name = row.name;
			}
			var py_name = pinyin.getFullChars(name).toLowerCase();
			if (py_name.length == 0) {
				this.$message({
					message: '请输入小说全名',
					type: 'warning'
				});
				return
			}
			this.$axios.post(HOST+'/novel/novel/spider',{
				py_name: py_name,
				zh_name: name,
			}).then(res => {
					if (res.status === 401) {
							next("/login");
							return
					}
					if (res.data.code == 0) {
						this.$message({
							message: '操作成功',
							type: 'success'
						});
					}
				})
		},
		handleVip(id){
			this.vipDialong={
				show:true,
				title:"VIP章节设置",
				disabled:false,
				option:"vip",
			}
			this.vipData={
				id:id,
				min_chapter:0,
				max_chapter:0,
				is_vip:1,
			}
		},
		handleEdit(row) { //编辑信息
			this.dialong={
				title:'编辑信息',
				show:true,
				disabled: true,
				option:'edit',
				categories: cateList,
			}
			this.formDate = {
				id: row.id,
				cate_id: row.cate_id,
				name: row.name,
				img: row.img,
				author: row.author,
				sort: row.sort,
				category: row.category,
				chapter_total: row.chapter_total,
				chapter_current: row.chapter_current,
			}
      	},
		filterType(value,item) {
			return item.cate_id == value
		},
		payTypeTag(cate_id){
			cateList.forEach((cate, index) => {
				if (cate.value == cate_id) {
					return "info"
				} else {
					return "danger"
				}
			})
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
			this.getList(); 
		},
		onScreeoutMoney(){
			this.tableData = [];
			this.setPaginations({
				page:1,
				page_size:this.paginations.page_size,
			})
			this.getList();
		}
	},
	created() {
		this.getList();
		this.initCates();
	},
	components:{
      NovelDialong,
	  NovelVipDialong
    }
}
</script>
<style scoped>
.tab-contenet{
	margin: 50px 30px;
}
.search-box {
	margin: 20px 0 0 20px;
}
</style>
