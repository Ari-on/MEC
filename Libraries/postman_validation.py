import os,sys
import json
import csv
import yaml

global space
space = "    "
yamlFile = ''
find_List = []

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

	global find_List
	rowNo = 0
	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)
	JsonFile = open(jsonfile,'r+')
	jsonContent = json.load(JsonFile)

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
				
				value_List = []
				dict_List  = []
				for element in response_list:
					data_value_list = []
					if element['main_Key'] not in value_List:
						value_List.append(element['main_Key'])
					if '{' not in element['api'] and '/:' not in url:
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url
						if element['api'] in url1 and element['method'].upper() == content['method']:
							main_list = data_value(content,element['response'],element['main_Key'],data_value_list)
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
						# print(value_List)

					elif '{' in element['api'] and '/:' in url:
						api = element['api'].replace('{',':')
						api = api.replace('}','')
						if '/' in api[-1]:
							api = api[:-1]
						if '?' in url:
							url1 = url.split('?')[0]
						else:
							url1 = url
						if api in url1 and element['method'].upper() == content['method']:
							main_list = data_value(content,element['response'],element['main_Key'],data_value_list)
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
									# print(list2)
									for elem in list2:
										if '.' in elem:
											elem = elem.split('.')
											for i in elem:
												if i not in value_List:
													value_List.append(i)
										else:
											if elem not in value_List:
												value_List.append(elem)
							
							# print(value_List)
				# Default content for 'Tests'
				content['events'][0]['script']['exec'].append("pm.test(\"Body matches string\", function () {")

				for x in value_List: #Adding the TAG values
					content['events'][0]['script']['exec'].append(space+"pm.expect(pm.response.text()).to.include(\""+ x +"\""");")
				content['events'][0]['script']['exec'].append("});")
				content['events'][0]['script']['exec'].append("")

				# content['events'][0]['script']['exec'].append("pm.test(\"isString\" ,function() {")
				# content['events'][0]['script']['exec'].append(space+"var jsonData = pm.response.json();")
				# content['events'][0]['script']['exec'].append(space+"for (i = 0; i < jsonData.length; i++) {")

					# elif '{' in element['api'] and '/:' in url:
					# 	api = element['api'].replace('{',':')
					# 	api = api.replace('}','')
					# 	if '/' in api[-1]:
					# 		api = api[:-1]
					# 	if '?' in url:
					# 		url1 = url.split('?')[0]
					# 	else:
					# 		url1 = url
					# 	if api in url1 and element['method'].upper() == content['method']:
				# content['events'][0]['script']['exec'].append("pm.test(\"isString\" ,function() {")
				# content['events'][0]['script']['exec'].append(space+"var jsonData = pm.response.json();")
				# content['events'][0]['script']['exec'].append(space+"for (i = 0; i < jsonData.length; i++) {")

				# for DT in dataType:#Adding DataTypes for validation 
				# 	DT2 = DT[0].upper()+DT[1:]
				# 	dataVal = yamlContent['definitions'][DT2]['type']

				# 	if dataVal == 'string':
				# 		content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.not.be.a('number');")
				# 	elif dataVal == 'integer':
				# 		content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.be.a('number');")

				# innerSDT = []
				# for SDT in subDataType:#For SubDataTypes
				# 	SDT = SDT.split('.')
				# 	if SDT[0] not in innerSDT:
				# 		innerSDT.append(SDT[0])

				# for element in innerSDT:

				# 	DT1 = element[0].upper()+element[1:]
				# 	try:
				# 		mainVal = yamlContent['definitions'][DT1]['type']
				# 		if mainVal == 'object':
				# 			for SDT in subDataType:#For SubDataTypes
				# 				SDT = SDT.split('.')
				# 				if element == SDT[0]:						
				# 					mainContent = ''
				# 					for data in SDT:
				# 						mainContent = mainContent+"['"+data+"']"

				# 					DT2 = SDT[1][0].upper()+SDT[1][1:]
				# 					dataVal = yamlContent['definitions'][DT2]['type']

				# 					if dataVal == 'string':
				# 						content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.not.be.a('number');")	
				# 					elif dataVal == 'integer':
				# 						content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.be.a('number');")	
				# 					elif dataVal == 'array':
				# 						innerVal = yamlContent['definitions'][DT2]['items']['type']
				# 						content['events'][0]['script']['exec'].append(space*2+"for (k = 0; k < jsonData[i]['bwInfo']"+ mainContent +".length; k++) {")
				# 						content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +"[k]).to.be.a('"+innerVal+"');")
				# 						content['events'][0]['script']['exec'].append(space*2+"}")
				# 		elif mainVal == 'array':
				# 			content['events'][0]['script']['exec'].append(space*2+"for (j = 0; j < jsonData[i]['bwInfo']['"+element+"'].length; j++) {")
				# 			for SDT in subDataType:#For SubDataTypes
				# 				SDT = SDT.split('.')
				# 				if element == SDT[0]:
				# 					DT2 = SDT[1][0].upper()+SDT[1][1:]
				# 					dataVal = yamlContent['definitions'][DT2]['type']

				# 					if dataVal == 'string':
				# 						content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.not.be.a('number');")
				# 					elif dataVal == 'integer':
				# 						content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.be.a('number');")
				# 					elif dataVal == 'array':
				# 						content['events'][0]['script']['exec'].append(space*3+"for (k = 0; k < jsonData[i]['bwInfo']['"+SDT[0]+"'][j]['"+SDT[1]+"'].length; k++) {")
				# 						innerVal = yamlContent['definitions'][DT2]['items']['type']
				# 						content['events'][0]['script']['exec'].append(space*4+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"'][k]).to.be.a('"+innerVal+"');")
				# 						content['events'][0]['script']['exec'].append(space*3+"}")
				# 			content['events'][0]['script']['exec'].append(space*2+"}")
				# 	except:
				# 		pass
				# content['events'][0]['script']['exec'].append(space+"}")
				# content['events'][0]['script']['exec'].append("});")

		#This is for 'Pre-Request' Part	
		#We don't need 'Pre-Request' for GET..
	
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

		content['events'].append({   #Default content for 'Pre-Requests'
			"listen": "prerequest",
			"script": {"type": "text/javascript",
			"exec":[
			space*1+"var list = [];",
			space*1+"pm.sendRequest({",
			space*1+"url: 'localhost:8081/read_Excel/"+str(rowNo)+"',",
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
			

		# for DT in dataType: #Adding DataType
		# 	content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+DT+'"'+",currentData."+DT+");")

		# for SDT in subDataType:#For SubDataType
		# 	SDT = SDT.split('.')
		# 	if content['method'] == 'PATCH' and SDT[0] == 'timeStamp':#For PATCH we don't have timeStamp
		# 		pass

		# 	else:
		# 		content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+SDT[1]+'"'+',currentData["'+SDT[0]+'.'+SDT[1]+'"]);')

		# content['events'][eventCheck]['script']['exec'].append("")
		# content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set(\"list\",list);")
		# content['events'][eventCheck]['script']['exec'].append("});")
		# content['events'][eventCheck]['script']['exec'].append("}")

		# if content['method'] == 'PATCH' or content['method'] == 'PUT':
		# 	pass

		# else:
		# 	content['events'][eventCheck]['script']['exec'].append("else {")
		# 	content['events'][eventCheck]['script']['exec'].append(space+"var currentData = list.shift();")

		# 	for DT in dataType:
		# 		content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+DT+'"'+",currentData."+DT+");")

		# 	for SDT in subDataType:
		# 		SDT = SDT.split('.')
		# 		content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set("+'"'+SDT[1]+'"'+',currentData["'+SDT[0]+'.'+SDT[1]+'"]);')

		# 	content['events'][eventCheck]['script']['exec'].append("")
		# 	content['events'][eventCheck]['script']['exec'].append(space+"pm.environment.set(\"list\",list);")
		# 	content['events'][eventCheck]['script']['exec'].append("}")

		# # if ':' in setNextRequest:#This is only for the Requests which has params in req
		# content['events'][eventCheck]['script']['exec'].append("var request = request.url;")
		# content['events'][eventCheck]['script']['exec'].append('pm.environment.set("request",request);')

	write_req_body(jsonContent,dataType,subDataType,jsonfile)


def write_req_body(jsonContent,dataType,subDataType,jsonfile):

	# for content in jsonContent['requests']:
	# 	if content['rawModeData'] == None:
	# 		pass

	# 	else:
	# 		rawModeData = json.loads(content['rawModeData'])
	# 		content['rawModeData'] = '{\n'
	# 		tagCheck = len(rawModeData)
	# 		for tag in rawModeData:
	# 			if type(rawModeData[tag]) == list:
	# 				content['rawModeData'] = content['rawModeData']+space+'"'+tag+'": [\n'+space*2+'{\n'

	# 				for item in rawModeData[tag]:
	# 					lengthCheck = len(item)
	# 					for item2 in item:
	# 						if type(item[item2]) == list:
	# 							if lengthCheck == 1:
	# 								content['rawModeData'] = content['rawModeData']+space*2+'"'+item2+'": ["{{'+item2+'}}"]'+'\n'
	# 							else:
	# 								content['rawModeData'] = content['rawModeData']+space*2+'"'+item2+'": ["{{'+item2+'}}"],'+'\n'
	# 						else:
	# 							if lengthCheck == 1:
	# 								content['rawModeData'] = content['rawModeData']+space*2+'"'+item2+'": "{{'+item2+'}}"'+'\n'
	# 							else:
	# 								content['rawModeData'] = content['rawModeData']+space*2+'"'+item2+'": "{{'+item2+'}}",'+'\n'

	# 						lengthCheck = lengthCheck - 1

	# 				content['rawModeData'] = content['rawModeData']+space*2+'}\n'+space+'],\n'
	# 			elif len(rawModeData[tag]) > 0:
	# 				content['rawModeData'] = content['rawModeData']+space+'"'+tag+'": {\n'
	# 				lengthCheck = len(rawModeData[tag])

	# 				for tag2 in rawModeData[tag]:
	# 					if lengthCheck == 1:
	# 						content['rawModeData'] = content['rawModeData']+space*2+'"'+tag2+'": "{{'+tag2+'}}"'+'\n'+space+'},\n'
	# 					else:
	# 						content['rawModeData'] = content['rawModeData']+space*2+'"'+tag2+'": "{{'+tag2+'}}",'+'\n'

	# 					lengthCheck = lengthCheck - 1

	# 			else:
	# 				if tagCheck == 1:
	# 					content['rawModeData'] = content['rawModeData']+space+'"'+tag+'": "{{'+tag+'}}"\n'
	# 				else:
	# 					content['rawModeData'] = content['rawModeData']+space+'"'+tag+'": "{{'+tag+'}}",'+'\n'

	# 			tagCheck = tagCheck - 1

	# 		content['rawModeData'] = content['rawModeData']+'}'


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
						elif 'type' in yamlContent['definitions'][Header_key]['items']:
							pass
							# print(Header_key,yamlContent['definitions'][Header_key]['items']['type'])
				if 'properties' in yamlContent['definitions'][Header_key]:
					for elem in yamlContent['definitions'][Header_key]['properties']:
						next4 = yamlContent['definitions'][Header_key]['properties'][elem]['$ref'].split('/')[-1]
						find_List.append(elem)
						find_value('',next4)
							
		else:
			if type(key) == list and len(key) == 1:
				key = key[0]
			else:
				pass

			if Header_key in yamlContent['definitions']:
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
						body_value = key[0]
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

def data_value(content,response,main_Key,data_value_List):
	if type(response) == int or type(response) == str or type(response) == unicode:
		if main_Key not in data_value_List:
			data_value_List.append(main_Key)
		# pass
		# find_value(main_Key,'')
	elif type(response) == dict:
		for key,value in response.items():
			if key == main_Key:
				data_value(content,value,key,data_value_List)
			else:
				data_value(content,value,main_Key +'.'+ key,data_value_List)
	elif type(response) == list:
		for elem in response:
			if type(elem) == str or type(elem) == int:
				if main_Key not in data_value_List:
					data_value_List.append(main_Key)
			else:
				data_value(content,elem,main_Key,data_value_List)
	return data_value_List


