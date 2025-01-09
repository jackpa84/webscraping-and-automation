import requests
from bs4 import BeautifulSoup

url = 'https://dje.tjsp.jus.br/cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3772'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Página acessada com sucesso.")
else:
    print(f"Falha ao acessar a página. Status code: {response.status_code}")


soup = BeautifulSoup(response.content, 'html.parser')
pdf_link = None

# Procura por todos os links na página
for link in soup.find_all('a'):
    href = link.get('href')
    if href and 'downloadCaderno.do' in href:
        pdf_link = 'https://dje.tjsp.jus.br' + href
        break

if pdf_link:
    print(f"Link do PDF encontrado: {pdf_link}")
else:
    print("Link do PDF não encontrado.")

if pdf_link:
    pdf_response = requests.get(pdf_link, headers=headers)
    if pdf_response.status_code == 200:
        with open('diario_justica.pdf', 'wb') as f:
            f.write(pdf_response.content)
        print("PDF baixado com sucesso.")
    else:
        print(f"Falha ao baixar o PDF. Status code: {pdf_response.status_code}")
