import os,sys
import json
import format_reqBody
# class remove_value:
def RequestBody_value(file):
	JsonFile = open(file,'r+')
	jsonContent = json.load(JsonFile)
	for content in jsonContent['requests']:
		rawModeData = content["rawModeData"]
		if rawModeData == None:	
			pass
		if rawModeData != None:
			if "\n" in rawModeData:
				if "{}" in rawModeData:
					pass
				elif "[]" in rawModeData:
					pass
				else:
					with open(file, 'w') as outputfile:
						KeyValue = rawModeData.split(",")
						content["rawModeData"] = " "
						for info in KeyValue:
							if ": \"" in info:
								if "}" in info[-1]:
									info0 = info.split(": \"")
									if "}" in info0[-1]:
										info2 = info0[-1].split("}")
										info = info.replace(info2[0],"\" \n   ")
									info = info.replace(info0[-1],"\"")
									info = info + ","
								else:
									info1 = info.split(": \"")
									info = info.replace(info1[-1],"\"")
									info = info + ","
							elif ": [" in info:
								#print info
								if "]" in info[-1]:	
									pass
									info = info + ","
								else:
									info3 = info.split(": [")
									info = info.replace(info3[-1],"\"\"")
							elif "]" in info:
								# print info
								info4 = info.split("]")
								info = info.replace(info4[0],"")
								info = info + ","
							else:
								info = info + ","
						
							content["rawModeData"] = content["rawModeData"]+info
						json.dump(jsonContent, outputfile,indent=4,ensure_ascii=False)
						outputfile.close()
						# RF = format_reqBody.format_reqBody()
						format_reqBody.removing_comma(file)
						
					
			else:
				with open(file, 'w') as outfile:
					dictKeyValue = rawModeData.split(",")
					content["rawModeData"] = " "  
					for dict in dictKeyValue:
						if "]" in dict:
							dict = dict.replace(dict,"]")
							dict = dict + "," 
						if ": {" in dict:
							dict1 = dict[-1]
							if "}" in dict1:
								dict = dict.replace(dict1[-1],"}")
								dict = dict + "," 

						if ": [" in dict:
							dict2 = dict.split(": [")
							dict = dict.replace(dict2[-1],"")
						if ": 1" in dict:
							dict = dict + ","
						if ": 0" in dict:
							dict = dict + ","
						if ": \"" in dict:
							dict4 = dict[-1]
							dict5 = dict[-2]
							if "}" in dict5:
								dict5 = dict.split(":")
								dict = dict.replace(dict5[-1],"\"\"}}")
								dict = dict + "," 
							elif "}" in dict4:
								dict4 = dict.split(":")
								dict = dict.replace(dict4[-1],"\"\"}")
								dict = dict + "," 
							
							elif "\"" not in dict5:
								dict4 = dict.split(": \"")
								dict = dict.replace(dict4[-1],"\"")
								dict = dict + "," 
							
							else:
								dict = dict + ","
						content["rawModeData"] = content["rawModeData"]+dict
					json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)
					outfile.close()
				# RF = format_reqBody.()
				format_reqBody.reqBody(file)
				format_reqBody.removing_comma(file)
					
	
# RB = remove_value()
# RB.RequestBody_value()
