/**
 * Created by dell on 2019-08-03.
 */
function str2hexToDis(str) {
    if(str == ""){
        console.log('str2hexToDis str is null')
        return
    }
    var val = "";
    for(let i = 0; i < str.length; i++){
        if(val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += ' ' + str.charCodeAt(i).toString(16).toUpperCase();
    }
    //val = val.replace(/,/g," ")
    //转大写字母
    //val = val.toUpperCase()
    console.log('str2hexToDis',val)
    return val
}

function str2hex(str) {
    if(str == ""){
        console.log('str2hex str is null')
        return
    }
    var val = "";
    for(let i = 0; i < str.length; i++){
        if(val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16).toUpperCase();
    }
    //val = val.replace(/,/g," ")
    //转大写字母
    //val = val.toUpperCase()
    console.log('str2hex',val)
    return val
}

function hex2str(hex) {
    if(hex == ""){
        console.log("hex2str hex is null")
        return
    }
    var val = "";
    var arr = hex.split(" ");
    console.log('arr',arr)
    for(var i = 0; i < arr.length; i++){
        console.log('string charcode',String.fromCharCode(parseInt(arr[i],16)))
        if(String.fromCharCode(parseInt(arr[i],16)) != null)
        {
            val += String.fromCharCode(parseInt(arr[i],16));
        }
    }
    console.log('hex2str',val)
    return val
}

module.exports = {
    str2hex: str2hex,
    str2hexToDis: str2hexToDis,
    hex2str: hex2str
}