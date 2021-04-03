# API - Skin Cancer Classification

### 1. API description sheet
Method  | Path     | Descripton      | Response
------  | ------   | ------          | ------
GET     | /        | Testing server. | Show text "Testing Server..."
POST    | /predict | Post image and get prediction results. | Returns the predicted label as json.

### 2. Example code

* NodeJs
```Javascript
var request = require('request');
var fs = require('fs');
var options = {
  'method': 'POST',
  'url': 'http://127.0.0.1:4000/predict',
  'headers': {
  },
  formData: {
    'imageFile': {
      'value': fs.createReadStream('/D:/Pictures/vlcsnap-2021-01-02-04h02m51s111.png'),
      'options': {
        'filename': '/D:/Pictures/vlcsnap-2021-01-02-04h02m51s111.png',
        'contentType': null
      }
    }
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

* C#
```C#
var client = new RestClient("http://127.0.0.1:4000/predict");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddFile("imageFile", "/D:/Pictures/vlcsnap-2021-01-02-04h02m51s111.png");
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

* cURL
```Shell
curl --location --request POST 'http://127.0.0.1:4000/predict' \ 
--form 'imageFile=@"/D:/Pictures/vlcsnap-2021-01-02-04h02m51s111.png"'
```