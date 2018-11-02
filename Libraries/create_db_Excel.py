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
	print("ntpath",outFileName)
	outputFileName = outFileName.strip(".yaml")
	outFileName = './outputFiles/'+outputFileName + ".csv"

	if not fileExists:
		flag = 0
		print ("File not found! Check the file path")
	else:
		flag = 1
		# Opens the swagger.yaml file in read mode
		swaggerFile = open(inFileName,'r')

		# Loads the yaml file into a list
		yamlContent = yaml.load(swaggerFile)
		# print (yamlContent
		print ("File read\n")

		# Calls the function to add the tags to the text file
		addTags(yamlContent)

def addTags(yamlContent):
	i = "parameters"
	definitions = "definitions"
	dictListKeys = []
	dictListValue = []

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
										if dictId+'.'+keys not in dictListKeys:
											dictListKeys.append(dictId+'.'+keys)
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
												if dictId+'.'+keys not in dictListKeys:
													dictListKeys.append(dictId+'.'+keys)
		writeToExcel(dictListKeys)

def writeToExcel(dictListKeys):

	with open(outFileName, 'wb') as csvfile:
		spamwriter = csv.writer(csvfile)
		spamwriter.writerow(dictListKeys)

	dictListKeys2 = []
	for key in dictListKeys:
		if '.' in key:
			new_key = key.split('.')[1]
			dictListKeys2.append(new_key)
		else:
			dictListKeys2.append(key)
	# createDatabase(dictListKeys2)

def createDatabase(dictListKeys):
	
	collName = outputFileName

	# Connection to mongodb
	client = pymongo.MongoClient("mongodb://localhost:27017/mecTest")
	db = client["mecTest"]

	# This will read the excel file and insert it into the database
	if collName not in db.collection_names():
		print (collName, "is created")
		with open(outFileName, 'rb') as csvfile:
			spamreader = csv.reader(csvfile)
			for row in spamreader:
		  # number_of_rows = sheet.nrows
			  number_of_columns = len(row)
			  print (number_of_columns)
			  dictList = []
			  dictListValue = []
			  for column in range(number_of_columns):
				value = " "
				dictListValue.append(value)
				dictList = dict(zip(dictListKeys, dictListValue))
			  insertRecord = db[collName].insert_one(dictList)
			  print ("Record inserted... Check the DB")
	else:
		print (collName, "is exists")
		with open(outFileName, 'rb') as csvfile:
			spamreader = csv.reader(csvfile)
			for row in spamreader:
		  # number_of_rows = sheet.nrows
			  number_of_columns = len(row)
			  print (number_of_columns)
			  dictList = []
			  dictListValue = []
			  for column in range(number_of_columns):
				value = ""
				dictListValue.append(value)
				dictList = dict(zip(dictListKeys, dictListValue))
			  insertRecord = db[collName].insert_one(dictList)
			  print ("Record inserted... Check the DB")


# swagrToExcl = swaggerToExcel(sys.argv[1])
# swagrToExcl.readSwagger()
