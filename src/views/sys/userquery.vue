<template>
	<div style="margin: 20px;">
        <div>
            <Row style="margin-bottom: 25px;">
                <Col span="6">登录名：
                	<Input v-model="loginName" placeholder="请输入..." style="width:200px"></Input>
                </Col>
                <Col span="6">手机号：
                    <Input v-model="mobile" placeholder="请输入..." style="width:200px"></Input>
                </Col>
                <Col span="6" offset="1"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
            </Row>
        </div>            
    </div>
</template>
<script>
	export default {
        data () {
            return {
                loginName:null,
                mobile:null
            }
        },
        mounted(){
        	
        },
        methods:{
            search(){
                this.axios({
                  method: 'get',
                  url: '/admin/users/query',
                  params: {
                    "loginName":this.loginName,
                    "mobile":this.mobile
                  }
                }).then(function (response) {
                    console.log(response.data);
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
        }
    }
</script>