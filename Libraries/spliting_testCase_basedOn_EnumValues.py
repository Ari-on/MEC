import sys, yaml, json
import os

def split_testCases_using_Enum(yamalfile,jsonFile):
	enumList =[]
	with open(yamalfile) as file:
		data = yaml.load(file)
		defInfo = data["definitions"]
		for defn in defInfo: 
			TagInfo = defInfo[defn]
			if "enum" not in TagInfo:
				pass
			else:
				enumInfo = TagInfo['enum']
				for enum in enumInfo:
					if "=" in enum:
						enum = enum.split('=')[0]
						enumList.append(enum)
					#else:
						#print enum
	JsonFile = open('./outputFiles/'+ jsonFile,'r+')
	jsonContent = json.load(JsonFile)
	alter = []
	insertContent = []
	enumList =  list(set(enumList))
	for i in range (0,len(enumList)):
		JsonFile = open('./outputFiles/'+jsonFile,'r+')
		readContent = json.load(JsonFile)
		JsonFile.close()
		for content in readContent['requests']:
			if 'name' not in content:
				pass
			else:
				if '200'in content['name']:
					content['name'] = "TC_"+str(enumList[i])
					alter.append(content.copy())
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
		jsonContent['requests'].append(datum)

	with open('./outputFiles/'+jsonFile, 'w') as outfile:
		json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)