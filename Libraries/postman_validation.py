import os,sys
import json
import csv
import yaml

global space
space = "    "
yamlFile = ''
find_List = []
type_List = []
value_List = []

# class excel():

def readExcel(csv_File): #This method will read the Excel file and take the TAG values in list
	
	global yamlFile
	jsonfile = './outputFiles/'+csv_File +".json"
	Tag = []
	dataType = []
	subDataType = []
	#yamlFile = csv_File.strip(".csv")+'.yaml'
	yamlFile = './outputFiles/'+csv_File+'.yaml'

	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)

	response_list = []
	for api in yamlContent['paths']:
		for method in yamlContent['paths'][api]:
			res_body = {}
			res_body['api'] = api
			res_body['method'] = method
			res_body['response_key'] = ''
			for response in yamlContent['paths'][api][method]['responses']:
				if response == 200 or response == 201 or response == 204 and res_body['method'] != 'delete':
					if 'examples' in yamlContent['paths'][api][method]['responses'][response]:
						res_body['main_Key'] = yamlContent['paths'][api][method]['responses'][response]['examples']['application/json'].keys()[0]
						res_body['response'] = yamlContent['paths'][api][method]['responses'][response]['examples']['application/json']
						response_list.append(res_body)
								
					else:
						if 'schema' in yamlContent['paths'][api][method]['responses'][response]:
							if 'items' in yamlContent['paths'][api][method]['responses'][response]['schema']:
								next_ref = yamlContent['paths'][api][method]['responses'][response]['schema']['items']['$ref']
							else:
								next_ref = yamlContent['paths'][api][method]['responses'][response]['schema']['$ref']
							schema = next_ref
							schema = schema.split('/')[-1]
							ress = yamlContent['definitions'][schema]['properties'].keys()[0]
							schema2 = yamlContent['definitions'][schema]['properties'][ress]['$ref']
							schema2 = schema2.split('/')[-1]
							res_body['response_key'] = schema2 
							res_body['main_Key'] = ress
							if 'example' in yamlContent['definitions'][schema2]:
								res_body['response'] = yamlContent['definitions'][schema2]['example']
								if res_body not in response_list:
									response_list.append(res_body)

							else:
								pass	
						else:
							pass


	#Passing the list to next Method to change the Postman file
	writePostmanCollection(Tag,dataType,subDataType,yamlFile,jsonfile,response_list)
	# excelLoad.writePostmanCollection(Tag,dataType,subDataType)

