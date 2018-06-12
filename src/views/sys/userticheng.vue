<template>
    <div align="center" style="margin: 20px;">
        <Form label-position="left" :label-width="120" style="width: 300px">
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
            }
        },
        mounted(){
            this.axios({
              method: 'get',
              url: '/admin/tichengs/ticheng',
              params:{
              	'form':0
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
        },
        methods:{
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