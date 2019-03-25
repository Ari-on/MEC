# This file will read the swagger.yaml file and fetch the tags of the body
# and write it a text file for further use.
import os, sys, ntpath, pymongo, time
import yaml
import xlwt, xlrd,csv
from xlwt import Workbook
from xlrd import open_workbook
from pymongo import MongoClient

#class swaggerToExcel:

def readSwagger(yaml_file):
	global outFileName, inFileName, outputFileName, dictListKeys
	inFileName = yaml_file
	fileExists = os.path.exists(inFileName)
	outFileName = ntpath.basename(inFileName)
	#print("ntpath",outFileName)
	outputFileName = outFileName.strip(".yaml")
	outFileName = './outputFiles/'+outputFileName + ".csv"

	if not fileExists:
		flag = 0
		#print ("File not found! Check the file path")
	else:
		flag = 1
		# Opens the swagger.yaml file in read mode
		swaggerFile = open(inFileName,'r')

		# Loads the yaml file into a list
		yamlContent = yaml.load(swaggerFile)
		# print (yamlContent
		#print ("File read\n")

		# Calls the function to add the tags to the text file
		addTags(yamlContent)
		addDBFile(yamlContent,outputFileName)

def addTags(yamlContent):
	i = "parameters"
	definitions = "definitions"
	dictListKeys = []
	dictListValue = []

	yamlFile = './outputFiles/'+outputFileName+'.yaml'

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
				if response == 201:
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

	for element in response_list:
		main_Key = element['main_Key']
		# print('came',main_Key)
		definitionKeys = yamlContent['definitions'].keys()
		for key in definitionKeys:
			capKey1 = main_Key.upper()
			capKey2 = key.upper()
			if capKey1 == capKey2:
				requiredKey = key
				if requiredKey in definitionKeys:
					if 'properties' in yamlContent['definitions'][requiredKey]:
						definitions = yamlContent['definitions'][requiredKey]['properties'].keys()
						for key in definitions:
							if main_Key in element['response']:
								if key not in element['response'][main_Key].keys():
									element['response'][main_Key][key] = ''
							else:
								pass
	queryList = {}
	for api in yamlContent['paths']:
		for method in yamlContent['paths'][api]:
			for element in yamlContent['paths'][api][method]['parameters']:
				if element['in'] == 'path' or element['in'] == 'query':
					if api not in queryList:
						queryList[api] = []

					if element['name'] not in queryList[api]:
						queryList[api].append(element['name'])

	keyList = []
	for element in response_list:
		main_Key = element['main_Key']
		for k in element['response']:
			if type(element['response'][k]) == str:
				keyList.append(main_Key+'.'+k)
			elif type(element['response'][k]) == list:
				if len(element['response'][k]) == 0:
					keyList.append(main_Key+'.'+k)
				else:
					x = addKeys(element['response'][k],main_Key+'_'+k,keyList)
			elif type(element['response'][k]) == dict:
				if len(element['response'][k]) == 0:
					keyList.append(main_Key+'.'+k)
				if main_Key == k:
					key = k
				else:
					key = main_Key+'.'+k
				x = addKeys(element['response'][k],key,keyList)

		for api in queryList:
			if element['api'] in api:
				for param in queryList[api]:
					param = param.replace('.','-')
					param = param.replace('_','-')
					if main_Key+'.'+param not in keyList:
						keyList.append(main_Key+'.'+param)

	writeToExcel(keyList)

def writeToExcel(dictListKeys):

	with open(outFileName, 'wb') as csvfile:
		spamwriter = csv.writer(csvfile)
		spamwriter.writerow(dictListKeys)


def addKeys(keys,main_Key,keyList):
	if type(keys) == list:
		for element in keys:
			if type(element) == dict:
				addKeys(element,main_Key,keyList)
			if type(element) == str:
				keyList.append(main_Key)
	if type(keys) == dict:
		for key in keys:
			if type(keys[key]) == int:
				keyList.append(main_Key+'.'+key)
			if type(keys[key]) == str:
				keyList.append(main_Key+'.'+key)
			elif type(keys[key]) == list:
				addKeys(keys[key],main_Key+'.'+key,keyList)
			elif type(keys[key]) == dict:
				addKeys(keys[key],main_Key+'.'+key,keyList)

def addDBFile(yamlContent,swaggerFile):
	fileName = 'dbname.txt'
	basePath = yamlContent['basePath']
	fileLine = basePath+':'+swaggerFile+'\n'

	if os.path.exists(fileName):
		readerList = []
		reader = open(fileName,'r')
		for i in reader:
			readerList.append(i)
		if fileLine in readerList:
			pass
		else:
			appender = open(fileName,'a')
			appender.write(fileLine)
	else:
		file = open(fileName,'w')		
		file.write(fileLine)

