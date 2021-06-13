var superagent = require('superagent');
const fs = require("fs");


//Функция создания папки
async function create_path(name_path){
  if(!fs.existsSync(name_path)){
    fs.mkdir(name_path, (err) => {
        if(err) console.error("<create_path()>["+name_path+"]\n",err);
        //console.log('Path '+name_path+' created.');
    });
  } else{
    //console.log('Path '+name_path+' exist.');
  };
};
//Функция записи данных в файл
async function write_file(name_file,data){
  return new Promise((resolve,reject) => {
    //Проерка существует ли файл
    new Promise((resolve,reject) => {
      fs.open(name_file, 'w', (err) => {
        if(err) console.error("<write_file()-open>["+name_file+"]\n"+err);
        //process.stdout.write('File ['+name_file+']');
        resolve(1);
      });
    }).then(()=>{
      //Запись в файл
      //process.stdout.write(" writing...");
      fs.appendFile(name_file, data, (error)=>{//Функция выполнится после записи
        if(error) {
          //console.log("no");
          console.error("<write_file()-appendFile>["+name_file+"]\n"+error);
          reject(1);
        } else {
          //console.log("ok");
          resolve(1);
        }
      });
    });
  });  
};
//Функция чтения файла, возвращает содержимое
async function read_file(name_file){
  return new Promise((resolve,reject) => {
    //Запись в файл
    //process.stdout.write("File ["+name_file+"] reading...");
    fs.readFile(name_file, "utf8", (error,data)=>{
      if(error) {
        //console.log("no");
        console.error("<read_file()>["+name_file+"]\n"+error);
        reject(1);
      } else {
        //console.log("ok");
        resolve(data);
      }
    });
  });
};
//Получение списка имен файлов в директории
async function get_names_files(name_path){
  return new Promise((resolve,reject) => {
    let arr=[];
    fs.readdir(name_path, (err, files) => {
      files.forEach(file => {
        arr.push(file);
      });
      resolve(arr);
    });
  });
};
//Получение отсортироанного массива списка имен файлов в конкретной папке по подстроке включенной в имя
async function get_current_name_file(name_path,name_file){
  return new Promise(async (resolve,reject) => {
    let files = await get_names_files(name_path);
    let ans=[];
    files.forEach(file => {
      if (file.includes(name_file)==true)
        ans.push(file);
    });
    if (ans.length!=0){
      ans=ans.sort().reverse();
      resolve(ans);
    } else
      resolve(0);
  });
};
//Функции для формирования имен файлов и логирования
//Получение строки текущей даты
function get_date(){
  let monthes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  let date = new Date();
  return "["+date.getDate() + '-' + monthes[date.getMonth()] + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes()+"]"
}
//Получение количества файлов в директории совпадаюющих по подстроке
async function get_num(name_path,name_file){
  return new Promise(async (resolve,reject) => {
    let ans = await get_current_name_file(name_path,name_file);
    if (ans==false)
      ans=0;
    else
      ans=ans.length;
      resolve(ans);
  });
};
//Добавить к имени текущую дату и номер относительно количества таких имен файлов
async function get_name(name_path,name){
  return new Promise(async (resolve,reject) => {
    let ans;
    //Получаем количество элементов с тким назвнием
    Num = await get_num(name_path,name);
    ans=Num+"_"+name+get_date();
    resolve(ans);
  });
};

//Работа с Json 
//Получить ключи объекта
function json_get_keys(a) {
  if (Object.keys(a).length === 0)
    return [];
  else
    return Object.keys(a);
}
//Функция вытаскиающая из Json элементы по нужным ключаам
function json_get_values(Json, Keys) {
  if (typeof(Json)==typeof("string"))
    Json=JSON.parse(Json);
  let spis=[];
  for(line of Json){
    for(key of Keys){
      spis.push(line[key]);
    };
  };
  return spis;
};
//Функция возвращает список json файлов состоящий из указанных колонок.
//Если задаан json_counter то возвращает список json файлов с выбранными колонками
//при совпадении со значениями по ключу из json_counter
async function json_get_json_from_spis(spis_json,keys,json_counter=null){
  return new Promise(async (resolve,reject) => {
    let elem=[];
    if (typeof(spis_json)==typeof("string"))
      spis_json=JSON.parse(spis_json);
    for(line of spis_json){
      if (typeof(line)==typeof("string"))
        line=JSON.parse(line);
      //line=JSON.parse(line)
      if (json_counter==null){
        let js = {};
        for(key of keys){
          js[key]=line[key];
        };
        elem.push(js);
      } else {
        let do1 = 1;
        let keys_JC = json_get_keys(json_counter);
        for(key_JC of keys_JC){
          if (line[key_JC] != json_counter[key_JC]){
            do1=0;
            break;
          };
        };
        if (do1==1){
          let js = {};
          for(key of keys){
            js[key]=line[key];
          };
          elem.push(js);
        };
      };
    };
    resolve(elem);
  });
};