def writePostmanCollection(Tag,dataType,subDataType,yamlFile,jsonfile,response_list):#This will add the 'Tests' and 'Pre-Request' part in postman file

	global find_List,type_List,value_List
	rowNo = 0
	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)
	JsonFile = open(jsonfile,'r+')
	jsonContent = json.load(JsonFile)
	
	# response_list = [response_list[5]]
	# print(response_list)

	for content in jsonContent['requests']:
		url = content['url']

	
		#We don't need 'Tests' for DELETE..
		if content['method'] == "DELETE":
			pass
		else :

			if '200' in content['name'] or '201' in content['name']:
				content['events'] = []

				#This is for 'Tests' part
				content['events'].append({ #Default Content for 'Tests'
					"listen": "test",
					"script": {"type": "text/javascript",
					"exec":[]
					}
					})

				statuscode = content['name'].split('_')[1]

				content['events'][0]['script']['exec'].append("var jsonData = pm.response.json();")
				content['events'][0]['script']['exec'].append("pm.test(\"Status code is -  \"+ jsonData['statuscode'] , function() {")
				content['events'][0]['script']['exec'].append(space + "pm.expect(jsonData['statuscode']).to.be.eql(" + statuscode + ")")
				content['events'][0]['script']['exec'].append("});",)
				content['events'][0]['script']['exec'].append("")
				
				for element in response_list:
					dict_List  = []
					data_value_list = []
					value_List = []
					if element['main_Key'] not in value_List:
						value_List.append(element['main_Key'])
					if '{' not in element['api'] and '/:' not in url:
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url

						crctCheck = url1.split(element['api'])[-1]
						if element['api'] in url1 and element['method'].upper() == content['method'] and crctCheck == '':
							for key,value in element['response'].items():
								if value == '':
									find_List = []
									list3 = find_value(key,element['main_Key'])
									for elem in list3:
										if elem not in value_List:
											value_List.append(elem)
								else:
									pass
								if type(value) == str or type(value) == int or type(value) == unicode:
									if key not in value_List:
										value_List.append(key)
								else:
									if key not in value_List:
										value_List.append(key)
									list2 = req_body(key,value,dict_List,element['main_Key'])
									for elem in list2:
										if '.' in elem:
											elem = elem.split('.')
											for i in elem:
												if i not in value_List:
													value_List.append(i)
										else:
											pass

							content['events'][0]['script']['exec'].append("pm.test(\"Body matches string\", function () {")
							for x in value_List: #Adding the TAG values
								content['events'][0]['script']['exec'].append(space+"pm.expect(pm.response.text()).to.include(\""+ x +"\""");")
						
							content['events'][0]['script']['exec'].append("});")
							content['events'][0]['script']['exec'].append("")


					elif '{' in element['api'] and '/:' in url:
						api = element['api'].replace('{',':')
						api = api.replace('}','')
						if '/' in api[-1]:
							api = api[:-1]
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url
						crctCheck = url1.split(api)[-1]
						if api in url1 and element['method'].upper() == content['method'] and crctCheck == '':
							# key_check = element['response'].keys()[0]
							# if element['main_Key'] == key_check:
							# 	main_list = data_value(content,element['response'][key_check],element['main_Key'],data_value_list)
							# else:
							# 	main_list = data_value(content,element['response'],element['main_Key'],data_value_list)
							for key,value in element['response'].items():
								if value == '':
									find_List = []
									list3 = find_value(key,element['main_Key'])
									for elem in list3:
										if elem not in value_List:
											value_List.append(elem)
								else:
									pass
								if type(value) == str or type(value) == int or type(value) == unicode:
									if key not in value_List:
										value_List.append(key)
								else:
									if key not in value_List:
										value_List.append(key)
									list2 = req_body(key,value,dict_List,element['main_Key'])
									for elem in list2:
										if '.' in elem:
											elem = elem.split('.')
											for i in elem:
												if i not in value_List:
													value_List.append(i)
										else:
											if elem not in value_List:
												value_List.append(elem)

							content['events'][0]['script']['exec'].append("pm.test(\"Body matches string\", function () {")
							for x in value_List: #Adding the TAG values
								content['events'][0]['script']['exec'].append(space+"pm.expect(pm.response.text()).to.include(\""+ x +"\""");")
						
							content['events'][0]['script']['exec'].append("});")
							content['events'][0]['script']['exec'].append("")

				content['events'][0]['script']['exec'].append("pm.test(\"isString\" ,function() {")
				content['events'][0]['script']['exec'].append(space + "if  (pm.response.json().res){")
				content['events'][0]['script']['exec'].append(2*space + "jsonData = pm.response.json().res; " +'\n' +space+"}")
				content['events'][0]['script']['exec'].append(space + "else{")
				content['events'][0]['script']['exec'].append(2*space + "var jsonData = [pm.response.json()];" +'\n'+space+ "}")
				content['events'][0]['script']['exec'].append(space+"for (i = 0; i < jsonData.length; i++) {")

				for element in response_list:
					data_value_list = []
					if element['main_Key'] not in value_List:
						value_List.append(element['main_Key'])
					if '{' not in element['api'] and '/:' not in url:
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url

						crctCheck = url1.split(element['api'])[-1]

						if element['api'] in url1 and element['method'].upper() == content['method'] and crctCheck == '':
							main_list = data_value(content,element['response'],element['main_Key'],element['response_key'])

					elif '{' in element['api'] and '/:' in url:
						api = element['api'].replace('{',':')
						api = api.replace('}','')
						if '/' in api[-1]:
							api = api[:-1]
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url
						crctCheck = url1.split(api)[-1]
						if api in url1 and element['method'].upper() == content['method'] and crctCheck == '':
							main_list = data_value(content,element['response'],element['main_Key'],element['response_key'])

				content['events'][0]['script']['exec'].append(space+"}")
				content['events'][0]['script']['exec'].append("})")
	
		if 'events' not in content:
			content['events'] = []
			eventCheck = 0
		else:
			eventCheck = 1
			pass

		rowNo = rowNo + 1

		url_List = []
		raw_List = []
		final_List = []

		pathVariables = content['pathVariables']
		if len(pathVariables) == 0:
			pass
		else:
			for key,value in pathVariables.items():
				if key not in url_List:
					url_List.append(key)

		if '?' in url:
			url_copy = url.split('?')[1]
			url_copy = url_copy.split('&')
			for query in url_copy:
				query = query.split('=')[1]
				query = query.replace('{{','')
				query = query.replace('}}','')
				if query not in url_List:
					url_List.append(query)

		if type(content['rawModeData']) == unicode:
			rawModeData = json.loads(content['rawModeData'])
			for key,value in rawModeData.items():
				if type(value) == unicode:
					value = value.replace('{{','')
					value = value.replace('}}','')
					raw_List.append(value)
				else:
					list1 = req_body(key,value,final_List,'')
					for element in list1:
						if element not in raw_List:
							raw_List.append(element)
		else:
			pass

		query = url.split('{{port}}')[1]
		content['events'].append({   #Default content for 'Pre-Requests'
			"listen": "prerequest",
			"script": {"type": "text/javascript",
			"exec":[
			space*1+"var list = [];",
			space*1+"pm.sendRequest({",
			space*1+"url: 'localhost:8081/read_Excel/"+str(rowNo)+"?query="+query+"',",
			space*1+"method: 'GET',",
			space*1+"header: 'Content-Type:application/x-www-form-urlencoded',",
			space*1+"}, function (err, res) {",
			space*1+"var response_json = res.json();",
			space*1+"if(list.length === 0){",
			space*1+"var key;",
			space*1+"for (key in response_json) {",
			space*2+"if (response_json.hasOwnProperty(key))",
			space*2+"{",
			space*3+"list.push(response_json[key]);",
			space*2+"}",
			space*1+"}",
			"",
			space+"var currentData = list.shift();",
			"",
			]}
			})
			
		for element in url_List:
			content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+element+'"'+",currentData."+element+");")

		for element in raw_List:
			if '.' in element:
				data = element.split('.')[-1]
				content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+ data +'"'+',currentData["'+element+'"]);')
			else:
				content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+element+'"'+",currentData."+element+");")

		content['events'][eventCheck]['script']['exec'].append(space+'}')
		content['events'][eventCheck]['script']['exec'].append('});')

	write_req_body(jsonContent,dataType,subDataType,jsonfile)


