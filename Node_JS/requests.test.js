/*
npm install mocha -g
npm install --save-dev jest
npm i superagent
npm i expect
npm i chai
npm i fs
npm i xlsx
npm i exceljs
npm i
*/

var functions_req = require('./functions_req.js');
const fs = require("fs");
const msg = require('./colour_book.js').msg;
var XLSX = require('xlsx')
const Excel = require('exceljs')
const assert = require('chai').assert;
const expect = require('expect');

let create_path = functions_req.create_path;
let write_file = functions_req.write_file;
let read_file = functions_req.read_file;
let get_current_name_file = functions_req.get_current_name_file;
let json_get_keys = functions_req.json_get_keys;
let json_get_json_from_spis = functions_req.json_get_json_from_spis;
let Get_Unic = functions_req.Get_Unic;
let get_name = functions_req.get_name;
let json_get_values = functions_req.json_get_values;

/*
'use strict';

class User {

  constructor(name) {
    this.name = name;
  }
  
  // геттер
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // сеттер
  set fullName(newValue) {
    [this.firstName, this.lastName] = newValue.split(' ');
  }
  
  //Статическое свойство
  //Можем создавать методы которыми можно создать такой класс
  static createGuest() {
    return new User("Гость", "Сайта");
  }
  
  sayHi() {
    alert(this.name);
  }

}
let user = User.createGuest();
alert( user.firstName );

let user = new User("Вася");
user.sayHi();

*/


async function GetHim(JsonSettings, MyCookies) {
  let Num, Data, Ans, Name_func, NameJson, Name_Server;
  let elements;
  let elem;
  
  //Начало адреса сервера
  //Пример:
  // Cейчас на сайте на любой вкладке, в частности хим анализа
  // URL: https://geos.tom.ru/geos-dev/
  // Тогда base_URL должен быть https://geos.tom.ru/geos-dev
  //Если не будет работать то поменялась вторая часть адреса запроса, ее менять в функции Get_Unic файла functions_req.js
  let base_URL = JsonSettings["url"];
  //Название папки в которой будут сохраняться файлы
  Name_Server = JsonSettings["nameServer"];

  //Описание структуры имен id которых данных нам нужны
  let genJson = (async (Data, keys, Tag, spis_counter)=>{
    let ans=[];
    let a;
    for (item of spis_counter){
      a = await json_get_json_from_spis(Data, keys, JSON.parse("{\""+Tag+"\":\""+item+"\"}"));
      console.log("a=",a);
      a = await json_get_values(a, keys);
      ans.push(a);
    };
    return ans;
  });
  
  let Pool_Name = JsonSettings["data"]["Pool_Name"],
    Pool_id = [];
  let Field_name = JsonSettings["data"]["Field_name"],
    Field_id = [];
  let Area_name = JsonSettings["data"]["Area_name"],
    Area_id = [];
  let ExLine_name = JsonSettings["data"]["ExLine_name"],
    ExLine_id = [];
  let Hole_name = JsonSettings["data"]["Hole_name"],
    Hole_id = [];


  //Создание папки для сохраняемых файлов проекта
  Ans = await create_path(Name_Server);

  //-----БАССЕЙН-----
  //Полученеи списка бассейновв
  Name_func = "GetAllPools";
  Data = await Get_Unic(Name_func, ["root"], MyCookies, base_URL);
  Data = JSON.parse(Data)[0];
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(Data));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["text", "id"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements)); //.join('\n')
  //Поиск id бассейна
  //Ищем последний файл с бассейнами и загружаем данные в переменную
  NameJson = (await get_current_name_file(Name_Server, Name_func + "_Names_"))[0];
  Data = await read_file(Name_Server + "\\" + NameJson);
  Data = JSON.parse(Data);
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  Pool_id = await genJson(Data, ["id"], "text", Pool_Name);

  //-----МЕСТОРОЖДЕНИЕ-----
  //Получение списка месторождений выбранного бассейна
  Name_func = "GetAllFields";
  Data = await Get_Unic(Name_func, Pool_id, MyCookies, base_URL);
  Data = JSON.parse(Data)[0];
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(JSON.parse(Data)));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["text", "id"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements));
  //Поиск id месторождения
  //Ищем последний файл с бассейнами и загружаем данные в переменную
  NameJson = (await get_current_name_file(Name_Server, Name_func + "_Names"))[0];
  Data = await read_file(Name_Server + "\\" + NameJson);
  Data = JSON.parse(Data);
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  Field_id = await genJson(Data, ["id"], "text", Field_name);


  //-----УЧАСТОК-----
  //Получение списка участков выбранного месторождения
  Name_func = "GetAllAreas";
  Data = await Get_Unic(Name_func, Field_id, MyCookies, base_URL);
  Data = JSON.parse(Data)[0];
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(JSON.parse(Data)));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["text", "id"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements));
  //Поиск id участка
  NameJson = (await get_current_name_file(Name_Server, Name_func + "_Names"))[0];
  Data = await read_file(Name_Server + "\\" + NameJson);
  Data = JSON.parse(Data);
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  Area_id = await genJson(Data, ["id"], "text", Area_name);


  //-----РАЗВЕД ЛИНИЯ-----
  //Получение списка развед линий выбранного участка
  Name_func = "GetAllExLines";
  Data = await Get_Unic(Name_func, Area_id, MyCookies, base_URL);
  Data = JSON.parse(Data)[0];
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(JSON.parse(Data)));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["text", "id"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements));
  //Поиск id развед линии
  NameJson = (await get_current_name_file(Name_Server, Name_func + "_Names"))[0];
  Data = await read_file(Name_Server + "\\" + NameJson);
  Data = await JSON.parse(Data);
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  ExLine_id = await genJson(Data, ["id"], "text", ExLine_name);


  //-----СКВАЖИНА-----
  //Получение списка скважин выбранной развед линии
  Name_func = "GetAllHoles";
  Data = await Get_Unic(Name_func, ExLine_id, MyCookies, base_URL);
  Data = JSON.parse(Data)[0];
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(JSON.parse(Data)));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["text", "pk", "id"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements));
  //Поиск id скважины
  NameJson = (await get_current_name_file(Name_Server, Name_func + "_Names"))[0];
  Data = await read_file(Name_Server + "\\" + NameJson);
  Data = JSON.parse(Data);
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  Hole_id = await genJson(Data, ["pk"], "text", Hole_name);
  elements = []
  for (item of Hole_id) {
    if (item != [])
      elements.push(item);
  };
  Hole_id = elements;


  //-----ХИМ АНАЛИЗ-----
  //Получение данных хим анализац
  Name_func = "GetHimAnalizHoles";
  Data = await Get_Unic(Name_func, Hole_id, MyCookies, base_URL);
  Data = JSON.parse(Data);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_JSON_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(JSON.parse(Data)));
  //Получение списка объектов по нужным ключам
  elements = await json_get_json_from_spis(Data, ["data", "totalCount"]);
  //Сформировать имя файла и запись в файл
  NameJson = await get_name(Name_Server, Name_func + "_Names_");
  Ans = await write_file(Name_Server + "\\" + NameJson, JSON.stringify(elements));


}; //();



