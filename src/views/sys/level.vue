<template>
	<div style="margin: 20px;">
        <!-- <div>
            <Row style="margin-bottom: 25px;">
                <Col span="8">菜单名称：
                    <Select v-model="menuId" filterable clearable style="width: 200px">
                        <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="8"><Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button></Col>
            </Row>
        </div> -->            
        <div>
            <ul>
                <li>
                    <Button type="primary" icon="plus-round" @click="openNewModal()">新建</Button>
                    <Button type="success" icon="wrench" @click="openModifyModal()">修改</Button>
                    <Button type="error" icon="trash-a" @click="del()">删除</Button>
                </li>
                <li>
                    <div style="padding: 10px 0;">
                    	<Table border :columns="columns1" :data="data1" :height="400" @on-selection-change="s=>{change(s)}" @on-row-dblclick="s=>{dblclick(s)}"></Table>
                    </div> 
                </li>
                <li>
                    <div style="text-align: right;">
                        <Page :total="total" :page-size="pageInfo.pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"></Page>
                    </div>  
                </li>
            </ul>
        </div>
        <!--添加modal-->  
        <Modal :mask-closable="false" :visible.sync="newModal" :loading = "loading" v-model="newModal" width="600" title="新建" @on-ok="newOk('levelNew')" @on-cancel="cancel()">
            <Form ref="levelNew" :model="levelNew" :rules="ruleNew" :label-width="80" >
                <Row>
                    <Col span="12">
                        <Form-item label="会员等级:" prop="name">
                            <Input v-model="levelNew.name" style="width: 204px"/>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="排序:" prop="sort">
                            <Input v-model="levelNew.sort" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="要求最低人数:" prop="min">
                            <Input v-model="levelNew.min" style="width: 204px"/>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="要求最高人数:" prop="max">
                            <Input v-model="levelNew.max" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="每日观看次数:" prop="vtimes">
                            <Input v-model="levelNew.vtimes" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Form-item label="升级条件:" prop="condition">
                     <Input v-model="levelNew.condition" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </Form-item>
            </Form>
        </Modal>
        <!--修改modal-->  
        <Modal :mask-closable="false" :visible.sync="modifyModal" :loading = "loading" v-model="modifyModal" width="600" title="修改" @on-ok="modifyOk('levelModify')" @on-cancel="cancel()">
            <Form ref="levelModify" :model="levelModify" :rules="ruleModify" :label-width="80" >
                <Row>
                    <Col span="12">
                        <Form-item label="会员等级:" prop="name">
                            <Input v-model="levelModify.name" style="width: 204px"/>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="排序:" prop="sort">
                            <Input v-model="levelModify.sort" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="要求最低人数:" prop="min">
                            <Input v-model="levelModify.min" style="width: 204px"/>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item label="要求最高人数:" prop="max">
                            <Input v-model="levelModify.max" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form-item label="每日观看次数:" prop="vtimes">
                            <Input v-model="levelModify.vtimes" style="width: 204px"/>
                        </Form-item>
                    </Col>
                </Row>
                <Form-item label="升级条件:" prop="condition">
                     <Input v-model="levelModify.condition" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
	export default {
        data () {
            return {
                /*用于查找的菜单id*/
                menuId:null,
            	/*选择的数量*/
                count:null,
            	/*选中的组数据*/
                groupId:null,
            	/*新建modal的显示参数*/
                newModal:false,
                /*修改modal的显示参数*/
                modifyModal:false,
            	/*分页total属性绑定值*/
                total:0,
                /*loading*/
                loading: true,
                /*pageInfo实体*/
                pageInfo:{
                	page:0,
                	pageSize:10
                },
                /*menu实体*/
                level:{                             
                    id:null,
                    name:null,
                    condition:null,
                    vtimes:null,
                    sort:null,
                    min:null,
                    max:null
                },
                /*用于添加的menu实体*/
                levelNew:{
                	id:null,
                    name:null,
                    condition:null,
                    vtimes:null,
                    sort:null,
                    min:null,
                    max:null
                },
                /*用于修改的menu实体*/
                levelModify:{
                	id:null,
                    name:null,
                    condition:null,
                    vtimes:null,
                    sort:null,
                    min:null,
                    max:null
                },
                /*新建验证*/
                ruleNew:{
                    name: [
                        { type:'string',required: true, message: '会员等级', trigger: 'blur' }
                    ],
                    condition: [
                        { type:'string',required: true, message: '升级条件', trigger: 'blur' }
                    ],
                    vtimes: [
                        { required: true, message: '输入每日观看次数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    sort: [
                        { required: true, message: '输入排序', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    min: [
                        { required: true, message: '输入要求最低人数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    max: [
                        { required: true, message: '输入要求最高人数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                },
                /*修改验证*/
                ruleModify:{
                    name: [
                        { type:'string',required: true, message: '会员等级', trigger: 'blur' }
                    ],
                    condition: [
                        { type:'string',required: true, message: '升级条件', trigger: 'blur' }
                    ],
                    vtimes: [
                        { required: true, message: '输入每日观看次数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    sort: [
                        { required: true, message: '输入排序', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    min: [
                        { required: true, message: '输入要求最低人数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                    max: [
                        { required: true, message: '输入要求最高人数', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (!Number.isInteger(+value)) {
                                callback(new Error('请输入数字'));
                            } else {
                                callback();
                            }
                          
                        }, trigger: 'blur'}
                    ],
                },
                /*菜单列表*/
                menuList:[],
            	/*生产类型表显示字段*/
            	columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '会员等级',
                        key: 'name'
                    },
                    {
                        title: '升级条件',
                        key: 'condition'
                    },
                    {
                        title: '每日观看次数',
                        key: 'vtimes'
                    },
                    {
                        title: '排序',
                        key: 'sort'
                    },
                    {
                        title: '要求最低人数',
                        key: 'min'
                    },
                    {
                        title: '要求最高人数',
                        key: 'max'
                    }
                ],
                /*生产类型表数据*/
                data1: []
            }
        },
        mounted(){
        	/*页面初始化调用方法*/
            this.getTable({
                "pageInfo":this.pageInfo
            });
            /*this.axios({
              method: 'get',
              url: '/menus/parentId',
              params: {
                'parentId': 0 
              }
            }).then(function (response) {
                var listTemp = response.data;
                for (var i = 0; i < listTemp.length; i++) {
                    this.menuList.push({
                        "value": listTemp[i].id,
                        "label": listTemp[i].name
                    });
                }
            }.bind(this)).catch(function (error) {
              alert(error);
            });*/
        },
        methods:{
        	/*pageInfo实体初始化*/
        	initPageInfo(){
        		this.pageInfo.page = 0;
        		this.pageInfo.pageSize = 10;
        	},
            /*menu实体初始化*/
            initMenu(){
                this.level.id = null;
                this.level.name = null;
                this.level.condition = null;
                this.level.vtimes = null;
                this.level.sort = null;
                this.level.min = null;
                this.level.max = null;
            },
            /*menuNew实体初始化*/
            initMenuNew(){
                this.levelNew.id = null;
                this.levelNew.name = null;
                this.levelNew.condition = null;
                this.levelNew.vtimes = null;
                this.levelNew.sort = null;
                this.levelNew.min = null;
                this.levelNew.max = null;
            },
            /*menuModify实体初始化*/
            initMenuModify(){
                this.levelModify.id = null;
                this.levelModify.name = null;
                this.levelModify.condition = null;
                this.levelModify.vtimes = null;
                this.levelModify.sort = null;
                this.levelModify.min = null;
                this.levelModify.max = null;
            },
            /*menuNew设置*/
            menuSet(e){
                this.level.id = e.id;
                this.level.name = e.name;
                this.level.condition = e.condition;
                this.level.vtimes = e.vtimes;
                this.level.sort = e.sort;
                this.level.min = e.min;
                this.level.max = e.max;
            },
            /*menuNew设置*/
            menuNewSet(e){
                this.levelNew.id = e.id;
                this.levelNew.name = e.name;
                this.levelNew.condition = e.condition;
                this.levelNew.vtimes = e.vtimes;
                this.levelNew.sort = e.sort;
                this.levelNew.min = e.min;
                this.levelNew.max = e.max;
            },
            /*menuModify设置*/
            menuModifySet(e){
                this.levelModify.id = e.id;
                this.levelModify.name = e.name;
                this.levelModify.condition = e.condition;
                this.levelModify.vtimes = e.vtimes;
                this.levelModify.sort = e.sort;
                this.levelModify.min = e.min;
                this.levelModify.max = e.max;
            },
            /*得到表数据*/
            getTable(e) {
                this.axios({
                  method: 'get',
                  url: '/admin/leves',
                  params: {
                    'page':e.pageInfo.page,
                    'pageSize':e.pageInfo.pageSize
                  }
                }).then(function (response) {
                    this.data1=response.data.data;
                    this.total=response.data.totalCount;
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            /*搜索按钮点击事件*/
            search(){
                this.initPageInfo();
                this.getTable({
                    "pageInfo":this.pageInfo
                });   
            },
            /*分页点击事件*/
            pageSearch(e){
                this.pageInfo.page = e-1;
                this.getTable({  
                    "pageInfo":this.pageInfo
                });
            },
            /*新建点击触发事件*/
            openNewModal(){
                this.newModal = true;
                this.initMenuNew();
                this.data1.sort();
                this.count = 0;
                this.groupId = null;
            },
            /*新建modal的newOk点击事件*/
            newOk (levelNew) { 
                this.$refs[levelNew].validate((valid) => {
                    if (valid) {
                        this.initMenu();
                        this.menuSet(this.levelNew);
                        this.axios({
                            method: 'post',
                            url: '/admin/leves/level',
                            data: this.level
                        }).then(function (response) {
                            this.initMenuNew();
                            this.getTable({
                                "pageInfo":this.pageInfo
                            });
                            this.$Message.info('新建成功');
                        }.bind(this)).catch(function (error) {
                            alert(error);
                        });  
                        this.newModal = false;
                    }else {
                        setTimeout(() => {
                            this.loading = false;
                            this.$nextTick(() => {
                                this.loading = true;
                            });
                        }, 1000);
                    }
                })
            },
            /*点击修改时判断是否只选择一个*/
            openModifyModal(){
                if(this.count > 1 || this.count < 1){
                    this.modifyModal= false; 
                    this.$Message.warning('请至少选择一项(且只能选择一项)');  
                }else{
                    this.modifyModal = true;
                }
            },
            /*修改modal的modifyOk点击事件*/
             modifyOk (levelModify) { 
                this.$refs[levelModify].validate((valid) => {
                    if (valid) {
                        this.initMenu();
                        this.menuSet(this.levelModify);
                        this.axios({
                          method: 'put',
                          url: '/admin/leves/level',
                          data: this.level
                        }).then(function (response) {
                            this.initMenuNew();
                            this.getTable({
                                "pageInfo":this.pageInfo
                            });
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
            /*modal的cancel点击事件*/
            cancel () {
                this.$Message.info('点击了取消');
            },
            /*table选择后触发事件*/
            change(e){
                if(e.length==1){
                    this.menuModifySet(e['0']);
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
            /*删除table中选中的数据*/
            del(){
                if(this.groupId!=null && this.groupId!=""){
                    this.axios({
                      method: 'delete',
                      url: '/admin/leves',
                      data: this.groupId
                    }).then(function (response) {
                        this.getTable({
                            "pageInfo":this.pageInfo
                        });
                        this.groupId=null;
                        this.count=0;
                        this.$Message.info('删除成功');
                    }.bind(this)).catch(function (error) {
                        alert(error);
                    });
                }
            },
            /*表格中双击事件*/
            dblclick(e){
                this.menuModifySet(e);
                this.modifyModal = true;
                this.data1.sort();
            }
        }
    }
</script>