import os,sys
import json

# class format_reqBody:
def reqBody(file):
	inputFile = open("./outputFiles/"+file,'r')
	jsonContent = json.load(inputFile)
	sp = "   "
	for content in jsonContent['requests']:
		rawModeData = content["rawModeData"]
		if rawModeData != None:
			counter = 0
			if rawModeData.startswith("{\n") and rawModeData.endswith("\n}"):
				print rawModeData
			else:
				with open("./outputFiles/"+file, 'w') as outfile:	
					keyValue= rawModeData.split(",")
					content["rawModeData"] = " "
					for startBrkt in keyValue:
						if "\"{{" in startBrkt:
							startBrkt = startBrkt + ","+ "\n" + sp * counter
								 
						elif "{\"" in startBrkt:
							# print startBrkt
							# print startBrkt +"\n"
							counter = counter + 1
							if counter != 1:
								index_sb = startBrkt.find("{\"")
								# print index_sb
								print counter
								startBrkt = startBrkt.replace(startBrkt[index_sb],"{\n"+sp * counter )
								startBrkt = startBrkt + "," + "\n" + sp * counter
							else:
								index_sb = startBrkt.find("{\"")
								startBrkt = startBrkt.replace(startBrkt[index_sb],"{\n"+sp * counter)
								startBrkt = startBrkt + ","+ "\n" + sp * counter
								
						elif "\"}" in startBrkt:
							# print startBrkt
							counter = counter - 1
							startBrkt = startBrkt.replace(startBrkt[-1],"\n" + sp * counter  + "}")
							startBrkt = startBrkt + "," + "\n" + sp * counter
							
						else:
							startBrkt = startBrkt + ","+ "\n" + sp * counter
							
						content["rawModeData"] = content["rawModeData"]+startBrkt
					json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)

