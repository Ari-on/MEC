import os,sys
import json
import csv
import yaml

global space
space = "    "

# class excel():

def readExcel(csv_File): #This method will read the Excel file and take the TAG values in list
	jsonfile = './outputFiles/'+csv_File +".json"
	Tag = []
	dataType = []
	subDataType = []
	#yamlFile = csv_File.strip(".csv")+'.yaml'
	yamlFile = './outputFiles/'+csv_File+'.yaml'

	with open('./outputFiles/'+csv_File+'.csv', 'rb') as csvfile:
		spamreader = csv.reader(csvfile)
		for row in spamreader:
			number_of_columns = len(row)
	
			for value1 in row:
				# value1  = (sheet.cell(row,col).value)
				if '.' in value1:
					if value1 in subDataType:
						pass
					else:
						subDataType.append(value1)

				elif value1 not in dataType:
					dataType.append(value1)

	for element in subDataType:
		element = element.split('.')
		for item in element:
			if item not in Tag:
				Tag.append(item)

	Tag = Tag+dataType

	#Passing the list to next Method to change the Postman file
	writePostmanCollection(Tag,dataType,subDataType,yamlFile,jsonfile)
	# excelLoad.writePostmanCollection(Tag,dataType,subDataType)

def writePostmanCollection(Tag,dataType,subDataType,yamlFile,jsonfile):#This will add the 'Tests' and 'Pre-Request' part in postman file

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
				content['method']
				content['events'] = []

				#This is for 'Tests' part
				content['events'].append({ #Default Content for 'Tests'
					"listen": "test",
					"script": {"type": "text/javascript",
					"exec":[]
					}
					})

				statuscode = content['name'].split('_')[1]
				if content['method'] == "GET": #We don't need the following 'Tests' content for GET method
					pass

				else:
					content['events'][0]['script']['exec'].append("var list = pm.environment.get(\"list\");")
					content['events'][0]['script']['exec'].append('var request = pm.environment.get("request");')
					content['events'][0]['script']['exec'].append("")
					content['events'][0]['script']['exec'].append("if(list && list.length > 0){")

					if content['method'] == "PATCH" or content['method'] == "PUT":#Both PUT and PATCH has differend code compared to POST
						content['events'][0]['script']['exec'].append(space+'for(i = 0;i < list.length;i++){')
						content['events'][0]['script']['exec'].append(space*2+'req = {')

						content['events'][0]['script']['exec'].append(space*3+'"'+dataType[0]+'" : list[i].'+dataType[0])

						for j in range (1,len(dataType)):
							content['events'][0]['script']['exec'].append(space*3+',"'+dataType[j]+'" : list[i].'+dataType[j])

						#To add the subDataTypes in postman Tests part request.body
						elementCheck = ''
						for element2 in subDataType:
							contentCheck = 0
							spliting = element2.split('.')[0]
							if elementCheck == spliting:#Checks the repeating subDataType content
								pass
							elif spliting == 'timeStamp' and content['method'] == 'PATCH':#For PATCH we don't have timeStamp
								pass

							else:
								content['events'][0]['script']['exec'].append(space*3+',"'+spliting+'" :{')
								for element3 in subDataType:
									if spliting in element3:
										if contentCheck == 0:#To stop adding ',' for the first content in req.body of Tests part
											content['events'][0]['script']['exec'].append(space*4+'"'+element3.split('.')[1]+'" : list[i]["'+element3+'"]')
											contentCheck = 1
										else:
											content['events'][0]['script']['exec'].append(space*4+',"'+element3.split('.')[1]+'" : list[i]["'+element3+'"]')
									else:
										pass
								content['events'][0]['script']['exec'].append(space*3+'}')	
								elementCheck = spliting;

						#Adding 'sendRequest' part in 'Tests'
						content['events'][0]['script']['exec'].append(space*2+'};')
						content['events'][0]['script']['exec'].append(space*2+'pm.sendRequest({')
						content['events'][0]['script']['exec'].append(space*3+'url: request,')
						content['events'][0]['script']['exec'].append(space*3+"method: '"+content['method']+"',")
						content['events'][0]['script']['exec'].append(space*3+'header: {')
						content['events'][0]['script']['exec'].append(space*4+'"Content-Type": "application/json",')
						content['events'][0]['script']['exec'].append(space*4+'"accept": "application/json"')
						content['events'][0]['script']['exec'].append(space*3+'},')
						content['events'][0]['script']['exec'].append(space*3+'body: {')
						content['events'][0]['script']['exec'].append(space*4+"mode: 'raw',")
						content['events'][0]['script']['exec'].append(space*4+'raw: JSON.stringify(req)')
						content['events'][0]['script']['exec'].append(space*3+'}')
						content['events'][0]['script']['exec'].append(space*2+'},function (err, res) {')
						content['events'][0]['script']['exec'].append(space*3+'var response_json = res.json();')
						content['events'][0]['script']['exec'].append(space*3+'var jsonData = response_json;')
						content['events'][0]['script']['exec'].append(space*3+'pm.test("Status code is -  "'+"+ jsonData['statuscode'] , function() {")
						content['events'][0]['script']['exec'].append(space*4+ "pm.expect(jsonData['statuscode']).to.be.eql(" + statuscode + ")")
						content['events'][0]['script']['exec'].append(space*3+'});')
						content['events'][0]['script']['exec'].append('')

						content['events'][0]['script']['exec'].append(space*3+'pm.test("Body matches string", function () {')

						for x in Tag: #Adding the TAG values for validation
							content['events'][0]['script']['exec'].append(space*4+"pm.expect(pm.response.text()).to.include(\""+ x +"\""");")
						content['events'][0]['script']['exec'].append(space*3+"});")
						content['events'][0]['script']['exec'].append("")
						content['events'][0]['script']['exec'].append(space*3+"pm.test(\"isString\" ,function() {")
						content['events'][0]['script']['exec'].append(space*4+"var jsonData = response_json;")
						content['events'][0]['script']['exec'].append(space*4+"for (i = 0; i < jsonData.length; i++) {")

						for DT in dataType:#Adding DataTypes for validation 
							DT2 = DT[0].upper()+DT[1:]
							dataVal = yamlContent['definitions'][DT2]['type']

							if dataVal == 'string':
								content['events'][0]['script']['exec'].append(space*5+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.not.be.a('number');")
							elif dataVal == 'integer':
								content['events'][0]['script']['exec'].append(space*5+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.be.a('number');")

						innerSDT = []
						for SDT in subDataType:#For SubDataTypes
							SDT = SDT.split('.')
							if SDT[0] not in innerSDT:
								innerSDT.append(SDT[0])

						for element in innerSDT:

							DT1 = element[0].upper()+element[1:]
							try:
								mainVal = yamlContent['definitions'][DT1]['type']

								if mainVal == 'object':
									for SDT in subDataType:#For SubDataTypes
										SDT = SDT.split('.')
										if element == SDT[0]:						
											mainContent = ''
											for data in SDT:
												mainContent = mainContent+"['"+data+"']"

											DT2 = SDT[1][0].upper()+SDT[1][1:]
											dataVal = yamlContent['definitions'][DT2]['type']

											if dataVal == 'string':
												content['events'][0]['script']['exec'].append(space*5+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.not.be.a('number');")	
											elif dataVal == 'integer':
												content['events'][0]['script']['exec'].append(space*5+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.be.a('number');")	
											elif dataVal == 'array':
												innerVal = yamlContent['definitions'][DT2]['items']['type']
												content['events'][0]['script']['exec'].append(space*5+"for (k = 0; k < jsonData[i]['bwInfo']"+ mainContent +".length; k++) {")
												content['events'][0]['script']['exec'].append(space*6+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +"[k]).to.be.a('"+innerVal+"');")
												content['events'][0]['script']['exec'].append(space*6+"}")
												
								elif mainVal == 'array':
									content['events'][0]['script']['exec'].append(space*5+"for (j = 0; j < jsonData[i]['bwInfo']['"+element+"'].length; j++) {")
									for SDT in subDataType:#For SubDataTypes
										SDT = SDT.split('.')
										if element == SDT[0]:
											DT2 = SDT[1][0].upper()+SDT[1][1:]
											dataVal = yamlContent['definitions'][DT2]['type']

											if dataVal == 'string':
												content['events'][0]['script']['exec'].append(space*6+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.not.be.a('number');")
											elif dataVal == 'integer':
												content['events'][0]['script']['exec'].append(space*6+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.be.a('number');")
											elif dataVal == 'array':
												content['events'][0]['script']['exec'].append(space*6+"for (k = 0; k < jsonData[i]['bwInfo']['"+SDT[0]+"'][j]['"+SDT[1]+"'].length; k++) {")
												innerVal = yamlContent['definitions'][DT2]['items']['type']
												content['events'][0]['script']['exec'].append(space*7+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"'][k]).to.be.a('"+innerVal+"');")
												content['events'][0]['script']['exec'].append(space*6+"}")
									content['events'][0]['script']['exec'].append(space*5+"}")
							except:
								pass
						content['events'][0]['script']['exec'].append(space*4+"}")
						content['events'][0]['script']['exec'].append(space*3+"});")
						content['events'][0]['script']['exec'].append(space*2+"});")
						content['events'][0]['script']['exec'].append(space+"}")
						content['events'][0]['script']['exec'].append("}")

					else:	
						content['events'][0]['script']['exec'].append(space+"postman.setNextRequest(request)")	
						content['events'][0]['script']['exec'].append("}")
					
					content['events'][0]['script']['exec'].append("else{")
					content['events'][0]['script']['exec'].append(space+"postman.setNextRequest();")
					content['events'][0]['script']['exec'].append("}")
					content['events'][0]['script']['exec'].append("")

				#Default content for 'Tests'
				content['events'][0]['script']['exec'].append("var jsonData = pm.response.json();")
				content['events'][0]['script']['exec'].append("pm.test(\"Status code is -  \"+ jsonData['statuscode'] , function() {")
				content['events'][0]['script']['exec'].append(space + "pm.expect(jsonData['statuscode']).to.be.eql(" + statuscode + ")")
				content['events'][0]['script']['exec'].append("});",)
				content['events'][0]['script']['exec'].append("")
				content['events'][0]['script']['exec'].append("pm.test(\"Body matches string\", function () {")

				for x in Tag: #Adding the TAG values
					content['events'][0]['script']['exec'].append(space+"pm.expect(pm.response.text()).to.include(\""+ x +"\""");")
				content['events'][0]['script']['exec'].append("});")
				content['events'][0]['script']['exec'].append("")
				content['events'][0]['script']['exec'].append("pm.test(\"isString\" ,function() {")
				content['events'][0]['script']['exec'].append(space+"var jsonData = pm.response.json();")
				content['events'][0]['script']['exec'].append(space+"for (i = 0; i < jsonData.length; i++) {")

				for DT in dataType:#Adding DataTypes for validation 
					DT2 = DT[0].upper()+DT[1:]
					dataVal = yamlContent['definitions'][DT2]['type']

					if dataVal == 'string':
						content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.not.be.a('number');")
					elif dataVal == 'integer':
						content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']['" + DT + "']).to.be.a('number');")

				innerSDT = []
				for SDT in subDataType:#For SubDataTypes
					SDT = SDT.split('.')
					if SDT[0] not in innerSDT:
						innerSDT.append(SDT[0])

				for element in innerSDT:

					DT1 = element[0].upper()+element[1:]
					try:
						mainVal = yamlContent['definitions'][DT1]['type']
						if mainVal == 'object':
							for SDT in subDataType:#For SubDataTypes
								SDT = SDT.split('.')
								if element == SDT[0]:						
									mainContent = ''
									for data in SDT:
										mainContent = mainContent+"['"+data+"']"

									DT2 = SDT[1][0].upper()+SDT[1][1:]
									dataVal = yamlContent['definitions'][DT2]['type']

									if dataVal == 'string':
										content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.not.be.a('number');")	
									elif dataVal == 'integer':
										content['events'][0]['script']['exec'].append(space*2+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +").to.be.a('number');")	
									elif dataVal == 'array':
										innerVal = yamlContent['definitions'][DT2]['items']['type']
										content['events'][0]['script']['exec'].append(space*2+"for (k = 0; k < jsonData[i]['bwInfo']"+ mainContent +".length; k++) {")
										content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']"+ mainContent +"[k]).to.be.a('"+innerVal+"');")
										content['events'][0]['script']['exec'].append(space*2+"}")
						elif mainVal == 'array':
							content['events'][0]['script']['exec'].append(space*2+"for (j = 0; j < jsonData[i]['bwInfo']['"+element+"'].length; j++) {")
							for SDT in subDataType:#For SubDataTypes
								SDT = SDT.split('.')
								if element == SDT[0]:
									DT2 = SDT[1][0].upper()+SDT[1][1:]
									dataVal = yamlContent['definitions'][DT2]['type']

									if dataVal == 'string':
										content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.not.be.a('number');")
									elif dataVal == 'integer':
										content['events'][0]['script']['exec'].append(space*3+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"']).to.be.a('number');")
									elif dataVal == 'array':
										content['events'][0]['script']['exec'].append(space*3+"for (k = 0; k < jsonData[i]['bwInfo']['"+SDT[0]+"'][j]['"+SDT[1]+"'].length; k++) {")
										innerVal = yamlContent['definitions'][DT2]['items']['type']
										content['events'][0]['script']['exec'].append(space*4+"pm.expect(jsonData[i]['bwInfo']['" + SDT[0]+"'][j]['"+SDT[1]+"'][k]).to.be.a('"+innerVal+"');")
										content['events'][0]['script']['exec'].append(space*3+"}")
							content['events'][0]['script']['exec'].append(space*2+"}")
					except:
						pass
				content['events'][0]['script']['exec'].append(space+"}")
				content['events'][0]['script']['exec'].append("});")

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
					list1 = req_body(key,value,final_List)
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

def req_body(main_Key,dict_value,final_List):

	if type(dict_value) == dict:
		for key,value in dict_value.items():
			if type(value) == unicode:
				value = value.replace('{{','')
				value = value.replace('}}','')
				final_List.append(main_Key +'.'+ value)
			else:
				req_body(main_Key+'.'+key,value,final_List)

	if type(dict_value) == list:
		for element in dict_value:
			if type(element) == unicode:
				final_List.append(main_Key)

			else:
				req_body(main_Key,element,final_List)

	return final_List


