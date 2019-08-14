/**
 * Created by dell on 2019-07-31.
 */
/*
 * jQuery语法  $(selector).action()
 */
var utils = require("./public/js/utils");

window.$ = window.jQuery = require('./public/js/jquery.min.js');

//参数
var revCount = 0;
var revCountTemp = 0;
var rateArray = [9600, 14400, 19200, 38400, 56000, 115200, 256000];
//var parityArray = ['none','even','mark','odd','space'];
//var dataBitsArray = [5, 6, 7, 8];
var serialData = '';
var serialHexData = new Array();
var serialHexDataToDis = '';
var sendData = '';
var sendHexData = new Array();
var timerRev;

function wrapEvent() {
    if(port.isOpen == true) {
        if(revCount > 0) {
            //console.log('revCountTemp',revCountTemp)
            //console.log('revCount',revCount)
            if(revCountTemp == revCount) {
                revCountTemp = revCount = 0;

                //ascii显示
                if($("#optionsRevStrDisplay").is(":checked") == true){
                    //console.log('optionsRevStrDisplay',$("#optionsRevStrDisplay").is(":checked"))
                    $('.receive-windows').append(serialData.toString());
                    serialData = '';
                }
                //hex显示
                if($("#optionsRevHexDisplay").is(":checked") == true){

                    console.log('serialHexData',serialHexData)
                    for(i=0; i<serialHexData.length; i++){
                        //console.log(serialHexData[i]<16?"0x0"+serialHexData[i].toString('hex').toUpperCase():"0x"+serialHexData[i].toString('hex').toUpperCase())
                        //console.log(serialHexData[i]<16? serialHexData[i].toString('hex').toUpperCase(): serialHexData[i].toString('hex').toUpperCase())
                        serialHexDataToDis += (serialHexData[i]<16? serialHexData[i].toString('hex').toUpperCase(): serialHexData[i].toString('hex').toUpperCase()) + ' '
                    }
                    $('.receive-windows').append(serialHexDataToDis);

                    serialHexDataToDis = '';
                    serialHexData = [];
                }

                //自动换行
                if($("#auto-wrap").is(":checked") == true){ $('.receive-windows').append('<br/>'); }
                //console.log('auto-wrap',$("#auto-wrap").is(":checked"))

            }
            else{
                revCountTemp = revCount;
            }
        }
    }
}

//初始化波特率
for(let i=0; i<rateArray.length; i++){
    $('.rate').append('<option>'+rateArray[i]+'</option>')
};

/*for(let i=0; i<parityArray.length; i++){
    $('.parityValue').append('<option>'+parityArray[i]+'</option>')
};

for(let i=0; i<dataBitsArray.length; i++){
    $('.dataBitsValue').append('<option>'+dataBitsArray[i]+'</option>')
};*/

let serialport = require('serialport');
let port = null;
serialport.list((err, ports) => {
    for (let item of ports) {
        $('.com').append(`<option>${item.comName + " #" + item.manufacturer}</option>`)
    }
    console.log(ports);
});

//input textarea控件监听
$('textarea#inputTextarea').keyup(function () {
    //hex发送时只能输入限定字符
    if($("#optionsSendHexDisplay").is(":checked") == true){
        //console.log('optionsSendHexDisplay',$("#optionsSendHexDisplay").is(":checked"))
        var text = $(this).val().replace(/[^\a-f,A-F,0-9], /g, "");
        $(this).val(text)
    }
})

//BaudRate控件监听
$('select#baudRate').change(function () {
    console.log($(this).val());
    //port.baudRate = $(this).val();
    //如果打开串口则动态更新波特率
    if(port.isOpen == true) {
        /*port.update('baudRate',() => {
            baudRate: parseInt($(this).val());
        });*/
    }
})
//点击刷新com
$('select#disabledSelect').click(function () {
    console.log('select click')
    $("select#disabledSelect").empty()

    serialport.list((err, ports) => {
        for (let item of ports) {
            $('.com').append(`<option>${item.comName + " #" + item.manufacturer}</option>`)
        }
        console.log(ports);
    });
})

