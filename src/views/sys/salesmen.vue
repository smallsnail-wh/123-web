<template>
    <div>
        <Row style="background:#eee;padding:20px">
            <Col span="6">
                <Card :bordered="false">
                    <p slot="title">用户总量</p>
                    <h3 style="text-align:center">{{count1}}人</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">月新增</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date2" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount2()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center;">{{count2}}人</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">日新增</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date3" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount3()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center">{{count3}}人</h3>
                </Card>
            </Col>
        </Row>
        <div style="margin: 20px;">
            <ul>
                <li>
                    <div style="padding: 10px 0;">
                        <Table border :columns="columns1" :data="data1" :height="400" ></Table>
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
                            <strong>{{userInfo.name}}</strong>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="账户余额:">
                            <span>{{userInfo.money}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="手机号:">
                            <span>{{userInfo.mobile}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="微信:">
                            <span>{{userInfo.weixinId}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="用户等级:">
                            <span>{{userInfo.level}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="邀请人数:">
                            <span>{{userInfo.invitationNumber}}</span>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="用户类型:">
                            <span>{{userInfo.customerType}}</span>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="注册时间:">
                            <span>{{userInfo.createTime}}</span>
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
                modal:false,
                type:1,
                time:null,
                count1:0,
                count2:0,
                date2:null,
                count3:0,
                date3:null,
                total:0,
                /*pageInfo实体*/
                pageInfo:{
                    page:0,
                    pageSize:10
                },
                userInfo:{
                    name:'',
                    mobile:'',
                    money:'',
                    createTime:'',
                    weixinId:'',
                    invitationNumber:'',
                    customerType:'',
                    level:'',
                },
                /*表显示字段*/
                columns1: [
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '账号余额',
                        key: 'money'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                    },
                                    on: {
                                        click: () => {
                                            this.seeUserInfo(params.row);
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
            this.getCount1();
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
                    "type":this.type,
                    "pageInfo":this.pageInfo,
                    "time":this.time,
                });
            },
            dateGet(e){
                var time = new Date(parseInt(e));
                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes(); 
            },
            seeUserInfo(e){
                this.modal = true;

                this.userInfo.name = e.name;
                if(e.mobile != null && e.mobile != ''){
                    this.userInfo.mobile = e.mobile;
                }else{
                    this.userInfo.mobile = '未绑定手机';
                }
                this.userInfo.money = e.money;
                this.userInfo.createTime = this.dateGet(e.createTime);
                if(e.weixinId != null && e.weixinId != ''){
                    this.userInfo.weixinId = '绑定了微信';
                }else{
                    this.userInfo.weixinId = '未绑定微信';
                }
                this.userInfo.level = e.level;

                this.userInfo.invitationNumber = e.userDetailEntity.invitationNumber;
                if(e.userDetailEntity.customerType == 0){
                    this.userInfo.customerType = '普通用户';
                }else if(e.userDetailEntity.customerType == 1){
                    this.userInfo.customerType = '全职销售员';
                }else if(e.userDetailEntity.customerType == 2){
                    this.userInfo.customerType = '发布用户';
                }else if(e.userDetailEntity.customerType == 3){
                    this.userInfo.customerType = '系统管理员';
                }
                
            },
            /*得到表数据*/
            getTable(e) {
                this.axios({
                  method: 'get',
                  url: '/admin/salesmen',
                  params: {
                    'page':e.pageInfo.page,
                    'pageSize':e.pageInfo.pageSize,
                    'type':e.type,
                    'time':e.time
                  }
                }).then(function (response) {
                    this.data1=response.data.data;
                    this.total=response.data.totalCount;
                    if(e.type == 1){
                        this.count1 = this.total;
                    }else if(e.type == 2){
                        this.count2 = this.total;
                    }else if(e.type == 3){
                        this.count3 = this.total;
                    }
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            cancel () {
                this.modal = false;                
            },      
            getCount1(){
                this.initPageInfo();
                this.getTable({
                    "type":this.type,
                    "pageInfo":this.pageInfo,
                    "time":this.time,
                });
                /*this.axios({
                  method: 'get',
                  url: '/users/publishers/count1'
                }).then(function (response) {
                    this.count1 = response.data;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });*/
            },
            getCount2(){
                if(this.date2 != null && this.date2 != ''){
                    this.initPageInfo();
                    this.time = this.date2.getTime();
                    this.type = 2;
                    this.getTable({
                        "type":this.type,
                        "pageInfo":this.pageInfo,
                        "time":this.time,
                    });
                    /*this.axios({
                      method: 'get',
                      url: '/users/publishers/count2',
                      params:{
                        "time":this.date2.getTime()
                      }
                    }).then(function (response) {
                        this.count2 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });*/
                }
            },
            getCount3(){
                if(this.date3 != null && this.date3 != ''){
                    this.initPageInfo();
                    this.time = this.date3.getTime();
                    this.type = 3;
                    this.getTable({
                        "type":this.type,
                        "pageInfo":this.pageInfo,
                        "time":this.time,
                    });
                    /*this.axios({
                      method: 'get',
                      url: '/users/publishers/count3',
                      params:{
                        "time":this.date3.getTime()
                      }
                    }).then(function (response) {
                        this.count3 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });*/
                }
            }   
        }
    }
</script>