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
				if main_Key == k:
					key = k
				else:
					key = main_Key+'.'+k
				x = addKeys(element['response'][k],key,keyList)

	writeToExcel(keyList)

	if i in yamlContent:
		sorted_sub = sorted(yamlContent[i].items())
		sorted_sub_keys = sorted(yamlContent[i].keys())

		for j in enumerate(sorted_sub_keys):
			j = j[1]
			if "Body." in j:
				j = j[5:]
				if definitions in yamlContent:
					sorted_sub = sorted(yamlContent[definitions].items())
					sorted_sub_keys = sorted(yamlContent[definitions].keys())
					if j in sorted_sub_keys:
						bwInfoExample = yamlContent['definitions'][j]['example']
						# print(bwInfoExample)

						# this will append the keys and values of the dict to 2 different lists
						for dictId, dictInfo in bwInfoExample.items():
							if dictInfo == {} and dictId not in dictListKeys:
								dictListKeys.append(dictId)
							else:
								if isinstance(dictInfo, list):
									for keys in dictInfo[0]:
										if dictId+'_'+keys not in dictListKeys:
											dictListKeys.append(dictId+'_'+keys)
								else:
									variable_Type = type(dictInfo).__name__
									if variable_Type == 'str':
										if dictId not in dictListKeys:
											dictListKeys.append(dictId)
									else:
										for keys in dictInfo:
											variable_Type1 = type(dictInfo[keys]).__name__
											if variable_Type1 == 'dict':
												for item in dictInfo[keys]:
													if dictId+'.'+keys+'.'+item not in dictListKeys:
														dictListKeys.append(dictId+'.'+keys+'.'+item)
											else:
												if dictId+'_'+keys not in dictListKeys:
													dictListKeys.append(dictId+'_'+keys)
		# writeToExcel(dictListKeys)

def writeToExcel(dictListKeys):

	with open(outFileName, 'wb') as csvfile:
		spamwriter = csv.writer(csvfile)
		spamwriter.writerow(dictListKeys)

	# dictListKeys2 = []
	# for key in dictListKeys:
	# 	if '.' in key:
	# 		new_key = key.split('.')[1]
	# 		dictListKeys2.append(new_key)
	# 	else:
	# 		dictListKeys2.append(key)
	# createDatabase(dictListKeys2)

def createDatabase(dictListKeys):
	
	collName = outputFileName

	# Connection to mongodb
	client = pymongo.MongoClient("mongodb://localhost:27017/mecTest")
	db = client["mecTest"]

	# This will read the excel file and insert it into the database
	if collName not in db.collection_names():
		# print (collName, "is created")
		with open(outFileName, 'rb') as csvfile:
			spamreader = csv.reader(csvfile)
			for row in spamreader:
		  # number_of_rows = sheet.nrows
			  number_of_columns = len(row)
			  # print (number_of_columns)
			  dictList = []
			  dictListValue = []
			  for column in range(number_of_columns):
				value = " "
				dictListValue.append(value)
				dictList = dict(zip(dictListKeys, dictListValue))
			  insertRecord = db[collName].insert_one(dictList)
			  # print ("Record inserted... Check the DB")
	else:
		# print (collName, "is exists")
		with open(outFileName, 'rb') as csvfile:
			spamreader = csv.reader(csvfile)
			for row in spamreader:
		  # number_of_rows = sheet.nrows
			  number_of_columns = len(row)
			  # print (number_of_columns)
			  dictList = []
			  dictListValue = []
			  for column in range(number_of_columns):
				value = ""
				dictListValue.append(value)
				dictList = dict(zip(dictListKeys, dictListValue))
			  insertRecord = db[collName].insert_one(dictList)
			  # print ("Record inserted... Check the DB")

def addKeys(keys,main_Key,keyList):
	if type(keys) == list:
		for element in keys:
			if type(element) == dict:
				addKeys(element,main_Key,keyList)
			if type(element) == str:
				keyList.append(main_Key)
	if type(keys) == dict:
		for key in keys:
			if type(keys[key]) == str:
				keyList.append(main_Key+'.'+key)
			elif type(keys[key]) == list:
				addKeys(keys[key],main_Key+'.'+key,keyList)
			elif type(keys[key]) == dict:
				addKeys(keys[key],main_Key+'.'+key,keyList)
# swagrToExcl = swaggerToExcel(sys.argv[1])
# swagrToExcl.readSwagger()

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