def write_req_body(jsonContent,dataType,subDataType,jsonfile):

	with open(jsonfile, 'w') as outfile:
		json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)

def req_body(main_Key,dict_value,final_List,Header_key):

	if type(dict_value) == dict:
		for key,value in dict_value.items():
			if type(value) == unicode or type(value) == str or type(value) == int:
				if value == '':
					list3 = find_value(main_Key +'.'+ key,Header_key)
					for elem in list3:
						final_List.append(elem)
				else:
					pass
				final_List.append(main_Key +'.'+ key)
			else:
				req_body(main_Key+'.'+key,value,final_List,Header_key)

	if type(dict_value) == list:
		for element in dict_value:
			if type(element) == unicode or type(element) == str or type(element) == int:
				if element == '':
					list3 = find_value(main_Key,Header_key)
					for elem in list3:
						final_List.append(elem)
				else:
					pass
				final_List.append(main_Key)

			else:
				req_body(main_Key,element,final_List,Header_key)

	return final_List

def find_value(key,Header_key):

	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)
	if Header_key in yamlContent['definitions']:
		if '.' in key:
			key = key.split('.')
			if key[0] in yamlContent['definitions'][Header_key]['properties']:
				next1 = yamlContent['definitions'][Header_key]['properties'][key[0]]['$ref'].split('/')[-1]
				key.remove(key[0])
				find_value(key,next1)

		elif key == '':
			if Header_key in yamlContent['definitions']:
				if 'type' in yamlContent['definitions'][Header_key]:
					if yamlContent['definitions'][Header_key]['type'] == 'string' or yamlContent['definitions'][Header_key]['type'] == 'integer':
						pass
						# print(Header_key,yamlContent['definitions'][Header_key]['type'])
				
					elif 'items' in yamlContent['definitions'][Header_key]:
						if '$ref' in yamlContent['definitions'][Header_key]['items']:
							next3 = yamlContent['definitions'][Header_key]['items']['$ref'].split('/')[-1]
							find_value('',next3)
							# print(Header_key,yamlContent['definitions'][Header_key]['items']['type'])
				if 'properties' in yamlContent['definitions'][Header_key]:
					for elem in yamlContent['definitions'][Header_key]['properties']:
						if '$ref' in yamlContent['definitions'][Header_key]['properties'][elem]:
							next4 = yamlContent['definitions'][Header_key]['properties'][elem]['$ref'].split('/')[-1]
							find_List.append(elem)
							find_value('',next4)
							
		else:
			if type(key) == list and len(key) == 1:
				key = key[0]
			else:
				pass

			if Header_key in yamlContent['definitions']:
					# print(Header_key,yamlContent['definitions'][Header_key]['type'])
				if 'properties' in yamlContent['definitions'][Header_key]:
					next2 = yamlContent['definitions'][Header_key]['properties'][key]['$ref'].split('/')[-1]
					find_value('',next2)
			
	else:
		if '.' in key:
			key = key.split('.')
			i = 0
			for element in key:
				i = i+1
				if element in yamlContent['definitions']:
					Header_key = element
					key = key[i:]
					body_value = ''
					if len(key) > 1:
						for elem in key:
							body_value = body_value+elem+'.'
						if body_value[-1] == '.':
							body_value = body_value[0:-1]
					elif len(key) == 0:
						body_value = ''
					else:
						pass
					find_value(body_value,Header_key)

				elif element[0].upper()+element[1:] in yamlContent['definitions']:
					Header_key = element[0].upper()+element[1:]
					key = key[i:]
					body_value = ''
					if len(key) > 1:
						for elem in key:
							body_value = body_value+elem+'.'
						if body_value[-1] == '.':
							body_value = body_value[0:-1]
					elif len(key) == 0:
						body_value = ''
					else:
						pass
					find_value(body_value,Header_key)


		else:
			pass
	return find_List

