<template>
    <div>
        <Row style="background:#eee;padding:20px">
            <Col span="6">
                <Card :bordered="false">
                    <p slot="title">总发布数量</p>
                    <h3 style="text-align:center">{{count1}}个</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">月发布数量</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date2" type="month" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount2()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center;">{{count2}}个</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">日发布数量</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date3" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount3()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center">{{count3}}个</h3>
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
                count1:0,
                count2:0,
                date2:null,
                count3:0,
                date3:null,
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
                /*表显示字段*/
                columns1: [
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '广告标题',
                        key: 'title',
                    },
                    {
                        title: '红包金额',
                        key: 'money'
                    },
                    {
                        title: '剩余红包',
                        key: 'surplus'
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
                this.axios({
                  method: 'get',
                  url: '/admin/advs',
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
                /*this.axios({
                  method: 'get',
                  url: '/adv/count1'
                }).then(function (response) {
                    this.count1 = response.data;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });*/

                this.initPageInfo();
                this.getTable({
                    "type":this.type,
                    "pageInfo":this.pageInfo,
                    "time":this.time,
                });
            },
            getCount2(){
                if(this.date2 != null && this.date2 != ''){
                    /*this.axios({
                      method: 'get',
                      url: '/adv/count2',
                      params:{
                        "time":this.date2.getTime()
                      }
                    }).then(function (response) {
                        this.count2 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });*/
                    this.initPageInfo();
                    this.time = this.date2.getTime();
                    this.type = 2;
                    this.getTable({
                        "type":this.type,
                        "pageInfo":this.pageInfo,
                        "time":this.time,
                    });
                }
            },
            getCount3(){
                if(this.date3 != null && this.date3 != ''){
                    /*this.axios({
                      method: 'get',
                      url: '/adv/count3',
                      params:{
                        "time":this.date3.getTime()
                      }
                    }).then(function (response) {
                        this.count3 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });*/
                    this.initPageInfo();
                    this.time = this.date3.getTime();
                    this.type = 3;
                    this.getTable({
                        "type":this.type,
                        "pageInfo":this.pageInfo,
                        "time":this.time,
                    });
                }
            }  
        }
    }
</script>