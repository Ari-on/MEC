import sys, yaml, json
import os
sys.path.insert(0, "./Libraries")
import yaml_request
import create_db_Excel
import postman_validation
import TC_split
import removing_value_from_requestBody
import yaml_edit
import spliting_testCase_basedOn_statusCode
import spliting_testCase_basedOn_EnumValues



def Yaml2Json(yaml_file):

	print("FileName : ",yaml_file)


	"""
			Function Name        : FindTags
			Function Description : write the req.body in yaml file
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				creates a (.yaml file)
				
	""" 
	yaml_request.FindTags(yaml_file)

	"""
			Function Name        : addRequest
			Function Description : add the request value part in yaml
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				updated yaml file
				
	"""

	if '\\' in yaml_file:
		in_file = "./outputFiles/"+yaml_file.split('\\')[-1]
	elif '/' in yaml_file:
		in_file = "./outputFiles/"+yaml_file.split('/')[-1]

	print(in_file)

	yaml_edit.addRequest(in_file)

	"""
			Function Name        : readSwagger
			Function Description : create DB and .csv file
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				creates a (.csv file and one DB)
				
	"""
	create_db_Excel.readSwagger(in_file)
	

	"""
			Function Name        : .js file
			Function Description : create postman collection .json v1 file
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	out_file1 = in_file.split('.')[-2]
	out_file2 = out_file1.split('/')[2] 
	out_file = out_file2+'.json'
	# out_file = './outputFiles/swagger.json'
	with open(in_file) as file1:
		data = yaml.load(file1)
	with open("./outputFiles/"+out_file, 'w') as file2:
		json.dump(data, file2, indent=2)
		
	swagger2postman(out_file)

	"""
			Function Name        : splitCollection
			Function Description : split the TCs of postman collection file
			Inputs   : 
				FileName         : File name(postman collection .json v1 file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	TC_split.splitCollection(out_file)
	spliting_testCase_basedOn_statusCode.split_testCases_using_status(in_file,out_file)
	spliting_testCase_basedOn_EnumValues.split_testCases_using_Enum(in_file,out_file)

	"""
			Function Name        : RequestBody_value
			Function Description : Removes the rawModeData values of postman collection file
			Inputs   : 
				FileName         : File name(postman collection .json v1 file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	# removing_value_from_requestBody.RequestBody_value('./outputFiles/postman_collection.json')



	"""
			Function Name        : readExcel
			Function Description : write the validation part in postman
			Inputs   : 
				FileName         : File name(postman collection .json v1 file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""


	if '\\' in yaml_file:
		validation_file = yaml_file.split('\\')[-1].strip(".yaml")
	else:
		validation_file = yaml_file.split('/')[-1].strip(".yaml")

	print(validation_file)
	postman_validation.readExcel(validation_file)
	
def swagger2postman(out_file):
	os.system ("node ./Libraries/swagger2postman.js  "+out_file)
	
if __name__ == '__main__':
	Yaml2Json(sys.argv[1])