def data_value(content,response,main_Key,response_key):
	
	# if type(response) == dict:
	# 	for key,value in response.items():
	# 		if type(value) == unicode or type(value) == str or type(value) == int:
	# 			data_value_List.append(main_Key +'.'+ key)
	# 		else:
	# 			data_value(value,main_Key+'.'+key,data_value_List)

	# if type(response) == list:
	# 	for element in response:
	# 		if type(element) == unicode or type(element) == str or type(element) == int:
	# 			data_value_List.append(main_Key)

	# 		else:
	# 			data_value(element,main_Key,data_value_List)

	# return data_value_List
	if type(response) == dict:
		for key,value in response.items():
			if value == None:
				dataType = find_dataType(key,main_Key,response_key)
				if type(dataType) == list:
					for element in dataType:
						if type(element) == dict:
							perfect_value = ''
							if '.' in main_Key:
								values = main_Key.split('.')
								for element1 in values:
									perfect_value = perfect_value+ "['" + element1 + "']"
							perfect_value = perfect_value + "['" + key +"']"
							innerValue = element['name']
							dataType1  = element['Dtype']
							if dataType1 == 'string':
								data = space*2+"pm.expect(jsonData[i]"+ perfect_value +"['" + innerValue + "']).to.not.be.a('number');"
								if data not in content['events'][0]['script']['exec']:
									content['events'][0]['script']['exec'].append(data)
							elif dataType1 == 'integer' or dataType == 'number':
								data = space*2+"pm.expect(jsonData[i]"+ perfect_value +"['" + innerValue + "']).to.be.a('number');"
								if data not in content['events'][0]['script']['exec']:
									content['events'][0]['script']['exec'].append(data)
			if type(value) == str or type(value) == unicode or type(value) == int:
				if '.' in main_Key:
					dataType = find_dataType(key,main_Key,response_key)
					# print(key,main_Key,dataType)
					# print('\n')
					if dataType!= None:
						perfect_value = ''
						key_list = main_Key.split('.')
						for val in key_list:
							if val == 'j' or val == 'k':
								perfect_value = perfect_value + "["+val+"]"
							else:
								perfect_value = perfect_value + "['"+val+"']"
						if '.' in dataType:
							varList = dataType.split('.')
							dataType = varList[-1]
							varList.remove(dataType)
							for var in varList:
								perfect_value = perfect_value+"['"+var+"']"

						if dataType == 'string':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value +"['" + key + "']).to.not.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)
						elif dataType == 'integer' or dataType == 'number':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value +"['" + key + "']).to.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)

						elif dataType == 'array_integer' or dataType == 'array_string':
							array_value = chr(106)
							if array_value in perfect_value:
								odr1 = ord(array_value)
								array_value = chr(odr1+1)

							perfect_value = perfect_value+"['"+ key + "']"

							data = space*2+"for ("+ array_value +" = 0; "+ array_value +" < jsonData[i]"+ perfect_value +".length; "+ array_value +"++) {"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)

							dataType1 = dataType.split('_')[-1]
							data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]).to.be.a('"+dataType1+"');"
							if data1 not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data1)
								content['events'][0]['script']['exec'].append(space*2+"}")

						elif type(dataType) == dict:
							if dataType['type'] == 'array':
								array_value = chr(106)
								if array_value in perfect_value:
									odr1 = ord(array_value)
									array_value = chr(odr1+1)

								perfect_value = perfect_value+"['"+ key + "']"

								data = space*2+"for ("+ array_value +" = 0; "+ array_value +" < jsonData[i]"+ perfect_value +".length; "+ array_value +"++) {"
								if data not in content['events'][0]['script']['exec']:
									content['events'][0]['script']['exec'].append(data)

								for tag in dataType['tags']:
									inner_tag = tag['name']
									dataType1 = tag['Dtype']
									if dataType1 == 'integer':
										dataType1 = 'number'
									final_tag = ''
									if '.' in inner_tag:
										inner_tag = inner_tag.split('.')
										for item in inner_tag:
											if "['"+item+"']" in perfect_value:
												pass
											else:
												final_tag = final_tag+"['"+item+"']"
									else:
										final_tag = "['"+inner_tag+"']"
									data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]"+final_tag+").to.be.a('"+dataType1+"');"
									if data1 not in content['events'][0]['script']['exec']:
										content['events'][0]['script']['exec'].append(data1)
								content['events'][0]['script']['exec'].append(space*2+"}")	
						else:
							pass

				else:
					dataType = find_dataType(key,main_Key,response_key)
					if dataType == None:
						dataType1 = find_dataType(main_Key,key,response_key)
						if dataType1 == None:
							pass
							# print(key,main_Key,value)
						else:
							dataType = dataType1
					if dataType != None:
						if key == main_Key:
							perfect_value = "['" + main_Key + "']"
						else:
							perfect_value = "['"+ main_Key +"']['" + key + "']"
						if '.' in dataType:
							varList = dataType.split('.')
							dataType = varList[-1]
							varList.remove(dataType)
							for var in varList:
								perfect_value = perfect_value+"['"+var+"']"

						if dataType == 'string':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value +").to.not.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)
						elif dataType == 'integer' or dataType == 'number':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value + ").to.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)

						elif dataType == 'array_integer' or dataType == 'array_string':
							array_value = chr(106)
							if array_value in perfect_value:
								odr1 = ord(array_value)
								array_value = chr(odr1+1)

							data = space*2+"for ("+ array_value +" = 0; "+ array_value +" < jsonData[i]"+ perfect_value +".length; "+ array_value +"++) {"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)

							dataType1 = dataType.split('_')[-1]
							data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]).to.be.a('"+dataType1+"');"
							if data1 not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data1)

							content['events'][0]['script']['exec'].append(space*2+"}")

						elif type(dataType) == dict:
							if dataType['type'] == 'array':
								array_value = chr(106)
								if array_value in perfect_value:
									odr1 = ord(array_value)
									array_value = chr(odr1+1)

								# perfect_value = perfect_value+"['"+ key + "']"

								data = space*2+"for ("+ array_value +" = 0; "+ array_value +" < jsonData[i]"+ perfect_value +".length; "+ array_value +"++) {"
								if data not in content['events'][0]['script']['exec']:
									content['events'][0]['script']['exec'].append(data)

								for tag in dataType['tags']:
									inner_tag = tag['name']
									dataType1 = tag['Dtype']
									if type(dataType1) != list:
										if dataType1 == 'integer':
											dataType1 = 'number'
										final_tag = ''
										if '.' in inner_tag:
											inner_tag = inner_tag.split('.')
											for item in inner_tag:
												final_tag = final_tag+"['"+item+"']"
										else:
											final_tag = "['"+inner_tag+"']"
										data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]"+final_tag+").to.be.a('"+dataType1+"');"
										if data1 not in content['events'][0]['script']['exec']:
											content['events'][0]['script']['exec'].append(data1)
									else:
										for dType in dataType1:
											inner_tag1 = dType ['name']
											dataType2 = dType ['Dtype']
											if dataType2 == 'integer':
												dataType2 = 'number'
											final_tag = "['"+ inner_tag +"']"
											if '.' in inner_tag1:
												inner_tag1 = inner_tag1.split('.')
												for item in inner_tag1:
													final_tag = final_tag+"['"+item+"']"
											else:
												final_tag = final_tag + "['"+inner_tag1+"']"
											data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]"+final_tag+").to.be.a('"+dataType2+"');"
											if data1 not in content['events'][0]['script']['exec']:
												content['events'][0]['script']['exec'].append(data1)
								content['events'][0]['script']['exec'].append(space*2+"}")
						else:
							pass

			elif type(value) == dict:
				if len(value) > 0:
					if main_Key == key:
						main_Key1 = main_Key
					else:
						main_Key1 = main_Key+'.'+key
					data_value(content,value,main_Key1,response_key)
				else:
					# data_value(content,key,main_Key,response_key)
					dataType = find_dataType(key,main_Key,response_key)
					# print(key,main_Key,response_key,dataType)
					# print('\n')
					if dataType != None:
						perfect_value = ''
						if '.' not in main_Key:
							if key == main_Key:
								perfect_value = "['" + main_Key + "']"
							else:
								perfect_value = "['"+ main_Key +"']['" + key + "']"
						else:
							values = main_Key.split('.')
							for element in values:
								if element == key:
									pass
								else:
									perfect_value = perfect_value + "['" + element + "']"
							perfect_value = perfect_value + "['" + key + "']"

						if '.' in dataType:
							varList = dataType.split('.')
							dataType = varList[-1]
							varList.remove(dataType)
							for var in varList:
								perfect_value = perfect_value+"['"+var+"']"
						if dataType == 'string':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value +").to.not.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)
						elif dataType == 'integer' or dataType == 'number':
							data = space*2+"pm.expect(jsonData[i]"+ perfect_value + ").to.be.a('number');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)
						elif dataType == 'object':
							if "['" + key +"']" in perfect_value:
								perfect_value = perfect_value.split("['" + key +"']")[0]
							data = space*2+"pm.expect(jsonData[i]"+perfect_value+").to.have.property('"+ key +"')"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)


			elif type(value) == list:
				array_value = chr(106)
				perfect_value = ''
				dataType2 = ''
				if '.' in main_Key:
					dataType2 = find_dataType(key,main_Key,response_key)
					if dataType2 != None:
						key_list = main_Key.split('.')
						for val in key_list:
							if val == array_value:
								perfect_value = perfect_value + "["+val+"]"
							else:
								perfect_value = perfect_value + "['"+val+"']"
				else:
					perfect_value = "['"+main_Key+"']"

				if array_value in perfect_value:
					odr1 = ord(array_value)
					array_value = chr(odr1+1)

				perfect_value = perfect_value +"['"+ key +"']"
				data = space*2+"for ("+ array_value +" = 0; "+ array_value +" < jsonData[i]"+ perfect_value +".length; "+ array_value +"++) {"
				if data not in content['events'][0]['script']['exec']:
					content['events'][0]['script']['exec'].append(data)
				# content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['"+ perfect_value +"']['"+ key +"''][j]).to.be.a('number');")
				
				if type(dataType2) == dict:
					for tag in dataType2['tags']:
						inner_tag = tag['name']
						dataType1 = tag['Dtype']
						if type(dataType1) != list:
							if dataType1 == 'integer':
								dataType1 = 'number'
							final_tag = ''
							if '.' in inner_tag:
								inner_tag = inner_tag.split('.')
								for item in inner_tag:
									if "['"+item+"']" in perfect_value:
										pass
									else:
										final_tag = final_tag+"['"+item+"']"
							else:
								final_tag = "['"+inner_tag+"']"
							data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]"+final_tag+").to.be.a('"+dataType1+"');"
							if data1 not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data1)
						else:
							for dType in dataType1:
								inner_tag1 = dType ['name']
								dataType2 = dType ['Dtype']
								if dataType2 == 'integer':
									dataType2 = 'number'
								final_tag = "['"+ inner_tag +"']"
								if '.' in inner_tag1:
									inner_tag1 = inner_tag1.split('.')
									for item in inner_tag1:
										if "['"+item+"']" in perfect_value:
											pass
										else:
											final_tag = final_tag+"['"+item+"']"
								else:
									final_tag = final_tag + "['"+inner_tag1+"']"
								data1 = space*3+"pm.expect(jsonData[i]"+ perfect_value +"["+array_value+"]"+final_tag+").to.be.a('"+dataType2+"');"
								if data1 not in content['events'][0]['script']['exec']:
									content['events'][0]['script']['exec'].append(data1)
				for element in value:
					if type(element) == str or type(element) == unicode or type(element) == int:
						dataType = find_dataType(key,main_Key,response_key)
						if dataType != None:
							if '.' in main_Key:
								dataType = find_dataType(key,main_Key,response_key)
								if dataType != None:
									perfect_value = ''
									key_list = main_Key.split('.')
									for val in key_list:
										if val == 'j' or val == 'k':
											perfect_value = perfect_value + "["+val+"]"
										else:
											perfect_value = perfect_value + "['"+val+"']"
									perfect_value = perfect_value + "['"+ key +"']["+ array_value +"]"
							else:
								if main_Key == key:
									perfect_value = "['"+main_Key+"']"+"["+ array_value +"]"
								else:
									perfect_value = perfect_value + "['"+ key +"']["+ array_value +"]"

							if 'array_' in dataType:
								dataType = dataType.replace('array_','')
							data = space*3+"pm.expect(jsonData[i]"+ perfect_value +").to.be.a('"+dataType+"');"
							if data not in content['events'][0]['script']['exec']:
								content['events'][0]['script']['exec'].append(data)
					else:
						if main_Key == key:
							main_Key1 = main_Key+'.'+array_value
						else:
							main_Key1 = main_Key+'.'+key+'.'+array_value
						data_value(content,element,main_Key1,response_key)
				content['events'][0]['script']['exec'].append(space*2+"}")
	
	if type(response) == list:
		for element in response:
			if type(element) == str or type(element) == unicode or type(element) == int:
				print(element)
			else:
				 data_value(content,element,main_Key,response_key)

	return content

