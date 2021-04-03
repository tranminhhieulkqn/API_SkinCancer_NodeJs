# API - Skin Cancer Classification

### 1. API description sheet
Method  | Path     | Descripton      | Response | Note
------  | ------   | ------          | ------   | ------
GET     | /        | Testing server. | Show text "Testing Server..." | -
POST    | /predict | Post image and get prediction results. | Returns the predicted label as json. | Key for file image must be **imageFile**.


### 2. Example code

* C#
```C#
var client = new RestClient("http://.../predict");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddFile("imageFile", "<image_path>");
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

* cURL
```Shell
curl --location --request POST 'http://.../predict' \ 
--form 'imageFile=@"<image_path>"'
```

* Python
```Python
import requests
url = "http://.../predict"
payload={}
files=[
  ('imageFile',('<filename>',open('<image_path>','rb'),'image/png'))
]
headers = {}
response = requests.request("POST", url, headers=headers, data=payload, files=files)
print(response.text)
```

* NodeJs
```Javascript
var request = require('request');
var fs = require('fs');
var options = {
  'method': 'POST',
  'url': 'http://.../predict',
  'headers': {
  },
  formData: {
    'imageFile': {
      'value': fs.createReadStream('<image_path>'),
      'options': {
        'filename': '<filename>',
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
### Thanks :muscle: