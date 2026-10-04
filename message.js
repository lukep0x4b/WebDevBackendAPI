exports.Response = function(ok, message, result){
    let res = {
        "OK": ok,
        "Message": message,
    }
    if(result) res["Result"] = result
    return JSON.stringify(res)
}