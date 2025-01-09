from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
import requests
import os
import time


class PDFDownloader:
    def __init__(self):
        self.driver = None

    def _setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        self.driver = webdriver.Chrome(options=chrome_options)

    def download_pdf(self, url, save_path):
        self._setup_driver()
        try:
            self.driver.get(url)

            time.sleep(5)

            pdf_url = None
            for request in self.driver.requests:
                if request.response:
                    content_type = request.response.headers.get('Content-Type', '')
                    if 'application/pdf' in content_type:
                        pdf_url = request.url
                        print(f"PDF found: {pdf_url}")
                        break

            if not pdf_url:
                print("No PDF found in the network requests.")
                return

            self._download_file(pdf_url, save_path)

        except TimeoutException:
            print("Timeout occurred while loading the page or locating frames.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            self.driver.quit()

    def _download_file(self, pdf_url, save_path):
        response = requests.get(pdf_url, stream=True)
        if response.status_code == 200:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            print(f"PDF successfully downloaded to {save_path}")
        else:
            print(f"Failed to download PDF. HTTP Status: {response.status_code}")


if __name__ == "__main__":
    target_url = "https://dje.tjsp.jus.br/cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3772"
    save_path = os.path.join(os.getcwd(), "downloaded_document.pdf")

    downloader = PDFDownloader()
    downloader.download_pdf(target_url, save_path)
