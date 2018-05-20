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

        <Row style="background:#eee;padding:20px">
            <Col span="6">
                <Card :bordered="false">
                    <p slot="title">月活跃率</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date4" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount4()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center">{{count4}}人</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">日活跃率</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date5" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount5()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center">{{count5}}人</h3>
                </Card>
            </Col>
        </Row>
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
                count4:0,
                date4:null,
                count5:0,
                date5:null,
            }
        },
        mounted(){
            this.getCount1();
        },
        methods:{
            getCount1(){
                this.axios({
                  method: 'get',
                  url: '/users/count1'
                }).then(function (response) {
                    this.count1 = response.data;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            getCount2(){
                if(this.date2 != null && this.date2 != ''){
                    this.axios({
                      method: 'get',
                      url: '/users/count2',
                      params:{
                        "time":this.date2.getTime()
                      }
                    }).then(function (response) {
                        this.count2 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },
            getCount3(){
                if(this.date3 != null && this.date3 != ''){
                    this.axios({
                      method: 'get',
                      url: '/users/count3',
                      params:{
                        "time":this.date3.getTime()
                      }
                    }).then(function (response) {
                        this.count3 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },
            getCount4(){
                if(this.date4 != null && this.date4 != ''){
                    this.axios({
                      method: 'get',
                      url: '/users/count4',
                      params:{
                        "time":this.date4.getTime()
                      }
                    }).then(function (response) {
                        this.count4 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            },
            getCount5(){
                if(this.date5 != null && this.date5 != ''){
                    this.axios({
                      method: 'get',
                      url: '/users/count5',
                      params:{
                        "time":this.date5.getTime()
                      }
                    }).then(function (response) {
                        this.count5 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            }   
        }
    }
</script>