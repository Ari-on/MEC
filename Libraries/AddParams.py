import os,sys
import json
import csv
import yaml


def readYaml(fileName): 

	queryList = {}
	yamlFile = './outputFiles/'+fileName+'.yaml'

	swaggerFile = open(yamlFile,'r')
	yamlContent = yaml.load(swaggerFile)

	for api in yamlContent['paths']:
		for method in yamlContent['paths'][api]:
			for element in yamlContent['paths'][api][method]['parameters']:
				if element['in'] == 'path' or element['in'] == 'query':
					if api not in queryList:
						queryList[api] = []

					if element['name'] not in queryList[api]:
						queryList[api].append(element['name'])

	alterJson(fileName,queryList)

def alterJson(fileName,queryList):
	jsonFile = './outputFiles/'+fileName+'.json'
	JsonFile = open(jsonFile,'r+')
	jsonContent = json.load(JsonFile)

	rawModeData = ''
	for content in jsonContent['requests']:
		if content['method'] == 'POST':
			for element in queryList:
				api = element
				dubElement = element.split('/')
				for param in dubElement:
					if '{' in param:
						api = api.replace('/'+param,'')
				duburl = content['url'].split('/')
				url = content['url']
				for param in duburl:
					if ':' in param:
						url = url.replace('/'+param,'')

				if type(content['rawModeData']) == unicode or type(content['rawModeData']) == str:
					rawModeData = json.loads(content['rawModeData'])
					if api in url:
						for parameter in queryList[element]:
							if parameter in content['rawModeData']:
								pass
							else:
								if parameter not in rawModeData:
									crctParam = parameter.replace('.','-')
									crctParam = crctParam.replace('_','-')
									rawModeData[parameter] = '{'+'{'+crctParam+'}'+'}'
				
					content['rawModeData'] = json.dumps(rawModeData,indent=4, ensure_ascii=False).encode('utf-8')

				else:
					print(type(content['rawModeData']))

	write_req_body(jsonFile,jsonContent)

def write_req_body(jsonFile,jsonContent):

	with open(jsonFile, 'w') as outfile:
		json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)



			# if type(content['rawModeData']) == unicode:
			# rawModeData = json.loads(content['rawModeData'])
			# for key,value in rawModeData.items():
			# 	if type(value) == unicode:
			# 		value = value.replace('{{','')
			# 		value = value.replace('}}','')
			# 		raw_List.append(value)
			# 	else:
			# 		list1 = req_body(key,value,final_List,'')
			# 		for element in list1:
			# 			if element not in raw_List:
			# 				raw_List.append(element)

	# file = open(csvFile,'r')

	# data = csv.reader(file)
	# csv_List = []
	# for row in data:
	# 	csv_List.append(row)

	# csv_List = csv_List[0]		


# if __name__ == '__main__':
# 	readYaml()