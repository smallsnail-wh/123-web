<template>
	<div style="margin: 20px;">
        <div>
            <ul>
                <li>
                    <div style="padding: 10px 0;">
                    	<Table border :columns="columns1" :data="data1" :height="400" @on-selection-change="s=>{change(s)}"></Table>
                    </div> 
                </li>
                <li>
                    <div style="text-align: right;">
                        <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"></Page>
                    </div>  
                </li>
            </ul>
        </div>
        <!-- <Modal :mask-closable="false" :visible.sync="modal" v-model="modal" width="600" title="查看">
	        <Form :label-width="80" >
	        	<Form-item label="登录名:">
	        		<strong>{{info.name}}</strong>
                </Form-item>
                <Form-item label="email:">
	        		<strong>{{info.email}}</strong>
                </Form-item>
                <Form-item label="联系方式:">
	        		<strong>{{info.phone}}</strong>
                </Form-item>
                <Form-item label="内容:">
                	<div style="width:448px">
                		<p>{{info.content}}</p>
                	</div>
                </Form-item>
            </Form>
	        <div slot="footer">
	            <Button type="error" size="large"  @click="cancel">关闭</Button>
	        </div>
	    </Modal>	 -->
    </div>
</template>
<script>
	export default {
        data () {
            return {
                /*修改modal的显示参数*/
                modal:false,
            	/*分页total属性绑定值*/
                total:0,
                /*pageInfo实体*/
                pageInfo:{
                	page:0,
                	pageSize:10
                },
                info:{
                    name:null,
                    email:null,
                    phone:null,
                    content:null,
                    sendTime:null,
                },
            	/*表显示字段*/
            	columns1: [
                    {
                        title: '姓名',
                        width: 100,
                        key: 'name'
                    },
                    {
                        title: 'email',
                        width: 200,
                        key: 'email'
                    },
                    {
                        title: '联系方式',
                        width: 200,
                        key: 'phone'
                    },
                    {
                        title: '发送时间',
                        width: 150,
                        key: 'sendTime'
                    },
                    {
                        title: '留言',
                        key: 'content'
                    },
                ],
                /*表数据*/
                data1: []
            }
        },
        mounted(){
        	/*页面初始化调用方法*/
            this.getTable({
                "pageInfo":this.pageInfo
            });
        },
        methods:{
        	/*pageInfo实体初始化*/
        	initPageInfo(){
        		this.pageInfo.page = 0;
        		this.pageInfo.pageSize = 10;
        	},
            infoSet(e){
                this.info.name = e.name;
                this.info.email = e.email;
                this.info.phone = e.phone;
                this.info.content = e.content;
                this.info.sendTime = e.sendTime;
            },
            dateGet(e){
                var time = new Date(parseInt(e));
                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes(); 
            },
            listDateSet(e){
                for (var i = e.length - 1; i >= 0; i--) {
                    e[i].sendTime = this.dateGet(e[i].sendTime);
                }
            },
            /*得到表数据*/
            getTable(e) {
                this.axios({
                  method: 'get',
                  url: '/admin/leavemess',
                  params: {
                    'page':e.pageInfo.page,
                    'pageSize':e.pageInfo.pageSize
                  }
                }).then(function (response) {
                    this.data1=response.data.data;
                    this.listDateSet(this.data1);
                    this.total=response.data.totalCount;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            /*分页点击事件*/
            pageSearch(e){
                this.pageInfo.page = e-1;
                this.getTable({  
                    "pageInfo":this.pageInfo
                });
            },
            /*modal的cancel点击事件*/
            cancel () {
				this.modal = false;                
            },
            /*表格中双击事件*/
            dblclick(e){
                this.infoSet(e);
            	this.modal = true;
            },
            seeInfo(e){
            	this.infoSet(e);
            	this.modal = true;
            }
        }
    }
</script>