import sys , yaml
import os

# class creating_Request_Body:
def DescriptionEditing(fileName):
	with open(fileName) as inputFile:
		Alldata = yaml.load(inputFile)
		for path in Alldata["paths"]:
			APIText = Alldata["paths"][path]
			for Api in APIText:
				if Api == "put" :
					InfoText = Alldata["paths"][path][Api]
					for info in InfoText:
						if info == "parameters":
							parameterText = Alldata["paths"][path][Api][info]
							# print parameterText1
							for parameters in parameterText:
								for k,v in parameters.items():
									if v == "body":
										#print parameters["description"]
										schema = parameters["schema"]
										for k,v in schema.items():
											refTagvalue = v.split("\\")
											refTagvalue = refTagvalue[-1]
											# print refTagvalue
											for definitions in Alldata["definitions"]:
												# print definitions
												if definitions == refTagvalue:
													propertiesText = Alldata["definitions"][refTagvalue]["example"]
													with open(fileName, 'w') as outfile:
														Alldata["paths"][path][Api][info][-1]["description"] = str(propertiesText)
														# print Alldata["paths"][path][Api][info][-1]["description"]
														# print "\n"
														yaml.dump(Alldata, outfile, default_flow_style=False)
														
				
				if Api == "post":
					#data
					InfoText = Alldata["paths"][path][Api]
					for info in InfoText:
						if info == "parameters":
							parameterText = Alldata["paths"][path][Api][info]
							# print parameterText1
							for parameters in parameterText:
								for k,v in parameters.items():
									if v == "body":
										#print parameters["description"]
										schema = parameters["schema"]
										for k,v in schema.items():
											refTagvalue = v.split("\\")
											refTagvalue = refTagvalue[-1]
											# print refTagvalue
											for definitions in Alldata["definitions"]:
												# print definitions
												if definitions == refTagvalue:
													propertiesText = Alldata["definitions"][refTagvalue]["example"]
													with open(fileName, 'w') as outfile:
														Alldata["paths"][path][Api][info][-1]["description"] = str(propertiesText)
														# print Alldata["paths"][path][Api][info][-1]["description"]
														yaml.dump(Alldata, outfile, default_flow_style=False)
														
				if Api == "patch":
					InfoText = Alldata["paths"][path][Api]
					for info in InfoText:
						if info == "parameters":
							parameterText = Alldata["paths"][path][Api][info]
							# print parameterText1
							for parameters in parameterText:
								for k,v in parameters.items():
									if v == "body":
										#print parameters["description"]
										schema = parameters["schema"]
										for k,v in schema.items():
											refTagvalue = v.split("\\")
											refTagvalue = refTagvalue[-1]
											# print refTagvalue
											for definitions in Alldata["definitions"]:
												# print definitions
												if definitions == refTagvalue:
													propertiesText = Alldata["definitions"][refTagvalue]["example"]
													with open(fileName, 'w') as outfile:
														Alldata["paths"][path][Api][info][-1]["description"] = str(propertiesText)
														# print Alldata["paths"][path1][Api1][info1][-1]["description"]
														yaml.dump(Alldata, outfile, default_flow_style=False)
														
																	
def replaceTag(fileName):
	List = []
	if os.path.isfile(fileName):
		with open(fileName, 'r') as infile:
			for line in infile:
				List.append(line)
				
	
		with open(fileName, 'w') as outfile:
			for x in List:
				if "''" in x:
					x = x.replace("''","\"")
				if (x != "\n"):
					outfile.write(x)
			outfile.close()
