import os
import re
from typing import Optional, Match

from PyPDF2 import PdfReader
from databases.mongodb import add_process


class PDFDataExtractor:
    STATUS_NEW = "nova"
    DEFENDANT = "Instituto Nacional do Seguro Social - INSS"

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
                add_process(processes[0])
                print(processes)
        return processes

    def extract_decimal(self, pattern: str, process_text: str) -> Optional[float]:
        match: Optional[Match[str]] = re.search(pattern, process_text)
        if match:
            value = match.group(1).replace('.', '').replace(',', '.')
            return float(value)  # Converte para float
        return None

    def _extract_details(self, process_text):
        data = {}

        process_number_match = re.search(r"Processo\s([\d\.\-\/]+)", process_text)
        data["process_number"] = process_number_match.group(1) if process_number_match else None

        author_match = re.search(r"- Auxílio-Acidente.*?-\s([\w\s]+?)(?=\s-\sVistos)", process_text)
        data["authors"] = author_match.group(1).strip() if author_match else None

        lawyer_match = re.search(r"- ADV:\s([^\(]+)\s\(OAB", process_text)
        data["lawyers"] = lawyer_match.group(1).strip() if lawyer_match else None

        data["gross_net_principal_amount"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*principal\s+bruto/\s+líquido", process_text)
        data["late_interest_amount"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*juros\s+moratórios", process_text)
        data["attorney_fees"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*honorários\s+advocatícios", process_text)

        data["status"] = self.STATUS_NEW
        data["defendant"] = self.DEFENDANT
        data["content"] = process_text.strip()

        return data


if __name__ == "__main__":
    directory_path = "../tmp"
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        print(file_path)
        PDFDataExtractor(file_path)