/*
describe('Global test HimAnaliz', function() {
  describe('Test Server 1', function() {
    
    it('test2', function(){
      expect('test1').toEqual('test1');
    });
    it('test3', async function(){
      expect(1).toBe(1);
    });
    
    const MyCookies = 'pageSizeGeosHole=1000; pageSizeGeosIndicatorQualityCoal=100; PHPSESSID=c76prf7c8puoa0letpktspm1h4; 87be1d31840523c7d802eeca0fcb2eca=ccadb3f2c91407e5626493643fb9dc45767e9c66a%3A4%3A%7Bi%3A0%3Bi%3A155%3Bi%3A1%3Bs%3A9%3A%22ekaterina%22%3Bi%3A2%3Bi%3A10800%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D';
    let Name_func,Name_Server,NameJson,Data,Ans;
    //Начало адреса сервера
    //Пример:
    // Cейчас на сайте на любой вкладке, в частности хим анализа
    // URL: https://geos.tom.ru/geos-dev/
    // Тогда base_URL должен быть https://geos.tom.ru/geos-dev
    //Если не будет работать то поменялась вторая часть адреса запроса, ее менять в функции Get_Unic файла functions_req.js
    let base_URL = "https://geos.tom.ru/geos-dev";
    //Название папки в которой будут сохраняться файлы
    Name_Server = "[Server1]";
    
    //Описание структуры имен id которых данных нам нужны
    let Pool_Name = ["Южный 2"];
    let Field_name = ["Восточное"];
    let Area_name = ["Зольность и ОК "];
    let ExLine_name = ["РЛ 3 Зольность"];
    let Hole_name = ["3030", "3020", "3010"];
    let settJson = {url :base_URL,
                  nameServer:Name_Server,
                  data:{
                  Pool_Name : Pool_Name,
                  Field_name : Field_name,
                  Area_name : Area_name,
                  ExLine_name : ExLine_name,
                  Hole_name : Hole_name
                  }};
    //Обращение к серверу и запись данных в фаайлы
    //GetHim(settJson, MyCookies)
    //Тестирование
    //Чтение данных из файла и экселя и сверка значений колонок в каждой ячейке
    
    Name_func = "GetHimAnalizHoles";
    Name_Server = "[Server1]";
    
    let name_file = "./myFile.xlsx";
    var workbook;
    let count_sheet = "Tests",sheet_name_list;
    let DataCSV;
    let data, totalCount;
    
    let tist = ((nameTest,A,B)=>{
      it(nameTest, function(A, B) {
        expect(A).toEqual(B);
        //assert(data[i][key], DataCSV[i][key], 'Сообщение об ошибке');
      });
    });
    
    let AB;
    it('test3', async function(){
      AB = await new Promise(async (resolve, reject) => {
          NameJson = (await get_current_name_file(Name_Server,Name_func+"_Names"))[0];
          Data= await read_file(Name_Server+"\\"+NameJson);
          Data=JSON.parse(Data);
        
          workbook = XLSX.readFile(name_file);
          sheet_name_list = workbook.SheetNames;
          count_sheet = sheet_name_list[0];
          workbook = workbook.Sheets[count_sheet];
          DataCSV = XLSX.utils.sheet_to_json(workbook);
          //console.log(sheet_name_list);
          //console.log(DataCSV);

          data = Data[0]["data"];
          totalCount = Data[0]["totalCount"];
          //console.log(data[1])
          resolve([data, DataCSV]);
      });
    });
    
    data = AB[0];
    console.log(data)
    DataCSV = AB[1];
    for (i in data) {
      let keys = json_get_keys(DataCSV[i]);
      for (key of keys) {
        let nameTest='Line[' + i + '] column[' + key + ']';
        let a = data[i][key];
        let b = DataCSV[i][key];
        tist(nameTest,a,b);
      }
    }
        //let keys = json_get_keys(line);
        
        //DataCSV
  });
});
*/

