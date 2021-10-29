const program = require('commander')
var path = './Exness_BTCUSDm_2021_09.csv';
var exportPath = './';
var time__ = 15; // 
program
    .version('0.0.1')
    .option('-t, --time [type]', 'time')
    .option('-p, --path [type]', 'path')
    .option('-xp, --exportPath [type]', 'exportPath');
program.parse(process.argv);
const options = program.opts();
if (options.time) { time__ = options.time; }
if (options.path) { path = options.path; }
if (options.exportPath) { exportPath = options.exportPath; }

// 路径处理
exportPath = exportPath.replace(/\\/gm,'/');
if(exportPath[exportPath.length-1] != '/'){
    exportPath += '/'
}
path = path.replace(/\\/gm,'/');

var use_time_start = (new Date()).getTime()
var use_time_end;

const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const csv = require('csvtojson')
const converter = csv()
    .fromFile(path)
    .then((json) => {
        toCsv(recursionData(json))
    })

var ftimer = time__*60*1000; // 汇总间隔长时间一条数据

// 递归汇总数据处理
function recursionData(data) {
    let formatData = [{}];
    let lengthnum = 0;
    let first_time =  (new Date(data[0].Timestamp.split('.')[0])).getTime();
    for(let i = 0; i < data.length; i++){
        let jgtime = first_time+(lengthnum*ftimer)
        let item = data[i]
        item.Bid *= 1
        item.Ask *= 1
        let time_ = (new Date(item.Timestamp.split('Z')[0])).getTime()
        if(jgtime <= time_ && time_ < (jgtime+ftimer)){
            let ind = parseTime(jgtime,'{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}')
            item.Timestamp = ind;
            formatData[formatData.length] = item
            // if(formatData[ind]){
            //     formatData[ind].push(item)
            // }else {
            //     formatData[ind] = [item]
            // }
        }else {
            lengthnum++
            let ind = parseTime(jgtime+ftimer,'{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}')
            item.Timestamp = ind;
            formatData.push(item)
            // if(formatData[ind]){
            //     formatData[ind].push(item)
            // }else {
            //     formatData[ind] = [item]
            // }
        }
    }
    // var r_data = []
    // for(let i in formatData){
    //     // let Bid = 0;
    //     // let Ask = 0;
    //     // for(let k=0;k<formatData[i].length;k++){
    //     //     Bid += formatData[i][k].Bid
    //     //     Ask += formatData[i][k].Ask
    //     // }
    //     // let r_item = formatData[i][0]
    //     // r_item.Bid = (Bid/formatData[i].length)
    //     // r_item.Ask = (Ask/formatData[i].length)
    //     let r_item = formatData[i][formatData[i].length-1]
    //     r_data.push(r_item)
    // }
    // return r_data
    return formatData
}

function toCsv(data) {
    let keyArr = [];
    for(let i in data) {
        keyArr.push(Object.keys(data[i]));
    }

    let keyArrSort = keyArr.sort((a, b) => {
        return b.length - a.length
    })

    let fields = keyArrSort[0];

    const json2csvParser = new Json2csvParser({ fields });

    const csv = json2csvParser.parse(data);
    let csvFileName = ((new Date()).getTime())+".csv";
    fs.writeFile(`${exportPath+csvFileName}`, csv, function(err) {
        if(err) {
            return console.log(err);
        }
        use_time_end = (new Date()).getTime()
        console.log("The file was saved!");
        console.log(`总用时：${Math.floor((use_time_end-use_time_start)/1000)}秒`);
    });
}



// 日期格式化
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }