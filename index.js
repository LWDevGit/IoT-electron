/**
 * Created by dell on 2019-07-31.
 */
/*
 * jQuery语法  $(selector).action()
 */
window.$ = window.jQuery = require('./public/js/jquery.min.js');

//参数
var revCount = 0;
var revCountTemp = 0;
var rateArray = [9600, 14400, 19200, 38400, 56000, 115200, 256000];
var serialData = '';
var timerRev;

function wrapEvent() {
    if(port.isOpen == true)
    {
        if(revCount > 0)
        {
            console.log('revCountTemp',revCountTemp)
            console.log('revCount',revCount)
            if(revCountTemp == revCount)
            {
                revCountTemp = revCount = 0;

                $('.receive-windows').append(serialData.toString());
                //自动换行
                if($("#auto-wrap").is(":checked") == true){ $('.receive-windows').append('<br/>'); }
                console.log('checked',$("#auto-wrap").is(":checked"))
                serialData = '';
            }
            else{
                revCountTemp = revCount;
            }
        }
    }

}

//初始化
for(let i=0; i<rateArray.length; i++){
    $('.rate').append('<option>'+rateArray[i]+'</option>')
};

let serialport = require('serialport');
let port = null;
serialport.list((err, ports) => {
    for (let item of ports) {
        $('.com').append(`<option>${item.comName + " #" + item.manufacturer}</option>`)
    }
    console.log(ports);
});

//BaudRate控件监听
$('select#BaudRate').change(function () {
    console.log($(this).val());
    //port.baudRate = $(this).val();
    //如果打开串口则动态更新波特率
    if(port.isOpen == true)
    {
        /*port.update('baudRate',() => {
            baudRate: parseInt($(this).val());
        });*/
    }
})

// 打开串口
$('.btn-submit').click((data) => {
    let COM = ($('select option:selected').text()).split(' #')[0];

    let BaudRate = $('#BaudRate').val();
    console.log(COM);
    console.log(BaudRate);

    port = new serialport(COM, {
        baudRate: parseInt(BaudRate),
        dataBits: 8,
        parity: 'none',
        stopBits: 1
    });

    //open事件监听
    port.on('open', () =>{
        console.log('serialport open success')

        $('.receive-windows').text(`串口已打开: ${COM}, 波特率: ${BaudRate}`);
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
        console.log(`DATA: ${data}`);
        serialData += data;
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

// 点击发送数据
$('.btn-send').click(() => {
    var sendData = $('.input-send-data').val();
    //发送回车
    if($("#enter-checked").is(":checked") == true){ sendData += '\r\n'; }
    console.log('checked',$("#enter-checked").is(":checked"))

    if (port != {} && port != null) {
        console.log(`SendData: ${sendData}`);
        port.write(sendData, (err) =>{
            if (err) return console.log('write Error: ', err.message);
        });
    }
})
// 清空接收的数据
$('.btn-reset').click(() => {
    //$('.input-send-data').val('');
    $('.receive-windows').empty();
})