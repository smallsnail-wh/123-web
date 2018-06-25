<template>
    <div>
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
                time:null,
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
                        title: '申请单号',
                        key: 'id'
                    },
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '手机号',
                        key: 'mobile'
                    },
                    {
                        title: '提现金额',
                        key: 'amount'
                    },
                    {
                        title: '申请时间',
                        key: 'time'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 200,
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
                                },'详情'),
                                h('Button', {
                                    attrs:{
                                        style:"margin-left:10px",
                                    },  
                                    props: {
                                        type: 'success',
                                    },
                                    on: {
                                        click: () => {
                                            this.transfer(params.row);
                                        }
                                    }
                                },'提现')
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
                "pageInfo":this.pageInfo
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
                    "type":this.type,
                    "pageInfo":this.pageInfo,
                    "time":this.time,
                });
            },
            dateGet(e){
                var time = new Date(parseInt(e));
                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes(); 
            },
            listDateSet(e){
                for (var i = e.length - 1; i >= 0; i--) {
                    e[i].time = this.dateGet(e[i].time);
                }
            },
            seeUserInfo(e){

                this.axios({
                  method: 'get',
                  url: '/admin/users/user/'+e.userid
                }).then(function (response) {
                    console.log(response.data);
                    this.userInfoSet(response.data);
                }.bind(this)).catch(function (error) {
                  alert(error);
                });

            },
            transfer(e){
                this.axios({
                  method: 'post',
                  url: '/admin/alipay/transfer',
                  data:{
                    "id": e.id,
                    "userid": e.userid,
                    "amount": e.amount,
                    "mobile": e.mobile
                  }
                }).then(function (response) {
                    console.log(response.data);
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            userInfoSet(e){
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
                  url: '/admin/transfer/list',
                  params: {
                    'page':e.pageInfo.page,
                    'pageSize':e.pageInfo.pageSize
                  }
                }).then(function (response) {
                    this.data1=response.data.data;
                    this.total=response.data.totalCount;
                    this.listDateSet(this.data1);
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            cancel () {
                this.modal = false;                
            } 
        }
    }
</script>