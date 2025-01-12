import os

import schedule
import time

from scraping.pdf_data_extractor import PDFDataExtractor
from scraping.pdf_downloader import PDFDownloader
from scraping.scraper import Scraper

# def get_links():
#     scraper = Scraper()
#     try:
#         scraper.open_page()
#         scraper.setup_filters()
#         return scraper.scrape_links()
#     except Exception as e:
#         print(f"An error occurred: {e}")
#     finally:
#         scraper.close()

def main():
    # links = get_links()
    pdf_downloader = PDFDownloader()
    try:
        if len(links) > 0:
            print(f"Total de links para download: {len(links)}")
            for idx, link in enumerate(links):
                path = f"tmp/downloaded_document_{idx}.pdf"
                save_path = os.path.join(os.getcwd(), path)
                pdf_downloader.download_pdf(link, save_path)
                PDFDataExtractor(path)
                # pdf_downloader.remove_file(save_path)

        else:
            print("Nenhum link encontrado para download.")
    finally:
        pdf_downloader.close()

    print("Processo concluido.")



links = {'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3805'}
if __name__ == "__main__":
    main()


# UTC

# schedule.every().day.at("23:10").do(main)
#
# while True:
#     schedule.run_pending()
#     time.sleep(1)