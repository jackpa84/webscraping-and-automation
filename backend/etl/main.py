import os
from urllib.parse import urlparse, urljoin

import schedule
import time

from scraping.pdf_data_extractor import PDFDataExtractor
from scraping.pdf_downloader import PDFDownloader
from scraping.scraper import Scraper


def clean_url(url):
    try:
        parsed = urlparse(url)
        if not parsed.scheme:
            url = urljoin("https://dje.tjsp.jus.br", url)
        return url.strip()
    except Exception as e:
        print(f"Invalid URL: {url}, error: {e}")
        return None


def get_links():
    scraper = Scraper()
    try:
        scraper.open_page()
        scraper.setup_filters()
        return scraper.scrape_links()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        scraper.close()


def main():
    links = get_links()
    pdf_downloader = PDFDownloader()
    try:
        if links:
            print(f"Total de links encontrados: {len(links)}")
            for idx, link in enumerate(links):
                path = f"tmp/downloaded_document_{idx}.pdf"
                save_path = os.path.join(os.getcwd(), path)
                pdf_downloader.download_pdf(link, save_path)
                PDFDataExtractor(path)

        else:
            print("Nenhum link encontrado para download.")
    finally:
        pdf_downloader.close()

    print("Processo concluído.")


if __name__ == "__main__":
    main()

    job = schedule.every().day.at("23:10").do(main)
    print("Próxima execução as 23:10")
    while True:
        schedule.run_pending()
        time.sleep(1)