// 打开串口
$('.btn-submit').click((data) => {

    let COM = ($('select option:selected').text()).split(' #')[0];

    let baudRate = $('#baudRate').val();
    //let parity = $('#parity').val();
    //let dataBits = $('#dataBits').val();
    console.log(COM);
    console.log(baudRate);
    //console.log(parity);
    //console.log(dataBits);

    port = new serialport(COM, {
        baudRate: parseInt(baudRate),
        dataBits: 8,
        parity: 'none',
        stopBits: 1
    });

    //open事件监听
    port.on('open', () =>{
        console.log('serialport open success')

        $('.receive-windows').text(`串口已打开: ${COM}, 波特率: ${baudRate}`);
        $('.receive-windows').append('<br/>=======================================<br/>');

        //定时器，用于接收数据的判断->自动换行
        timerRev = setInterval(wrapEvent,250);
    })

    //close事件监听
    port.on('close', () =>{
        console.log('serialport close success')

        timerRev = window.clearInterval(timerRev);

        $('.receive-windows').text(`串口已关闭: ${COM}`);
        $('.receive-windows').append('<br/>=======================================<br/>');
    })

    //data事件监听
    port.on('data', data => {
        //console.log(`DATA: ${data}`);
        if($("#optionsRevStrDisplay").is(":checked") == true){
            serialData += data;
        }
        if($("#optionsRevHexDisplay").is(":checked") == true){
            serialHexData[revCount] = data;
        }
        revCount += 1;
    })

    //error事件监听
    port.on('error',function(err){
        console.log('Error: ',err.message);
    })
});

// 关闭串口
$('.btn-cancle').click(() => {
    let COM = $('select option:selected').text();

    //关闭串口
    port.close();
});

//sendRadio控件监听
$('input#optionsSendStrDisplay').change(function () {
    //console.log('optionsSendStrDisplay',$(this).val());
    sendData = $('.input-send-data').val();
    let sendDataDis = utils.hex2strToDis(sendData);
    $('.input-send-data').val(sendDataDis);
})

//sendRadio控件监听
$('input#optionsSendHexDisplay').change(function () {
    //console.log('optionsSendHexDisplay',$(this).val());
    sendData = $('.input-send-data').val();
    let sendDataDis = utils.str2hexToDis(sendData).toUpperCase();
    $('.input-send-data').val(sendDataDis);
})

// 点击发送数据
$('.btn-send').click(() => {
    //ascii发送
    if($("#optionsSendStrDisplay").is(":checked") == true){
        //console.log('optionsSendStrDisplay',$("#optionsSendStrDisplay").is(":checked"))
        sendData = $('.input-send-data').val();

        //发送回车
        if($("#enter-checked").is(":checked") == true){ sendData += '\r\n'; }
        //console.log('enter-checked',$("#enter-checked").is(":checked"))

        if (port != {} && port != null) {
            console.log(`SendData: ${sendData}`);

            port.write(sendData, (err) =>{
                if (err) return console.log('write Error: ', err.message);
            });
        }
    }
    //hex发送
    if($("#optionsSendHexDisplay").is(":checked") == true){
        //console.log('optionsSendHexDisplay',$("#optionsSendHexDisplay").is(":checked"))
        sendData = $('.input-send-data').val();

        //sendData = Buffer.from(sendData,'ascii').toString('hex')
        sendHexData = utils.hex2array(sendData)

        //发送回车
        if($("#enter-checked").is(":checked") == true){
            sendHexData.push(0x0D)
            sendHexData.push(0x0A)
        }
        //console.log('enter-checked',$("#enter-checked").is(":checked"))

        if (port != {} && port != null) {
            console.log(`sendHexData: ${sendHexData}`);

            port.write(sendHexData, (err) =>{
                if (err) return console.log('write Error: ', err.message);
            });
        }
    }
})
// 清空接收的数据
$('.btn-reset').click(() => {
    //$('.input-send-data').val('');
    $('.receive-windows').empty();
})