//Уникальная функция совершеия обращений к данным хим анализа
async function Get_Unic(Name_function, My_id, MyCookies, URL_='https://geos.tom.ru/geos-dev') {
  return new Promise(async (resolve, reject) => {
    console.log("----------------\nFinding_id=\n",JSON.stringify(My_id));
    let myagent = superagent.agent();
    let NameFunc,
      url_him_all,
      model,
      field,
      node,
      id,
      _dc,
      QString,
      arrReq=[],
      req;

    if (Name_function == "GetAllHoles" || Name_function == "GetAllExLines" || Name_function == "GetAllAreas" || Name_function == "GetAllFields" || Name_function == "GetAllPools") {
      NameFunc = "[https://]>" + Name_function;
      url_him_all = URL_+'/sysKernel/getTreeForField';
      model = "model=GeosIndicatorQualityCoal";
      field = "field=iqc_hole_id";
      node = "node=";
      id = "id=";
      for (id_i of My_id) {
        QString = model + "&" + field + "&" + node + id_i[0] + "&" + id + id_i[0];
        console.log("URL:",url_him_all + "?" + QString)
        req = await new Promise((resolve, reject) => {
          let ans=[];
          myagent
            .get(url_him_all + "?" + QString)
            .set('cookie', MyCookies)
            .end(function(error, response) {
              if (error) {
                console.log(NameFunc + "()=>Error:\n" + error);
                reject(error);
                return "";
              }
              ans = response;
              console.log(NameFunc + "()=>" + ans.status + " Ok");
              resolve(ans.text);
              //console.log(arrReq)
            });
          });
          arrReq.push(req);
      };
    } else if (Name_function == "GetHimAnalizHoles") {
      let DC_ = new Date().getTime();
      NameFunc = "[https://]>" + Name_function;
      url_him_all = URL_+'/sysKernel/getListJSonDataFromModel';
      model = "model=GeosIndicatorQualityCoal";
      _dc = "_dc="+DC_;
      QString = model + "&" + _dc;
      
      //My_id
      let n = My_id.length;
      let str_req="", str_list="";
      let i=0;
      for (item of My_id){
        str_list="i:"+i+";s:"+item[0].length+":\""+item[0]+"\";";
        str_req+=str_list;
        i++;
      };
      
      let filter = "a:2:{s:11:\"iqc_hole_id\";a:"+n+":{"+str_req+"}s:13:\"listIQCLayers\";a:0:{}}";
      let other = "a:2:{s:6:\"search\";s:0:\"\";s:14:\"advancedSearch\";s:0:\"\";}";
      let options = "a:0:{}";
      let page = "1";
      let start = "0";
      let limit = "200";
      //Надо получить totalCount и узнать сколько всего строк надо и  цикле все собрать
      
      
      //console.log("QString=",QString)
      //console.log("filter=",filter)
      //console.log("other=",other)
      
      req = await new Promise(async (resolve, reject)=>{
        let ans=[];
        myagent
          .post(url_him_all + "?" + QString)
          .set('cookie', MyCookies)
          .type('form')
          .field('filter', filter)
          .field('other', other)
          .field('options', options)
          .field('page', page)
          .field('start', start)
          .field('limit', limit)
          //.send(form)
          .end(function(error, response) {
            if (error) {
              console.log(NameFunc + "()=>Error:\n" + error);
              reject(error);
              return "";
            }
            ans = response;
            console.log(NameFunc + "()=>" + ans.status + " Ok");
            resolve(ans.text);
            //console.log("req.text=",req.text)
          });
        });
        arrReq.push(req)
    };
    console.log("----------------\n");
    resolve(JSON.stringify(arrReq));
  });
};


module.exports = { create_path, write_file, read_file,
                  get_names_files, get_current_name_file, get_date,
                  get_num, get_name, json_get_keys, json_get_values,
                  json_get_json_from_spis, Get_Unic };


