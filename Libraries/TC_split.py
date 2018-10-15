import os,sys
import json

#This will read and get the json content in a variable

def splitCollection(jsonFile):
	JsonFile = open('./outputFiles/'+jsonFile,'r+')
	jsonContent = json.load(JsonFile)

	global insertContent

	for data in jsonContent['requests']:
			if (data['method'] == 'GET'):
				url1 = data['url']
				if ('?' not in url1):
					pass

				#This will check only for the url which has '?' in it
				else:
					urloriginal = data['url']  
					url = urloriginal.split('?')[1] 

					#if url has more than one query then it will take them in a list else will make empty list              
					if '&' in url:              
						urlList = url.split('&')

					else:
						urlList = []
						urlList.append('')

					if len(urlList) > 1:
						urlList.append('')

					alter = []
					insertContent = []

					#This will take the copy of base content len(urlList) times in a list accordingly 
					for i in range (0,len(urlList)):
						JsonFile = open('./outputFiles/'+jsonFile,'r+')

						readContent = json.load(JsonFile)
						JsonFile.close()

						for content1 in readContent['requests']:
							if (content1['url'] == urloriginal):
								alter.append(content1.copy())

	                #This will add the new content to the list
					for i in range (0,len(alter)):
						alterContent = alter[i].copy()

						#This will add the name to the copy content 
						#alterContent['name'] = path[len(path)-1]+"_TC"+str(i+1)

						urlContent = alterContent['url'].split('?')[0]
						if urlList[i] == '':
							alterContent['url'] = urlContent
						else:
							alterContent['url'] = urlContent+'?'+urlList[i]
						searchId = alterContent['id']
						currentId = alterContent['id']+str(i)
						alterContent['id'] = currentId

						for folder in jsonContent["folders"]:
							if searchId in folder["order"]:
								folder["order"].append(currentId)					

					 	insertContent.append(alterContent)
					
					for datum in insertContent:
						jsonContent['requests'].append(datum)

		
	#This will add the new contents into the existing file
	with open('./outputFiles/'+jsonFile, 'w') as outfile:
		json.dump(jsonContent, outfile,indent=4,ensure_ascii=False)
