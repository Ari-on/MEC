import os,sys
import json
# class remove_value:
def RequestBody_value(fileName):
	JsonFile = open(fileName,'r+')
	jsonContent = json.load(JsonFile)
	for content in jsonContent['requests']:
		rawModeData = content["rawModeData"]
		if rawModeData == None:	
			pass
		if rawModeData != None:
			# print rawModeData
			if "\n" in rawModeData:
				pass
			else:
				with open(fileName, 'w') as outfile:
					dictKeyValue = rawModeData.split(",")
					content["rawModeData"] = " "  
					for dict in dictKeyValue:
						if "]" in dict:
							dict = dict.replace(dict,"],")
						if ": {" in dict:
							dict1 = dict[-1]
							if "}" in dict1:
								dict = dict.replace(dict1[-1],"},")

						if ": [" in dict:
							dict2 = dict.split(": [")
							dict = dict.replace(dict2[-1],"\"\"")
						
						if ": \"" in dict:
							dict4 = dict[-1]
							dict5 = dict[-2]
							if "}" in dict5:
								dict5 = dict.split(":")
								dict = dict.replace(dict5[-1],"\"\"}}")
							elif "}" in dict4:
								dict4 = dict.split(":")
								dict = dict.replace(dict4[-1],"\"\"}")
							
							elif "\"" not in dict5:
								dict4 = dict.split(": \"")
								dict = dict.replace(dict4[-1],"\",")
						content["rawModeData"] = content["rawModeData"]+dict
					json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)
			
		
		
# RB = remove_value()
# RB.RequestBody_value()
		
		
		
		
		