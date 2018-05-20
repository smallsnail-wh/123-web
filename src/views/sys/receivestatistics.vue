<template>
    <div style="background:#eee;height:500px">
        <Row style="background:#eee;padding:20px">
            <Col span="6">
                <Card :bordered="false">
                    <p slot="title">总领取金额</p>
                    <h3 style="text-align:center">{{count1}}元</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">月领取金额</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date2" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount2()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center;">{{count2}}元</h3>
                </Card>
            </Col>

            <Col span="6" offset="2">
                <Card :bordered="false">
                    <p slot="title">日领取金额</p>
                    <Row style="margin-bottom: 25px;">
                        <Col span="10">
                            <DatePicker v-model="date3" type="date" placeholder="Select date"></DatePicker>
                        </Col>
                        <Col span="10" offset="4">
                            <Button type="primary" shape="circle" icon="ios-search" @click="getCount3()">搜索</Button>
                        </Col>
                    </Row>
                    <h3 style="text-align:center">{{count3}}元</h3>
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
                date3:null
            }
        },
        mounted(){
            this.getCount1();
        },
        methods:{
            getCount1(){
                this.axios({
                  method: 'get',
                  url: '/redpacket/count1'
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
                      url: '/redpacket/count2',
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
                      url: '/redpacket/count3',
                      params:{
                        "time":this.date3.getTime()
                      }
                    }).then(function (response) {
                        this.count3 = response.data;
                    }.bind(this)).catch(function (error) {
                      alert(error);
                    });
                }
            }  
        }
    }
</script>