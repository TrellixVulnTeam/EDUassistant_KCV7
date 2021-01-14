# This program will go to eDnevnik site with users credentials and when it logs in it will gather all professor names and
# subjects that are related to them. After that it will store that to JSON file which will be red by the EDUassistant app
# after which all professors will be stored into the "Staff tab"

# This is v0.0.-prealpha (hopefully the last version)

from bs4 import BeautifulSoup
import requests
import re
import json
import sys

lista_profesora = []
sorted_professors = []
dva_profesora = False
same = False

mail = sys.argv[1]
password = sys.argv[2]

URL = 'https://ocjene.skole.hr/'
LOGIN_ROUTE = 'login'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    'Origin': URL,
    'Referer': URL + LOGIN_ROUTE
}

s = requests.session()

html_bytes = s.get(URL).text
soup = BeautifulSoup(html_bytes, 'lxml')

csrf_token = soup.find('input', {'name':'csrf_token'})['value']

payload = {
    'username'  : mail,
    'password'  : password,
    'csrf_token': csrf_token 
}

login_request = s.post(URL+LOGIN_ROUTE, headers=HEADERS, data=payload)

result = BeautifulSoup(login_request.content, "lxml")

for ultag in result.find_all('ul', {'class': 'list'}):
    for litag in ultag.find_all('li'):
        if litag != None:
            dva_profesora = False
            profesor = re.sub('\s+', ' ', litag.text)
            parts = profesor.split(" ")
            parts = parts[1:-1]
            
            ime = parts[-2]
            del parts[-2]
            prezime = parts[-1]
            del parts[-1]

            if len(parts) > 2:
                if parts[-1][-1] == ',':
                    dva_profesora = True
                    ime2 = parts[-2]
                    del parts[-2]
                    prezime2 = parts[-1][:-1]
                    del parts[-1]

            predmet = " ".join(parts)

            lista_profesora.append({
                "Ime": ime,
                "Prezime": prezime,
                "Predmet": predmet
            })

            if dva_profesora:
              lista_profesora.append({
                "Ime": ime2,
                "Prezime": prezime2,
                "Predmet": predmet
            })  

for professor in lista_profesora:
    same = False
    for sorted_prof in sorted_professors:
        if  sorted_prof['Name'] == professor['Ime']+ " " +professor['Prezime']:
            same = True
    if not same:
        sorted_professors.append({
            "Name": professor['Ime'] + " " + professor['Prezime'],
            "Subject": professor['Predmet'],
            "Email": "placeholder",
            "Teams": "placeholder"
        })

json_sorted = json.dumps(sorted_professors)

print(json_sorted)