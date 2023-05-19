const databaseName = 'sv_diy'


function openSqlite(){
	//创建数据库或者打开
	//plus.sqlite只在手机上运行
	if(isOpen()){
		return new Promise((resolve,reject) =>{
			resolve('already open')
		})
		
	}
	return new Promise((resolve,reject) =>{
		plus.sqlite.openDatabase({
			name:'sv_diy',  //数据库名称
			path:'_doc/sv_diy.db',   //数据库地址，uniapp推荐以下划线为开头
			success(e){
				console.log('open Success')
				resolve(e); //成功回调
				
			},
			fail(e){
				console.log('open fail')
				console.log(e)
				reject(e); //失败回调
			}
		})
	})	
}

function tableInitCheck(tableName){
	return new Promise((resolve,reject) =>{
	//创建表格在executeSql方法里写
		plus.sqlite.executeSql({
			name:'sv_diy',
			//表格创建或者打开，后面为表格结构
			sql:'create table if not exists '+tableName+'("id" INTEGER PRIMARY KEY AUTOINCREMENT,"value" TEXT,"name" TEXT,"build_in" INTEGER)', 
			success(e){
				resolve(e);
			},
			fail(e){
				
				reject(e);
			}
		})
	})
}

function getAll(tableName){
	return new Promise((resolve,reject) =>{
		plus.sqlite.selectSql({
			name:'sv_diy',
			sql:'select * from '+tableName+' order by id desc',
			success(e){
				resolve(e);
			},
			fail(e){
				console.log('getall error')
				console.log(e)
				reject(e);
			}
		})
	})
}

function addType(obj){
	//判断有没有传参
	if(obj !== undefined){
		//判断传的参是否有值
		var b = (JSON.stringify(obj) == "{}");
		if(!b){
			//obj传来的参数对象
			
			var value = obj.value || null; //
			var name = obj.text || null; //
			var build_in = 0; //
			if(obj.buildIn!=undefined){
				build_in=obj.buildIn
			}
			return new Promise((resolve,reject) =>{
				plus.sqlite.executeSql({
					name:'sv_diy',
					sql:'insert into type_range(name,value,build_in) values("'+name+'","'+value+'",'+build_in+')',
					success(e){
						resolve(e);
					},
					fail(e){
						console.log('add error')
						reject(e);
					}
				})
			})
		}else{
			return new Promise((resolve,reject) =>{reject("错误添加")})
		}
	}else{
		return new Promise((resolve,reject) =>{reject("错误添加")})
	}
}

function deleteByid(id,tableName){
	return new Promise((resolve,reject) =>{
		plus.sqlite.executeSql({
			name:'sv_diy',
			sql:'delete from '+tableName+' where id = ' +id,
			success(e){
				resolve(e);
			},
			fail(e){
				console.log('detele error' + id)
				console.log(e)
				reject(e);
			}
		})
	})
}

function deleteAll(tableName){
	return new Promise((resolve,reject) =>{
		plus.sqlite.executeSql({
			name:'sv_diy',
			sql:'delete from '+tableName+' where 1=1',
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//关闭数据库
function closeSQLite(){
	return new Promise((resolve,reject) =>{
		plus.sqlite.closeDatabase({
			name:databaseName,
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//监听数据库是否开启
function isOpen(name,path){
	var ss = name || 'sv_diy';
	var qq = path || '_doc/sv_diy.db';
	//数据库打开了就返回true,否则返回false
	var open = plus.sqlite.isOpenDatabase({
					name:ss,
					path:qq
				})
	return open;
}

export{
	isOpen,closeSQLite,deleteByid,addType,getAll,tableInitCheck,openSqlite,deleteAll
}