def find_dataType(key,Header_key,response_key):

	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)

	if 'j' in Header_key:
		Header_key = Header_key.replace('.j','')
	if 'k' in Header_key:
		Header_key = Header_key.replace('.k','')

	if '.' not in Header_key:
		if key in yamlContent['definitions']:
			pass
		elif key[0].upper()+key[1:] in yamlContent['definitions']:
			key = key[0].upper()+key[1:] 

		if key in yamlContent['definitions']:
			if 'type' in yamlContent['definitions'][key]:
				if yamlContent['definitions'][key]['type'] == 'array':
					if 'items' in yamlContent['definitions'][key]:
						if 'type' in yamlContent['definitions'][key]['items']:
							type1 = yamlContent['definitions'][key]['items']['type']
							if type1 == 'string' or type1 == 'integer' or type1 == 'number':
								return type1
							else:
								pass
						elif '$ref' in yamlContent['definitions'][key]['items']:
							ref = yamlContent['definitions'][key]['items']['$ref'].split('/')[-1]
							dataType = find_dataType(ref,'',response_key)
							if dataType != None:
								if type(dataType) != list:
									return "array_" + str(dataType)
								else:
									return {"type" : "array" ,"tags" : dataType}
							else:
								pass

				elif yamlContent['definitions'][key]['type'] == 'object':
					if 'properties' in yamlContent['definitions'][key]:
						if Header_key in yamlContent['definitions'][key]['properties']:
							if 'type' in yamlContent['definitions'][key]['properties'][Header_key]:
								type1 = yamlContent['definitions'][key]['properties'][Header_key]['type']
								if type1 == 'string' or type1 == 'integer' or type1 == 'number':
									return type1
								else:
									# print(type1,Header_key,key)
									return ''
							elif '$ref' in yamlContent['definitions'][key]['properties'][Header_key]:
								link = yamlContent['definitions'][key]['properties'][Header_key]['$ref'].split('/')[-1]
								dataType = find_dataType(link,'',response_key)
								if dataType != None:
									return dataType
								else:
									pass

						elif 'self' in yamlContent['definitions'][key]['properties']:
							if '$ref' in yamlContent['definitions'][key]['properties']['self']:
								link = yamlContent['definitions'][key]['properties']['self']['$ref'].split('/')[-1]
								dataType = find_dataType(link,'',response_key)
								if dataType != None:
									return dataType
								else:
									pass
						else:
							innerList = yamlContent['definitions'][key]['properties'].keys()
							final_dict = []
							for inner in innerList:
								if '$ref' in yamlContent['definitions'][key]['properties'][inner]:
									inner_link = yamlContent['definitions'][key]['properties'][inner]['$ref'].split('/')[-1]
									dataType = find_dataType(inner_link,'',response_key)
									if dataType != None:
										tag ={
											"name" : inner,
											"Dtype" : dataType
										}
										if tag not in final_dict:
											final_dict.append(tag) 
									else:
										print(key,Header_key,response_key)
								else:
									# print(type(['definitions'][key]['properties']),key)
									if 'type' in yamlContent['definitions'][key]['properties'][inner]:
										dataType = yamlContent['definitions'][key]['properties'][inner]['type']
										tag ={
												"name" : inner,
												"Dtype" : dataType
										}
										if tag not in final_dict:
											final_dict.append(tag)
							return final_dict
					else:
						if 'type' in yamlContent['definitions'][key]:
							return yamlContent['definitions'][key]['type']
				else:
					dataType = yamlContent['definitions'][key]['type']
					if dataType != None:
						return dataType
					else:
						pass
			elif 'properties' in yamlContent['definitions'][key]:
				innerList = yamlContent['definitions'][key]['properties'].keys()
				final_DT = ''
				final_dict = []
				for inner in innerList:
					if '$ref' in yamlContent['definitions'][key]['properties'][inner]:
						inner_link = yamlContent['definitions'][key]['properties'][inner]['$ref'].split('/')[-1]
						dataType = find_dataType(inner_link,'',response_key)
						if dataType != None and dataType != dict or dataType != list:
							tag ={
								"name" : inner,
								"Dtype" : dataType
							}
							# final_DT = final_DT+'_'+dataType+'.'+inner_link
							if tag not in final_dict:
								final_dict.append(tag)
						else:
							if inner_link in yamlContent['definitions']:
								Giant = yamlContent['definitions'][inner_link]
								if 'properties' in Giant:
									innerList1 = yamlContent['definitions'][inner_link]['properties'].keys()
									final_DT1 = ''
									for inner1 in innerList1:
										if '$ref' in Giant['properties'][inner1]:
											inner_link1 = Giant['properties'][inner1]['$ref'].split('/')[-1]
											dataType1 = find_dataType(inner_link1,'',response_key)
											if dataType1 != None  and dataType1 != dict or dataType1 != list: 
												tag ={
													"name" : inner+'.'+inner1,
													"Dtype" : dataType1
												}
												# final_DT1 = final_DT1+'_'+dataType1+'.'+inner_link1
												if tag not in final_dict:
													final_dict.append(tag)
											else:
												pass
				return final_dict

				# print(final_DT[1:])
		else:
			if response_key in yamlContent['definitions']:
				if 'properties' in yamlContent['definitions'][response_key]:
					if key in yamlContent['definitions'][response_key]['properties']:
						if '$ref' in yamlContent['definitions'][response_key]['properties'][key]:
							link = yamlContent['definitions'][response_key]['properties'][key]['$ref'].split('/')[-1]
							dataType = find_dataType(link,Header_key,response_key)
							if dataType!= None:
								return dataType							
							else:
								pass
								# dataType = find_dataType(link,Header_key,response_key)
								# if dataType != None:
								# 	return dataType
								# else:
								# 	pass
									# print(key,link,Header_key)
					elif Header_key in yamlContent['definitions'][response_key]['properties']:
						if '$ref' in yamlContent['definitions'][response_key]['properties'][Header_key]:
							link = yamlContent['definitions'][response_key]['properties'][Header_key]['$ref'].split('/')[-1]
							dataType = find_dataType(key,link,response_key)
							if dataType!= None:
								# print(key,link,dataType)
								return dataType						
							else:
								pass
						else:
							print(key,Header_key,response_key)
					elif Header_key in yamlContent['definitions']:
						if 'properties' in yamlContent['definitions'][Header_key]:
							if key in yamlContent['definitions'][Header_key]['properties']:
								if '$ref' in yamlContent['definitions'][Header_key]['properties'][key]:
									link = yamlContent['definitions'][Header_key]['properties'][key]['$ref'].split('/')[-1]
									# print(key,Header_key,link)
									if link in yamlContent['definitions']:
										if 'type' in yamlContent['definitions'][link]:
											type1 = yamlContent['definitions'][link]['type']
											if type1 == 'string' or type1 == 'integer' or type1 == 'number':
												return(yamlContent['definitions'][link]['type'])
											elif type1 == 'array':
												if 'items' in yamlContent['definitions'][link]:
													if '$ref' in yamlContent['definitions'][link]['items']:
														ref = yamlContent['definitions'][link]['items']['$ref'].split('/')[-1]
														dataType = find_dataType(ref,'',response_key)
														if dataType != None:
															if type(dataType) != list:
																return "array_" + str(dataType)
															else:
																for element in dataType:
																	element['name'] = key+'.'+element['name']
																return {"type" : "array" ,"tags" : dataType}
														# if dataType != None:
														# 	if type(dataType) != list:
														# 		return "array_" + str(dataType)
														# 	else:
														# 		return {"type" : "array" ,"tags" : dataType}
														# else:
														# 	pass
											elif type1 == 'object':
												if 'properties' not in yamlContent['definitions'][link]:
													return type1
										else:
											print(key,Header_key)
								else:
									if 'type' in yamlContent['definitions'][Header_key]['properties'][key]:
										return yamlContent['definitions'][Header_key]['properties'][key]['type']
						else:
							print(key,Header_key,response_key)
					else:
						if '_' in Header_key:
							Header_key_list = Header_key.split('_')
							if Header_key_list[0] in response_key:
								Header_key_list.remove(Header_key_list[0])
								searchKey = Header_key_list[0]
								if searchKey in yamlContent['definitions'][response_key]['properties']:
									if '$ref' in yamlContent['definitions'][response_key]['properties'][searchKey]:
										link = yamlContent['definitions'][response_key]['properties'][searchKey]['$ref'].split('/')[-1]
										Header_key_list.remove(searchKey)
										for element in Header_key_list:
											link = link + '_' + element
										dataType = find_dataType(key,link,response_key)
										if dataType != None:
											return dataType
								elif searchKey in yamlContent['definitions']:
									if 'properties' in yamlContent['definitions'][searchKey]:
										if '$ref' in yamlContent['definitions'][searchKey]['properties']:
											link = yamlContent['definitions'][searchKey]['properties']['$ref'].split('/')[-1]
											Header_key_list.remove(searchKey)
											for element in Header_key_list:
												link = link + '_' + element
											dataType = find_dataType(key,link,response_key)
											if dataType != None:
												return dataType
							else:
								searchKey = Header_key_list[0]
								if searchKey in yamlContent['definitions']:
									Header_key_list.remove(searchKey)
									searchKey2 = Header_key_list[0]
									Header_key_list.remove(searchKey2)
									if 'properties' in yamlContent['definitions'][searchKey]:
										if searchKey2 in yamlContent['definitions'][searchKey]['properties']:
											if '$ref' in yamlContent['definitions'][searchKey]['properties'][searchKey2]:
												link = yamlContent['definitions'][searchKey]['properties'][searchKey2]['$ref'].split('/')[-1]
												if len(Header_key_list) > 0:
													for element in Header_key_list:
														link = link + '_' + element
												dataType = find_dataType(key,link,response_key)
												if dataType != None:
													return dataType
												else:
													pass
			else:
				pass
				# if '_' in Header_key:
				# 	Header_key_list1 = Header_key.split('_')[0]
				# 	Header_key1 = Header_key.replace(Header_key_list1+'_','')
				# 	# print(key,Header_key1,Header_key_list1)
				# 	# print('\n')
				# 	dataType = find_dataType(key,Header_key1,Header_key_list1)
				# 	if dataType != None:
				# 		return dataType
				# 	else:
				# 		print(key,Header_key1,Header_key_list1)
				# else:
				# 	pass

	elif '.' in Header_key:
		
		dataType = ''
		# dataType = find_dataType(key,'',response_key)
		# if dataType != None:
		# 	return dataType
		# else:
		# 	Header_key1 = Header_key.split('.')
		# 	dataType = find_dataType(Header_key1[-1],key,response_key)
		# 	if dataType != None:
		# 		return(dataType)
		if key in yamlContent['definitions'] or key[0].upper()+key[1:] in yamlContent['definitions']:
			dataType = find_dataType(key,'',response_key)
			if dataType != None:
				return dataType

		elif Header_key in yamlContent['definitions']:
			if 'properties' in yamlContent['definitions'][Header_key]:
				if key in yamlContent['definitions'][Header_key]['properties']:
					if '$ref' in yamlContent['definitions'][Header_key]['properties'][key]:
						link = yamlContent['definitions'][Header_key]['properties'][key]['$ref'].split('/')[-1]
						dataType = find_dataType(link,'',response_key)
						if dataType != None:
							# print(dataType)
							return dataType 
		else:
			Header_key1 = Header_key.split('.')

			sub_key = Header_key1[-1]
			if response_key+'.'+sub_key in yamlContent['definitions'] or response_key+'.'+sub_key[0].upper()+sub_key[1:] in yamlContent['definitions']:
				if response_key+'.'+sub_key in yamlContent['definitions']:
					key1 = response_key+'.'+sub_key
				else:
					key1 = response_key+'.'+sub_key[0].upper()+sub_key[1:]

				dataType1 = find_dataType(key1,key,response_key)

				if dataType1 != None:
					return dataType1

			dataType = find_dataType(Header_key1[-1],key,response_key)
			if dataType != None:
				return(dataType)
			else:
				if '_' not in Header_key:
					Header_key = Header_key.replace('.','_')
					dataType = find_dataType(key,Header_key,response_key)
					if dataType != None:
						return dataType
					else:
						if response_key == '':
							response_key = Header_key.split('_')[0]
						# Header_key = Header_key.replace(response_key+'_','')
						dataType = find_dataType(key,Header_key,response_key)
						if dataType != None:
							return dataType
						else:
							pass
							# print(key,Header_key,response_key)
				else:
					Header_key = Header_key.split('.')
					dataType = find_dataType(Header_key[0],Header_key[1],response_key)
					if dataType != None:
						return dataType
					else:
						pass