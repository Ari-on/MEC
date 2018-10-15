import os,sys
import json

# class format_reqBody:
def reqBody(file):
	inputFile = open(file,'r')
	jsonContent = json.load(inputFile)
	sp = "   "
	for content in jsonContent['requests']:
		rawModeData = content["rawModeData"]
		if rawModeData != None:
			counter = 0
			if rawModeData.startswith(" {") and rawModeData.endswith("},"):
				# print rawModeData
				with open(file, 'w') as outfile:	
					keyValue= rawModeData.split(",")
					content["rawModeData"] = " "
					for startBrkt in keyValue:
						if "{" in startBrkt:
							# print startBrkt +"\n"
							counter = counter + 1
							if counter != 1:
								index_sb = startBrkt.find("{")
								# print index_sb
								# print counter
								startBrkt = startBrkt.replace(startBrkt[index_sb],"{   \r\n"+sp * counter )
								startBrkt = startBrkt + "," + "\n" + sp * counter
							else:
								index_sb = startBrkt.find("{")
								startBrkt = startBrkt.replace(startBrkt[index_sb],"{   \r\n"+sp * counter)
								startBrkt = startBrkt + ","+ "\n" + sp * counter
								
						elif "}" in startBrkt:
							counter = counter - 1
							startBrkt = startBrkt.replace(startBrkt[-1],"\r\n" + sp * counter  + "}")
							startBrkt = startBrkt + "," + "\n" + sp * counter
							
						else:
							startBrkt = startBrkt + ","+ "\n" + sp * counter
							
						content["rawModeData"] = content["rawModeData"]+startBrkt
					json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)
	# RF.removing_comma()
		
def removing_comma(file):
	List = []
	with open(file, 'r') as infile:
		for line in infile:
			List.append(line)
			

	with open(file, 'w') as outPutfile:
		for x in List:
			if "\"  {" in x:
				x = x.replace("\"  {","\"{")
			if ",\\n,\\n" in x:
				x = x.replace(",\\n,\\n","")
			if ",\\n   ,\\n   " in x:
				x = x.replace(",\\n   ,\\n   ","")
			if "},\"" in x:
				x = x.replace("},\"","}\"")
			if (x != "\n"):
				outPutfile.write(x)
		outPutfile.close()

	
# RF = format_reqBody()
# RF.reqBody()
