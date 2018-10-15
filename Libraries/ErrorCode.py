import sys, yaml, json
import os

def changeContent(datum):

	if '400' in datum['name']:
		url = datum['url']
		if "}" not in url[-1]:
			url = url + "s"
			datum['url'] = url
		else:
			url = url.replace("=", "s=")
			datum['url'] = url

		return datum

	elif '403' in datum['name']:
		pass
		
	elif '404' in datum['name']:
		url = datum['url']
		if '?' in url:
			url = url.split('?')[0]
		# print(url)
		if '/:' in url:
			url = url.split('/:')[0]
		else:
			pass
		url = url.split('/')[-1]
		reverseURL = url[::-1]
		finalURL = url+reverseURL
		datum['url'] = datum['url'].replace(url,finalURL)
		return datum

	elif '406' in datum['name']:
		headers = datum['headers']
		finalHeader = ''

		if '\n' in headers and 'Accept' in headers:
			headers = headers.split('\n') 
			for element in headers:
				if element == '':
					pass
				else:
					if 'application/json' in element and 'Accept' in element:
						if ',' in element:
							element = element.split(',')[0]
						else:
							pass
						element = element.replace('application/json','text/css')
					elif 'Accept' in element:
						if ',' in element:
							element = element.split(',')[0]
						else:
							pass
						element = element.replace('text/css','application/json')
				finalHeader = finalHeader+element+'\n'

		elif 'application/json' in headers and 'Accept' in headers:
			if ',' in headers:
				headers = headers.split(',')[0]
			else:
				pass
			finalHeader = headers.replace('application/json','text/css')

		elif 'Accept' in headers:
			if ',' in headers:
				headers = headers.split(',')[0]
			else:
				pass
			finalHeader = 'Accept: application/json'

		datum['headers'] = finalHeader
		return datum

	elif '412' in datum['name']:
		url = datum['url']
		url = url.split("/:")
		datum['url'] = url[0]
		return datum

	elif '415' in datum['name']:
		ContentType = datum['headers']
		ContentType = ContentType.split("Content-Type:")
		ContentType1 = ContentType[-1].replace("json", "javascript")
		ContentType2 = ContentType[-2] + "Content-Type:" + ContentType1
		datum['headers'] = ContentType2
		return datum

	elif '422' in datum['name']:
		rawModeData = datum['rawModeData']
		rawModeData = rawModeData.replace("\":", "s\":")
		datum['rawModeData'] = rawModeData
		return datum

	elif '429' in datum['name']:
		RateLimit = datum["headers"]
		RateLimit = RateLimit + 'X-RateLimit-Reset: 60sec\n'
		datum["headers"] = RateLimit
		return datum

	# elif '404' in datum['name']:
	# 	url = datum['url']