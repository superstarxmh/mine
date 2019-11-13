<template>
    <div>
        <input type="file" @change="onUpload($event)" accept=".csv, application/vnd.ms-excel"/>
        <div v-for="item in dataList">
            {{item.name}}
            <div>
                <pre style="text-align: left;width: 20%;margin: auto;">
                    {{item.content}}
                </pre>
            </div>
        </div>
    </div>
</template>

<script>
    import Papa from 'papaparse'
    import jsCharDet from 'jschardet'
    import API from '../api/index'

    export default {
        name: "file",
        data() {
            return {
                dataList: [],
                logList: []
            }
        },
        methods: {
            onUpload(e) {
                let _this = this;
                let file = e.target.files[0];
                let readerBs64 = new FileReader();
                readerBs64.readAsDataURL(file);
                readerBs64.onload = () => {
                    let encoding = this.checkEncoding(readerBs64.result);
                    let reader = new FileReader();
                    if (encoding === 'GB2312') {
                        reader.readAsText(file, 'gb2312')
                    } else {
                        reader.readAsText(file)
                    }
                    reader.onload = () => {
                        Papa.parse(reader.result, {
                            complete: function (results) {
                                let data = [];
                                results.data.filter((item, index) => item.length === 9 && index).forEach(item=>{
                                    if(item[2]){
                                        item[2] = item[2].split("(")[0];
                                        data.push(item);
                                    }
                                });
                                let temp = [], res = [], i = -1;
                                data.map(item => {
                                    let tIndex = temp.indexOf(item[2]);
                                    if (tIndex === -1) {
                                        i = i + 1;
                                        temp.push(item[2]);
                                        res[i] = [];
                                        res[i].push(item)
                                    } else {
                                        res[tIndex].push(item)
                                    }
                                });
                                console.log(res);
                                let params = [];
                                res.forEach(item => {
                                    let content = ' \n ';
                                    item.map((p, index) => {
                                        content = content + (index + 1) + '、' + p[0] + '：' + p[1] + '（' + p[4] + '%）' +
                                            ' \n '
                                    });
                                    params.push({
                                        name: item[0][2],
                                        content: content
                                    })
                                });
                                _this.dataList = params;
                                console.log(params);
                                // API.insertLog(params).then(res=>{
                                //     console.log(res);
                                // })
                            },
                        });
                    }
                }

            },

            //  识别编码
            checkEncoding(base64Str) {
                // 这种方式得到的是一种二进制串
                let str = atob(base64Str.split(';base64,')[1]);
                // 要用二进制格式
                let encoding = jsCharDet.detect(str).encoding;
                if (encoding === 'windows-1252') {
                    //有时会识别错误（如UTF8的中文二字）
                    encoding = 'ANSI'
                }
                return encoding
            },
            getContent(content,parent){

            }
        }
    }
</script>

<style scoped>

</style>
