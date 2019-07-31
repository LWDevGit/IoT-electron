/**
 * Created by dell on 2019-07-31.
 */
/*
 * jQuery语法  $(selector).action()
 */
window.$ = window.jQuery = require('./public/js/jquery.min.js');

/*let name = 'IoT Desktop';
let version = '1.0.0(002)';
//$('title').text(name + ' ' version);

$('title').text('${name + ' ' version}');*/

let serialport = require('serialport');
let port = null;
serialport.list((err, ports) => {
    for (let item of ports) {
        $('.com').append(`<option>${item.comName + " #" + item.manufacturer}</option>`)
    }
    console.log(ports);
});
// 打开串口
$('.btn-submit').click((data) => {
    let COM = ($('select option:selected').text()).split(' #')[0];

    let BaudRate = $('#BaudRate').val();
    console.log(COM);
    console.log(BaudRate);

    port = new serialport(COM, {
        baudRate: parseInt(BaudRate)
    });
    $('.receive-windows').text(`串口已打开: ${COM}, 波特率: ${BaudRate}`);
    $('.receive-windows').append('<br/>=======================================<br/>');

    //打开串口并接收数据
    port.on('data', data => {
        console.log(`DATA: ${data}`);
        $('.receive-windows').append(data.toString());
    });

    //打开错误将会发出一个错误事件
    port.on('error',function(err){
        console.log('Error: ',err.message);
    });
});
// 关闭串口
$('.btn-cancle').click(() => {
    let COM = $('select option:selected').text();

    //关闭串口
    port.close()
    console.log('serialport close success')

    $('.receive-windows').text(`串口已关闭: ${COM}`);
    $('.receive-windows').append('<br/>=======================================<br/>');
});

// 点击发送数据
$('.btn-send').click(() => {
    var sendData = $('.input-send-data').val();
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