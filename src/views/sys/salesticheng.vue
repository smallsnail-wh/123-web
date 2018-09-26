<template>
    <div style="margin: 20px;">
        <div align="center" style="margin-bottom: 20px">
            <Card :bordered="false">
                <p slot="title">修改提成比例</p>
                <Form label-position="left" :label-width="120" style="width: 300px;margin-bottom: 25px;">
                    <!-- <FormItem label="门槛金额：">
                        <h5>{{reachMoney}}元</h5>
                    </FormItem> -->
                    <FormItem label="提成比例：">
                        <h5>{{proportion}}%</h5>
                    </FormItem>
                    <!-- <FormItem label="活动状态：">
                        <i-switch v-model="form" size="large" @on-change="change">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                        </i-switch>
                    </FormItem> -->
                    <FormItem>
                        <Button type="primary" @click="openModifyModal()">修改</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
        
        <div>
            <Row style="margin-bottom: 15px;">
                <Col span="8">月份：
                    <DatePicker v-model="date" type="month" placeholder="Select date"></DatePicker>
                </Col>
                <Col span="8"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
            </Row>
        </div>
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

        <Modal align="center" :mask-closable="false" :visible.sync="modifyModal" :loading = "loading" v-model="modifyModal" width="350" title="修改" @on-ok="modifyOk('info')" @on-cancel="cancel()">
             <Form ref="info" :model="info" :rules="ruleModify" :label-width="80" >
                <!-- <Form-item label="门槛金额:" prop="reachMoney">
                    <Input v-model="info.reachMoney" style="width: 204px">
                        <span slot="append">元</span>
                    </Input>
                </Form-item> -->
                <Form-item label="提成比例:" prop="proportion">
                    <Input v-model="info.proportion" style="width: 204px">
                        <span slot="append">%</span>
                    </Input>
                    
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                date:null,
                time:null,
                loading: true,
                proportion:0,
                modifyModal:false,
                info:{
                	id:null,
                    proportion:null,
                    form:null
                },
                ruleModify:{
                    proportion: [
                        { required: true, message: '输入获得比例', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ]
                },
                /*分页total属性绑定值*/
                total:0,
                /*pageInfo实体*/
                pageInfo:{
                    page:0,
                    pageSize:10
                },
                columns1: [
                    {
                        title: '用户ID',
                        key: 'userid'
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
                        title: '邀请人数',
                        key: 'invitecount'
                    },
                    {
                        title: '充值总金额',
                        key: 'rechargeMoney'
                    },
                    {
                        title: '消费总金额',
                        key: 'spentMoney'
                    },
                    {
                        title: '提成金额',
                        key: 'tichengMoney'
                    }
                ],
                /*生产类型表数据*/
                data1: []
            }
        },
        mounted(){
            this.axios({
              method: 'get',
              url: '/admin/tichengs/ticheng',
              params:{
              	'form':1
              }
            }).then(function (response) {
                this.infoSet(response.data);
                // if(this.info.form == 0){
                //     this.form = true;
                // }else if(this.info.form == 1){
                //     this.form = false;
                // }
                this.proportion = this.info.proportion;
            }.bind(this)).catch(function (error) {
              alert(error);
            });
            this.getTable({
                "pageInfo":this.pageInfo,
                "time":this.time
            });
        },
        methods:{
            /*pageInfo实体初始化*/
            initPageInfo(){
                this.pageInfo.page = 0;
                this.pageInfo.pageSize = 10;
            },
            /*搜索按钮点击事件*/
            search(){
                this.initPageInfo();
                if(this.date != null && this.date != ''){
                    this.time = this.date.getTime();
                }else{
                    this.time = null;
                }
                this.getTable({
                    "pageInfo":this.pageInfo,
                    "time":this.time
                });   
            },
            /*分页点击事件*/
            pageSearch(e){
                this.pageInfo.page = e-1;
                this.getTable({  
                    "pageInfo":this.pageInfo,
                    "time":this.time
                });
            },
            /*得到表数据*/
            getTable(e) {
                this.axios({
                  method: 'get',
                  url: 'admin/tichengs/liset/1',
                  params: {
                    'page':e.pageInfo.page,
                    'pageSize':e.pageInfo.pageSize,
                    'time':e.time
                  }
                }).then(function (response) {
                    this.data1=response.data.data;
                    this.total=response.data.totalCount;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            infoSet(e){
            	this.info.id=e.id;
            	this.info.proportion=e.proportion;
                this.info.form=e.form;
            },
           /* change(status){
                if(status){
                    this.$Message.info('开关状态：' + status);
                    this.axios({
                      method: 'put',
                      url: '/admin/activity/form',
                      params: {
                        "form": 0
                      }
                    }).then(function (response) {

                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }else{
                    this.$Message.info('开关状态：' + status);   
                    this.axios({
                      method: 'put',
                      url: '/admin/activity/form',
                      params: {
                        "form": 1
                      }
                    }).then(function (response) {

                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },*/
            openModifyModal(){
                this.modifyModal = true;
            },
            modifyOk (info) { 
                this.$refs[info].validate((valid) => {
                    if (valid) {
                        this.axios({
                          method: 'put',
                          url: '/admin/tichengs/ticheng',
                          data: this.info
                        }).then(function (response) {
                            this.proportion = response.data.proportion;
                            this.$Message.info('修改成功');
                        }.bind(this)).catch(function (error) {
                          alert(error);
                        });  
                        this.modifyModal = false;
                    }else {
                        this.$Message.error('表单验证失败!');
                        setTimeout(() => {
                            this.loading = false;
                            this.$nextTick(() => {
                                this.loading = true;
                            });
                        }, 1000);
                    }
                })
            },
        }
    }
</script>