function tist (nameTist,A,B){
  msg(nameTist+"-Start",0);
  let good = 0;
  if ((A==null && B=="-" || A=="-" && B == null) ||
      (A==null && B==undefined || A==undefined  && B == null) ||
      (A==B)){
      good = 1;
    }
  if (good==0)
    msg(["Err: ", A+"!="+B],4);
};

//main
(async ()=>{
  const MyCookies = 'pageSizeGeosHole=1000; pageSizeGeosIndicatorQualityCoal=100; PHPSESSID=c76prf7c8puoa0letpktspm1h4; 87be1d31840523c7d802eeca0fcb2eca=ccadb3f2c91407e5626493643fb9dc45767e9c66a%3A4%3A%7Bi%3A0%3Bi%3A155%3Bi%3A1%3Bs%3A9%3A%22ekaterina%22%3Bi%3A2%3Bi%3A10800%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D';
  let Name_func,Name_Server,NameJson,Data,Ans;
  //Начало адреса сервера
  //Пример:
  // Cейчас на сайте на любой вкладке, в частности хим анализа
  // URL: https://geos.tom.ru/geos-dev/
  // Тогда base_URL должен быть https://geos.tom.ru/geos-dev
  //Если не будет работать то поменялась вторая часть адреса запроса, ее менять в функции Get_Unic файла functions_req.js
  let base_URL = "https://geos.tom.ru/geos-dev";
  //Название папки в которой будут сохраняться файлы
  Name_Server = "[Server1]";
  
  //Описание структуры имен id которых данных нам нужны
  let Pool_Name = ["Южный 2"];
  let Field_name = ["Восточное"];
  let Area_name = ["Зольность и ОК "];
  let ExLine_name = ["РЛ 3 Зольность"];
  let Hole_name = ["3020"];
  let settJson = {url :base_URL,
                nameServer:Name_Server,
                data:{
                Pool_Name : Pool_Name,
                Field_name : Field_name,
                Area_name : Area_name,
                ExLine_name : ExLine_name,
                Hole_name : Hole_name
                }};
  //Обращение к серверу и запись данных в фаайлы
  GetHim(settJson, MyCookies)
  //Тестирование
  //Чтение данных из файла и экселя и сверка значений колонок в каждой ячейке
  
  Name_func = "GetHimAnalizHoles";
  Name_Server = "[Server1]";
  NameJson = (await get_current_name_file(Name_Server,Name_func+"_Names"))[0];
  Data= await read_file(Name_Server+"\\"+NameJson);
  Data=JSON.parse(Data);
  /*
  let columns_header = [];
  for (line of Data){
    line=line["data"][0];
    //let keys = json_get_keys(line);
    let cou=0;
    for (i of keys){
      columns_header.push({header:i,key:i});
    }
  }
  */
  let name_file = "./myFile.xlsx";
  var workbook;
  let count_sheet = "Tests";
  let DataCSV;
  /*
    //Запись колонок назаний id из json
    workbook = new Excel.Workbook()
    let sheet = workbook.addWorksheet('Tests')
    sheet.columns = columns_header;
  
    workbook.xlsx.writeFile(name_file).then(() => {
      callback(null);
    });
  */
  
  workbook = XLSX.readFile(name_file);
  sheet_name_list = workbook.SheetNames;
  count_sheet = sheet_name_list[0];
  workbook = workbook.Sheets[count_sheet];
  DataCSV = XLSX.utils.sheet_to_csv(workbook);
  console.log(sheet_name_list);
  let linesCSV = DataCSV.split('\n');
  let columns = linesCSV[0].split(',');
  linesCSV.splice(0,4);
  let CSV = {};
  for (i in columns){
    CSV[columns[i]]=[];
  };
  for (item of linesCSV){
    let line=item.split(',');
    line.splice(line.length,1);
    for (i in line){
      CSV[columns[i]].push(line[i]);
    };
  };
  console.log(CSV["listIqcKorolek"]);
  
  let data = Data[0]["data"];
  let totalCount = Data[0]["totalCount"];
  console.log(data[0]["listIqcKorolek"])
  
  
  for (i in data) {
    let keys = json_get_keys(CSV);
    for (key of keys) {
      //key="listIqcKorolek";
      let nameTest='Line[' + i + '] column[' + key + ']';
      let a = data[i][key];
      let b = CSV[key][i];
      //if (b== "-")
      //console.log(a,"|",b,"|",key);
      tist(nameTest,a,b);
    }
  }
  
  
    

  
})();

