<template>
	<div style="margin: 20px;">
        <div>
            <ul>
                <li>
                    <Button type="primary" icon="plus-round" @click="openNewModal()">新建</Button>
                    <Button type="success" icon="wrench" @click="openModifyModal()">修改</Button>
                    <Button type="error" icon="trash-a" @click="del()">删除</Button>
                </li>
                <li>
                    <div style="padding: 10px 0;">
                    	<Table border :columns="columns1" :data="data1" @on-selection-change="s=>{change(s)}" @on-row-dblclick="s=>{dblclick(s)}"></Table>
                    </div> 
                </li>
            </ul>
        </div>
        <!--添加modal-->  
        <Modal :mask-closable="false" :visible.sync="newModal" :loading = "loading" v-model="newModal" width="600" title="新建" @on-ok="newOk('entityNew')" @on-cancel="cancel()">
            <Form ref="entityNew" :model="entityNew" :rules="ruleNew" :label-width="80" >
                <Form-item label="广告ID:" prop="advid">
                    <Input v-model="entityNew.advid" style="width: 204px"/>
                </Form-item>
                <Form-item label="" prop="imageurl">
                    <Upload 
                        ref="upload"
                        action="/weiguang/banner/upload/picture"
                        name="picture"
                        :show-upload-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleSuccess1"
                        :on-format-error="handleFormatError"
                        :format="['jpg','jpeg','png']">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </Form-item>
                <Form-item>
                    <img v-if="entityNew.imageurl != null" :src="entityNew.imageurl" style="width: 300px;height: 200px">
                </Form-item>
            </Form>
        </Modal>
        <!--修改modal-->  
        <Modal :mask-closable="false" :visible.sync="modifyModal" :loading = "loading" v-model="modifyModal" width="600" title="修改" @on-ok="modifyOk('entityModify')" @on-cancel="cancel()">
            <Form ref="entityModify" :model="entityModify" :rules="ruleModify" :label-width="80" >
                <Form-item label="广告ID:" prop="advid">
                    <Input v-model="entityModify.advid" style="width: 204px"/>
                </Form-item>
                <Form-item label="" prop="imageurl">
                    <Upload 
                        ref="upload"
                        action="/weiguang/banner/upload/picture"
                        name="picture"
                        :show-upload-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleSuccess2"
                        :on-format-error="handleFormatError"
                        :format="['jpg','jpeg','png']">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </Form-item>
                <Form-item>
                    <img v-if="entityModify.imageurl != null" :src="entityModify.imageurl" style="width: 300px;height: 200px">
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
	export default {
        data () {
            return {
                imageurl:'',
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
                /*entity实体*/
                entity:{                             
                    id:null,
                    advid:null,
                    imageurl:null,
                    time:null
                },
                /*用于添加的entity实体*/
                entityNew:{
                	id:null,
                    advid:null,
                    imageurl:null,
                    time:null
                },
                /*用于修改的entity实体*/
                entityModify:{
                	id:null,
                    advid:null,
                    imageurl:null,
                    time:null
                },
                /*新建验证*/
                ruleNew:{
                    advid: [
                        { type:'string',required: true, message: '输入广告ID', trigger: 'blur' }
                    ],
                    imageurl: [
                        { type:'string',required: true, message: '上传图片', trigger: 'blur' }
                    ]
                },
                /*修改验证*/
                ruleModify:{
                    advid: [
                        { type:'string',required: true, message: '输入广告ID', trigger: 'blur' }
                    ],
                    imageurl: [
                        { type:'string',required: true, message: '上传图片', trigger: 'blur' }
                    ]
                },
                /*菜单列表*/
                entityList:[],
            	/*生产类型表显示字段*/
            	columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '轮播ID',
                        key: 'id'
                    },
                    {
                        title: '广告ID',
                        key: 'advid'
                    },
                    {
                        title: '图片',
                        key: 'imageurl',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.imageurl
                                    },
                                    style:{
                                        width:'200px',
                                        height:'100px'
                                    },
                                })
                            ]);
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'time'
                    }
                ],
                /*生产类型表数据*/
                data1: []
            }
        },
        mounted(){
        	/*页面初始化调用方法*/
            this.getTable();
        },
        methods:{
            /*entity实体初始化*/
            initentity(){
                this.entity.id = null;
                this.entity.advid = null;
                this.entity.imageurl = null;
                this.entity.time = null;
            },
            /*entityNew实体初始化*/
            initentityNew(){
                this.entityNew.id = null;
                this.entityNew.advid = null;
                this.entityNew.imageurl = null;
                this.entityNew.time = null;
            },
            /*entityModify实体初始化*/
            initentityModify(){
                this.entityModify.id = null;
                this.entityModify.advid = null;
                this.entityModify.imageurl = null;
                this.entityModify.time = null;
            },
            /*entityNew设置*/
            entitySet(e){
                this.entity.id = e.id;
                this.entity.advid = e.advid;
                this.entity.imageurl = e.imageurl;
            },
            /*entityNew设置*/
            entityNewSet(e){
                this.entityNew.id = e.id;
                this.entityNew.advid = e.advid;
                this.entityNew.imageurl = e.imageurl;
            },
            /*entityModify设置*/
            entityModifySet(e){
                console.log(e);
                this.entityModify.id = e.id;
                this.entityModify.advid = e.advid+'';
                this.entityModify.imageurl = e.imageurl;
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
            /*得到表数据*/
            getTable(e) {
                this.axios({
                  method: 'get',
                  url: '/public/banners'
                }).then(function (response) {
                    this.data1=response.data;
                    console.log(this.data1);
                    this.listDateSet(this.data1);
                }.bind(this)).catch(function (error) {
                  alert(error);
                });
            },
            /*新建点击触发事件*/
            openNewModal(){
                this.newModal = true;
                this.initentityNew();
                this.data1.sort();
                this.count = 0;
                this.groupId = null;
            },
            /*新建modal的newOk点击事件*/
            newOk (entityNew) { 
                this.$refs[entityNew].validate((valid) => {
                    if (valid) {
                        this.initentity();
                        this.entitySet(this.entityNew);
                        this.axios({
                            method: 'post',
                            url: '/admin/banners/banner',
                            data: this.entity
                        }).then(function (response) {
                            this.initentityNew();
                            this.getTable();
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
             modifyOk (entityModify) { 
                this.$refs[entityModify].validate((valid) => {
                    if (valid) {
                        this.initentity();
                        this.entitySet(this.entityModify);
                        this.axios({
                          method: 'put',
                          url: '/admin/banners/banner',
                          data: this.entity
                        }).then(function (response) {
                            this.initentityNew();
                            this.getTable();
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
                    this.entityModifySet(e['0']);
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
                      url: '/admin/banners',
                      data: this.groupId
                    }).then(function (response) {
                        this.getTable();
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
                this.entityModifySet(e);
                this.modifyModal = true;
                this.data1.sort();
            },
            handleSuccess1 (res, file) {
                this.entityNew.imageurl = res.url;
                file.url = res.url;
                file.name = res.url;
            },
            handleSuccess2 (res, file) {
                this.entityModify.imageurl = res.url;
                file.url = res.url;
                file.name = res.url;
            },
            handleBeforeUpload () {
                this.$refs.upload.fileList.splice(0, this.$refs.upload.fileList.length);
                return true;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式不对',
                    desc: '图片格式只能为jpg,jpeg,png'
                });
            },
        }
    }
</script>