import os
import re
from PyPDF2 import PdfReader

class PDFDataExtractor:
    STATUS_NEW = "NEW"

    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.content = self._extract_text()
        self.processes = self.extract_processes()

    def _extract_text(self):
        try:
            reader = PdfReader(self.pdf_path)
            text = ""
            for page in reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text
            return text
        except Exception as e:
            print(f"An error occurred while extracting text from {self.pdf_path}: {e}")
            return ""

    def extract_processes(self):
        normalized_content = re.sub(r"\s+", " ", self.content)

        process_pattern = re.compile(
            r"(Processo\s[\d\.\-\/]+.*?)(?=Processo|\Z)",
            re.DOTALL
        )
        matches = process_pattern.findall(normalized_content)

        processes = []
        for match in matches:
            process_data = self._extract_details(match)
            if all(value is not None for value in process_data.values()):
                processes.append(process_data)
                print(processes)
        return processes

    def _extract_details(self, process_text):
        data = {}

        process_number_match = re.search(r"Processo\s([\d\.\-\/]+)", process_text)
        data["process_number"] = process_number_match.group(1) if process_number_match else None

        author_match = re.search(r"- Auxílio-Acidente.*?-\s([\w\s]+?)(?=\s-\sVistos)", process_text)
        data["authors"] = author_match.group(1).strip() if author_match else None

        lawyer_match = re.search(r"- ADV:\s([^\(]+)\s\(OAB", process_text)
        data["lawyers"] = lawyer_match.group(1).strip() if lawyer_match else None

        principal_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - principal bruto/ líquido", process_text)
        data["gross_net_principal_amount"] = principal_match.group(1) if principal_match else None

        juros_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - juros moratórios", process_text)
        data["late_interest_amount"] = juros_match.group(1) if juros_match else None

        honorarios_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - honorários a dvocatícios", process_text)
        data["attorney_fees"] = honorarios_match.group(1) if honorarios_match else None

        data["status"] = self.STATUS_NEW

        data["content"] = process_text.strip()

        return data

if __name__ == "__main__":
    directory_path = "../tmp"
    file_paths = []
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        print(file_path)
        pdf_path = file_path
        PDFDataExtractor(pdf_path)