(async () => {
  
  
  

/*writing
var data = [{
  name: "Kalai",
  age: 24
}, {
  name: "Vignesh",
  age: 24
}];
for (i in data) {
  sheet.addRow(data[i]);
}
*/
/*reading

var workbook = new Excel.Workbook(); 
workbook.xlsx.readFile(name_file)
    .then(function() {
        var worksheet = workbook.getWorksheet(count_sheet);
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        });
    });
*/

    
    
    
    
    
    
  
    /*
    var ws = XLSX.utils.json_to_sheet([
      { S:1, h:2, e:3, e_1:4, t:5, J:6, S_1:7 },
      { S:2, h:3, e:4, e_1:5, t:6, J:7, S_1:8 }
    ], {header:["S","h","e","e_1","t","J","S_1"]});
    XLSX.utils.sheet_add_json(ws, [
      { A: 1, B: 2 }, { A: 2, B: 3 }, { A: 3, B: 4 }
    ], {skipHeader: true, origin: "A2"});
    */
  /*
  
  */
  //console.log(await json_get_json_from_spis([Data["data"]],json_get_keys(Data["data"])));
  //Составиление списка значений (искомых id) по определенному критерию соответствия (имени text)
  //Area_id = await json_get_json_from_spis(Data,["id"],{"text":Area_name[0]});
  //Area_id = await json_get_values(Area_id,["id"]);



});//();


/*
const assert = require('chai').assert;
const expect = require('expect');

describe('Products Service', function() {
  describe('Add new product', function() {
    it('Name_test', function(){
        assert(2+2, 4, 'Сообщение об ошибке');
    });
    it('test2', function(){
      expect('test1').toEqual('test1');
    });
    it('test3', function(){
      expect(1).toBe(1);
    });
  });
});

*/