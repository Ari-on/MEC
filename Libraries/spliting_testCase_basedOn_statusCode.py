import sys, yaml, json
import os
import ErrorCode

def split_testCases_using_status(yamalfile,jsonFile):
	getStatusCodeList = []
	postStatusCodeList = []
	putStatusCodeList =[]
	deleteStatusCodeList = []
	patchStatusCodeList =[]

	with open(yamalfile) as file:
		data = yaml.load(file)
		pathInfo = data["paths"]
		for path in pathInfo:
			methodInfo = pathInfo[path]
			for methods in methodInfo:
				status = methodInfo[methods]["responses"]
				if methods == "get":
					for getstatusCode in status:
						getStatusCodeList.append(getstatusCode)
				if methods == "post":
					for poststatusCode in status:
						postStatusCodeList.append(poststatusCode)
				if methods == "put":
					for putstatusCode in status:
						putStatusCodeList.append(putstatusCode)
				if methods == "patch":
					for patchstatusCode in status:
						patchStatusCodeList.append(patchstatusCode)
				if methods == "delete":
					for deletestatusCode in status:
						deleteStatusCodeList.append(deletestatusCode)


	JsonFile = open('./outputFiles/'+ jsonFile,'r+')
	jsonContent = json.load(JsonFile)
	alter = []
	insertContent = []
	getStatusCodeList =  list(set(getStatusCodeList))
	postStatusCodeList = list(set(postStatusCodeList))
	putStatusCodeList = list(set(putStatusCodeList))
	deleteStatusCodeList = list(set(deleteStatusCodeList))
	patchStatusCodeList = list(set(patchStatusCodeList))

	for i in range (0,len(getStatusCodeList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')
		readContent = json.load(JsonFile)
		JsonFile.close()
		for content1 in readContent['requests']:
			content1['name'] = "TC_"+str(getStatusCodeList[i])
			# print content1['name']
			if (content1['method'] == 'GET'):
				alter.append(content1.copy())
	for i in range (0,len(postStatusCodeList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')

		readContent = json.load(JsonFile)
		JsonFile.close()
		for content1 in readContent['requests']:
			content1['name'] = "TC_"+str(postStatusCodeList[i])
			if (content1['method'] == 'POST'):
				alter.append(content1.copy())

	for i in range (0,len(putStatusCodeList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')

		readContent = json.load(JsonFile)
		JsonFile.close()
		for content1 in readContent['requests']:
			content1['name'] = "TC_"+str(putStatusCodeList[i])
			if (content1['method'] == 'PUT'):
				alter.append(content1.copy())

	for i in range (0,len(deleteStatusCodeList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')

		readContent = json.load(JsonFile)
		JsonFile.close()
		for content1 in readContent['requests']:
			content1['name'] = "TC_"+str(deleteStatusCodeList[i])
			if (content1['method'] == "DELETE"):
				# print content1['method']
				alter.append(content1.copy())

	for i in range (0,len(patchStatusCodeList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')

		readContent = json.load(JsonFile)
		JsonFile.close()
		for content1 in readContent['requests']:
			content1['name'] = "TC_"+str(patchStatusCodeList[i])
			if (content1['method'] == 'PATCH'):
				alter.append(content1.copy())

	for i in range (0,len(alter)):
		alterContent = alter[i].copy()
		searchId = alterContent['id']
		currentId = alterContent['id']+str(i)
		alterContent['id'] = currentId

		for folder in jsonContent["folders"]:
			if searchId in folder["order"]:
				folder["order"].append(currentId)

		insertContent.append(alterContent)

	for datum in insertContent:
		changedDatum = ErrorCode.changeContent(datum)
		if changedDatum == None:
			changedDatum = datum
		else:
			pass
		jsonContent['requests'].append(changedDatum)

	with open('./outputFiles/'+jsonFile, 'w') as outfile:
		json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)
