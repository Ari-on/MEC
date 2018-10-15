import sys , yaml
import os
import Request_Body_creation

# class EditingFile:
def FindTags(fileName):
	global in_file,BodyInfoList,data,subtags
	in_file = fileName
	BodyInfoList = []
	subtags = ''
	# This will open yaml file in read mode
	with open(fileName) as file:
		data = yaml.load(file)
		
	# This will give the tag name which has the request body
		parameterInfo = data["parameters"]
		for parameter in parameterInfo:
			if "Body" in parameter:
				Ptxt = data["parameters"][parameter]["schema"]
				for k,v in Ptxt.items():
					BodyInfo = v.split("/")
					BodyInfo = BodyInfo[-1]
					BodyInfoList.append(BodyInfo)
		print("BodyInfoList",BodyInfoList)
					
		#This will check array type tags which has ref 
		for k,v in data["definitions"].items():
			if data["definitions"][k].has_key("type"):
				type = data["definitions"][k]["type"]
				if type == "array":
					txt = data["definitions"][k]["items"]
					for k,v in txt.items():
						if k == "$ref":
							value = v.split("/")
							refvalue = value[-1]
							# if ref tag is there under definitions it will go inside and take the properties 
							for info in data["definitions"]:
								if info == refvalue:
									innertxt = data["definitions"][info]
									for innervalue in innertxt:
										if "properties" not in innervalue:
											pass
										else:
											innervaluetxt = data["definitions"][info][innervalue]
											# if ref is there under properties it will take the ref tag
											for k,v in innervaluetxt.items():
												if innervaluetxt[k].has_key("$ref"): 
													refvalue = innervaluetxt[k]["$ref"]
													refvalue = refvalue.split("/")
													refvalue = refvalue[-1]
													text = data["definitions"][refvalue]
													for k,v in text.items():
														if v == "array":
															subtags = subtags + refvalue  +":" + " []" + "\n"
														if v == "string":
															subtags = subtags + refvalue  +":" + " {}" + "\n"
												
						else:
							pass
											
	WriteTags(fileName)
	
def WriteTags(fileName):	
	global firstObject
	# This will write the tag  
	for item in BodyInfoList:
		for datainfo in data["definitions"]:
			if datainfo == item:
				for k,v in data["definitions"][datainfo].items():
					if k == "example":
						firstObject = data["definitions"][datainfo]["example"]
						for k,v in firstObject.items():
							if v == "":
								key = k
								if '\\' in in_file:
									finalFile = in_file.split('\\')[-1]
								elif '/' in in_file:
									finalFile = in_file.split('/')[-1]

								with open('./outputFiles/'+finalFile, 'w') as outfile:
									data["definitions"][item]["example"][key] = [subtags]
									yaml.dump(data, outfile, default_flow_style=False)
				
					else:
						if '\\' in in_file:
							finalFile = in_file.split('\\')[-1]
						elif '/' in in_file:
							finalFile = in_file.split('/')[-1]

						with open('./outputFiles/'+finalFile, 'w') as outfile:
							yaml.dump(data, outfile, default_flow_style=False)
				
		readyamlFile(finalFile)

		
def readyamlFile(fileName):
	List = []
	if os.path.isfile('./outputFiles/'+fileName):
		with open('./outputFiles/'+fileName, 'r') as infile:
			for line in infile:
				List.append(line)
				
	
		with open('./outputFiles/'+fileName,'w') as outfile:
			for x in List:
				if "- '" in x:
					x = x.replace("- '","- ")
				if "  '" in x:
					x = x.replace("  '","")
				
				if (x != "\n"):
					outfile.write(x)
			outfile.close()
	else:
		Request_Body_creation.DescriptionEditing('./outputFiles/'+fileName)
		Request_Body_creation.replaceTag('./outputFiles/'+fileName)	

	
# yfile = EditingFile()
# yfile.FindTags(sys.argv[1])