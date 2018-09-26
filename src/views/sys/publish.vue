<template>
    <div>
        <div style="margin: 20px;">
            <div>
                <Row style="margin-bottom: 25px;">
                    <Col span="6">用户名：
                        <Input v-model="username" placeholder="请输入..." style="width:200px"></Input>
                    </Col>
                    <Col span="6">手机号：
                        <Input v-model="mobile" placeholder="请输入..." style="width:200px"></Input>
                    </Col>
                    <Col span="6">广告ID：
                        <Input v-model="advid" placeholder="请输入..." style="width:200px"></Input>
                    </Col>
                    <Col span="6"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
                </Row>
            </div>
            <div style="margin-bottom: 20px;">
                查询已下架：
                <i-switch v-model="flag" @on-change="switchChange()">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </div>
            <ul>
                <li v-if="!flag">
                    <Button type="success" icon="wrench" @click="modify()">置顶</Button>
                    <Button type="error" icon="trash-a" @click="cancelModify()">取消置顶</Button>
                    <Button type="warning" icon="ios-close" @click="del()">下架</Button>
                </li>
                <li>
                    <div style="padding: 10px 0;">
                        <Table border :columns="columns1" :data="data1" :height="400" @on-selection-change="s=>{change(s)}" ></Table>
                    </div> 
                </li>
                <li>
                    <div style="text-align: right;">
                        <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"></Page>
                    </div>  
                </li>
            </ul>
        </div>

        <Modal :mask-closable="false" :visible.sync="modal" v-model="modal" width="600" title="查看">
            <Form :label-width="80" >
                <Row>
                    <Col span="12">
                        <Form-item label="用户名:">
                            <strong>{{info.username}}</strong>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="发布形式:">
                            <span>{{info.form}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="手机号:">
                            <span>{{info.mobile}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="微信:">
                            <span>{{info.weixinid}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="红包金额:">
                            <span>{{info.money}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="红包数量:">
                            <span>{{info.total}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="红包剩余:">
                            <span>{{info.surplus}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="发布时间:">
                            <span>{{info.time}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="广告标题:">
                            <span>{{info.title}}</span>
                        </Form-item>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="error" size="large"  @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                flag:false,
                count:null,
                groupId:null,
                username:null,
                mobile:null,
                advid:null,
                modal:false,
                type:1,
                time:null,
                total:0,
                /*pageInfo实体*/
                pageInfo:{
                    page:0,
                    pageSize:10
                },
                info:{
                    username:'',
                    mobile:'',
                    weixinid:'',
                    form:'',
                    money:'',
                    total:'',
                    surplus:'',
                    title:'',
                    time:'',
                },
                infoModify:{
                    id:'',
                    top:''
                },
                /*表显示字段*/
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title:'广告ID',
                        key: 'id',
                        width:100
                    },
                    {
                        title: '用户名',
                        key: 'username',
                        width:120
                    },
                    {
                        title: '广告标题',
                        key: 'title',
                    },
                    {
                        title: '红包金额',
                        key: 'money',
                        width: 100,
                        render: (h, params) => {
                            if(params.row.money < 0.01){
                               return h('div', [
                                    h('span', {
                                        
                                    },'0')
                                ]); 
                           }else{
                                return h('div', [
                                    h('span', {
                                        
                                    },params.row.money)
                                ]); 
                           }
                            
                        }
                    },
                    {
                        title: '剩余红包',
                        key: 'surplus',
                        width: 100
                    },
                    {
                        title: '置顶',
                        key: 'top',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if(params.row.top == 0){
                               return h('div', [
                                    h('strong', {
                                        style:{
                                            color:'blue'
                                        }
                                    },'未置顶')
                                ]); 
                           }else if(params.row.top == 1){
                                return h('div', [
                                    h('strong', {
                                        style:{
                                            color: 'red'
                                        }
                                    },'置顶')
                                ]); 
                           }
                            
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                    },
                                    on: {
                                        click: () => {
                                            this.seeInfo(params.row);
                                        }
                                    }
                                },'查看')
                            ]);
                        }
                    },
                ],
                /*表数据*/
                data1: [],
            }
        },
        mounted(){
            this.getTable({
                "pageInfo":this.pageInfo,
                "username":this.username,
                "mobile":this.mobile,
                "advid":this.advid
            });
        },
        methods:{
            initPageInfo(){
                this.pageInfo.page = 0;
                this.pageInfo.pageSize = 10;
            },
            /*分页点击事件*/
            pageSearch(e){
                this.pageInfo.page = e-1;
                this.getTable({  
                    "pageInfo":this.pageInfo,
                    "username":this.username,
                    "mobile":this.mobile,
                    "advid":this.advid
                });
            },
            dateGet(e){
                var time = new Date(parseInt(e));
                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes(); 
            },
            seeInfo(e){
                this.modal = true;

                this.info.username = e.username;
                if(e.mobile != null && e.mobile != ''){
                    this.info.mobile = e.mobile;
                }else{
                    this.info.mobile = '未绑定手机';
                }
                if(e.weixinid != null && e.weixinid != ''){
                    this.info.weixinid = '绑定了微信';
                }else{
                    this.info.weixinid = '未绑定微信';
                }
                this.info.title = e.title;
                this.info.money = e.money;
                this.info.time = this.dateGet(e.time);
                if(e.form == 0){
                    this.info.form = 'url形式发布';
                }else if(e.form == 1){
                    this.info.form = '常规发布';
                }else if(e.form == 2){
                    this.info.form = '视频发布';
                }
                this.info.total = e.total;
                this.info.surplus = e.surplus;
            },
            /*得到表数据*/
            getTable(e) {
                if(!this.flag){
                    this.axios({
                      method: 'get',
                      url: '/admin/publish/advs',
                      params: {
                        'page':e.pageInfo.page,
                        'pageSize':e.pageInfo.pageSize,
                        'username':e.username,
                        'mobile':e.mobile,
                        'advid':e.advid
                        
                      }
                    }).then(function (response) {
                        this.data1=response.data.data;
                        this.total=response.data.totalCount;
                        this.groupId = null;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }else{
                    this.axios({
                      method: 'get',
                      url: '/admin/uppublish/advs',
                      params: {
                        'page':e.pageInfo.page,
                        'pageSize':e.pageInfo.pageSize,
                        'username':e.username,
                        'mobile':e.mobile,
                        'advid':e.advid
                        
                      }
                    }).then(function (response) {
                        this.data1=response.data.data;
                        this.total=response.data.totalCount;
                        this.groupId = null;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
                
            },
            /*搜索按钮点击事件*/
            search(){
                this.initPageInfo();
                this.getTable({
                    "pageInfo":this.pageInfo,
                    "username":this.username,
                    "mobile":this.mobile,
                    "advid":this.advid
                });   
            },
            cancel () {
                this.modal = false;                
            }, 
            /*table选择后触发事件*/
            change(e){
                if(e.length==1){
                    this.infoModify.id = e['0'].id;
                    this.infoModify.top = e['0'].top;
                }
                this.setGroupId(e);             
            },
            /*通过选中的行设置groupId的值*/
            setGroupId(e){
                this.groupId=[];
                this.count=e.length;
                for (var i = 0; i <= e.length - 1; i++) {
                    this.groupId.push(e[i].id);
                }
            },
            /*置顶*/
            modify(){
                if(this.count > 1 || this.count < 1){
                    this.modifyModal= false; 
                    this.$Message.warning('请至少选择一项(且只能选择一项)');  
                }else{
                    if(this.infoModify.top == 1){
                        this.$Message.info('已经置顶');
                        return;
                    }
                    this.infoModify.top = 1;
                    this.axios({
                      method: 'put',
                      url: '/admin/publish/advs/top',
                      data: this.infoModify
                    }).then(function (response) {
                        this.$Message.info('置顶成功');
                        this.getTable({
                            "pageInfo":this.pageInfo,
                            "username":this.username,
                            "mobile":this.mobile,
                            "advid":this.advid
                        });
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },
            /*取消置顶*/
            cancelModify(){
                if(this.count > 1 || this.count < 1){
                    this.modifyModal= false; 
                    this.$Message.warning('请至少选择一项(且只能选择一项)');  
                }else{
                    if(this.infoModify.top == 0){
                        this.$Message.info('已经是未置顶');
                        return;
                    }
                    this.infoModify.top = 0;
                    this.axios({
                      method: 'put',
                      url: '/admin/publish/advs/top',
                      data: this.infoModify 
                    }).then(function (response) {
                        this.$Message.info('已取消置顶');
                        this.getTable({
                            "pageInfo":this.pageInfo,
                            "username":this.username,
                            "mobile":this.mobile,
                            "advid":this.advid
                        });
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },
            del(){
                if(this.groupId!=null && this.groupId!=""){
                    this.axios({
                      method: 'delete',
                      url: '/admin/publish/advs',
                      data: this.groupId
                    }).then(function (response) {
                        this.getTable({
                            "pageInfo":this.pageInfo,
                            "username":this.username,
                            "mobile":this.mobile,
                            "advid":this.advid
                        });
                        this.groupId=null;
                        this.count=0;
                        this.$Message.info('删除成功');
                    }.bind(this)).catch(function (error) {
                        alert(error);
                    });
                }
            },
            switchChange(){
                this.getTable({
                    "pageInfo":this.pageInfo,
                    "username":this.username,
                    "mobile":this.mobile,
                    "advid":this.advid
            });
            },
        }
    }
</script>