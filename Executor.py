import sys, yaml, json
import os
sys.path.insert(0, "./Libraries")
import yaml_request
import create_db_Excel
import postman_validation
import TC_split
import removing_value_from_requestBody



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
			Function Name        : readSwagger
			Function Description : create DB and .csv file
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				creates a (.csv file and one DB)
				
	"""


	in_file = "final_"+yaml_file
	create_db_Excel.readSwagger(in_file)
	

	"""
			Function Name        : .js file
			Function Description : create postman collection .json v1 file
			Inputs   : 
				FileName         : File name(.yaml file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	out_file = 'swagger.json'
	with open(in_file) as file1:
		data = yaml.load(file1)
	with open(out_file, 'w') as file2:
		json.dump(data, file2, indent=2)
		
	swagger2postman()

	"""
			Function Name        : splitCollection
			Function Description : split the TCs of postman collection file
			Inputs   : 
				FileName         : File name(postman collection .json v1 file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	TC_split.splitCollection()

	"""
			Function Name        : RequestBody_value
			Function Description : Removes the rawModeData values of postman collection file
			Inputs   : 
				FileName         : File name(postman collection .json v1 file)
			Outputs  : 
				creates a (postman collection .json v1 file)
				
	"""
	removing_value_from_requestBody.RequestBody_value('postman_collection.json')



	"""
            Function Name        : readExcel
            Function Description : write the validation part in postman
            Inputs   : 
                FileName         : File name(postman collection .json v1 file)
            Outputs  : 
                creates a (postman collection .json v1 file)
				
    """
	validation_file = in_file.strip(".yaml")
	postman_validation.readExcel(validation_file+".csv")
	
def swagger2postman():
	os.system ("node ./Libraries/swagger2postman.js")
	
if __name__ == '__main__':
	Yaml2Json(sys.argv[1])
