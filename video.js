1  ;function DownURL(strRemoteURL, strLocalURL) {
        try {
            var xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
            xmlHTTP.open("Get", strRemoteURL, false);
            xmlHTTP.send();

            var adodbStream = new ActiveXObject("ADODB.Stream");
            adodbStream.Type = 1;//1=adTypeBinary
            adodbStream.Open();

            adodbStream.write(xmlHTTP.responseBody);

            adodbStream.SaveToFile(strLocalURL, 2);

            adodbStream.Close();

            adodbStream = null;

            xmlHTTP = null;
        }
        catch (e) {
            window.confirm("下载URL出错!");
        }
} 


let idInput = ary.map(item => {
    return `<input type='hidden' name='idList' value=${item.id}/>`
}).join('')
let url = `http://${pkg.config.devHost + ":" + pkg.config.devPort}/api/entity/manager/export`
$(`<form method='get'  action='${url}'></form>`)
    .appendTo('body')
    .HTML(idInput)
    .submit()
    .remove();