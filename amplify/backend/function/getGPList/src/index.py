from bs4 import BeautifulSoup
import requests
import json
from string import whitespace


def getGPsList(postCode):
    page = requests.get("https://www.nhs.uk/service-search/find-a-gp/results/"+postCode)
    content = BeautifulSoup(page.content, 'html.parser')
    all = content.find_all("div", class_="nhsuk-grid-column-two-thirds")
    result = []
    for one in all:
        name = one.find("h2", class_="results__name").find("a").get_text()
        details = one.find("p", class_="nhsuk-list").get_text()
        link = one.find("a")["href"]
        result.append({"Name": name, "Link": link, "Details": ' '.join([ w for w in details.replace("\n","").split(" ") if w not in whitespace])})
    return result

def handler(event, context):
  print(event)
  result = getGPsList(event['arguments']['postCode'])
  return { "StatusCode": 200, "Result": result }
