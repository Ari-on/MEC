import sys , yaml
import os

# class EditingFile:
def addRequest(fileName):
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

		for item in BodyInfoList:
			
			for datainfo in data["definitions"]:
				if datainfo == item:
					for k,v in data["definitions"][datainfo].items():
						if k == "example":
							for element in data["definitions"][datainfo][k]:
								if type(data["definitions"][datainfo][k][element]) == str or type(data["definitions"][datainfo][k][element]) == int:
									data["definitions"][datainfo][k][element] = '{{'+element+'}}'
								elif type(data["definitions"][datainfo][k][element]) == dict:
									if len(data["definitions"][datainfo][k][element]) == 0:
										data["definitions"][datainfo][k][element] = '{{'+element+'}}'
									else:
										for element2 in data["definitions"][datainfo][k][element]:
											if type(data["definitions"][datainfo][k][element][element2]) == str or type(data["definitions"][datainfo][k][element][element2]) == int:
												data["definitions"][datainfo][k][element][element2] = '{{'+element2+'}}'
											
											elif type(data["definitions"][datainfo][k][element][element2]) == dict:
												if len(data["definitions"][datainfo][k][element][element2]) == 0:
													data["definitions"][datainfo][k][element][element2] = '{{'+element2+'}}'
												else:
													for element3 in data["definitions"][datainfo][k][element][element2]:
														if type(data["definitions"][datainfo][k][element][element2][element3]) == str or type(data["definitions"][datainfo][k][element][element2][element3]) == int:
															data["definitions"][datainfo][k][element][element2][element3] = '{{'+element3+'}}'
														elif type(data["definitions"][datainfo][k][element][element2][element3]) == dict:
															for element4 in data["definitions"][datainfo][k][element][element2][element3]:
																data["definitions"][datainfo][k][element][element2][element3][element4] = '{{'+element4+'}}'
														else:
															pass	

											elif type(data["definitions"][datainfo][k][element][element2]) == list:
												#print(element2)
												pass
								elif type(data["definitions"][datainfo][k][element]) == list:
									for element5 in data["definitions"][datainfo][k][element]:
										if type(element5) == dict:
											for element6 in element5:
												if type(element5[element6]) == str or type(element5[element6]) == int:
													element5[element6] = '{{'+element6+'}}'
												elif type(element5[element6]) == list:
													if len(element5[element6]) == 0:
														element5[element6].append('{{'+element6+'}}')
													else:
														pass
												elif type(element5[element6]) == dict:
													if len(element5[element6]) == 0:
														element5[element6] = '{{'+element6+'}}'
													else:
														pass
										elif type(data["definitions"][datainfo][k][element][element5]) == list:
											pass

		# finalFile = in_file.split('/')[-1]
		with open(in_file, 'w') as outfile:
			yaml.dump(data, outfile, default_flow_style=False)

# edit = EditingFile()
# edit.FindTags(sys.argv[1])
