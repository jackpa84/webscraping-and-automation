import os
import time
import chromedriver_autoinstaller
import requests
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from seleniumwire import webdriver

class PDFDownloader:
    def __init__(self):
        self.driver = self._setup_driver()

    def _setup_driver(self):
        chromedriver_autoinstaller.install()
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        try:
            driver = webdriver.Chrome(options=options)
            return driver
        except Exception as e:
            print(f"Error initializing WebDriver: {e}")
            raise

    def download_pdf(self, url, save_path):
        self._setup_driver()
        try:
            del self.driver.requests
            self.driver.get(url)
            print(f"Navigating to {url}")
            time.sleep(5)
            for request in self.driver.requests:
                if request.response:
                    content_type = request.response.headers.get('Content-Type', '')
                    if 'application/pdf' in content_type:
                        pdf_url = request.url
                        print(f"PDF found: {pdf_url}")
                        break
            if not pdf_url:
                print("No PDF found in network requests.")
                return
            self._download_file(pdf_url, save_path)
        except TimeoutException:
            print("Timeout occurred while loading the page or locating frames.")
        except Exception as e:
            print(f"An error occurred: {e}")

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

    def remove_file(self, save_path):
        try:
            if os.path.exists(save_path):
                os.remove(save_path)
                print(f"File successfully removed: {save_path}")
            else:
                print(f"File does not exist: {save_path}")
        except Exception as e:
            print(f"Error removing file {save_path}: {e}")

    def close(self):
        self.driver.quit()


if __name__ == "__main__":
    pdf_downloader = PDFDownloader()
    pdf_downloader.download_pdf(
        "https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3870",
        "tmp/downloaded_document.pdf")
