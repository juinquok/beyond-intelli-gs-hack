from PIL import Image
import pytesseract
import cv2
import os
import sys
import numpy as np
import re
import pandas as pd


def find_nric(ocr_string, actual_string):
    pattern = "^[STFGstfg]\d{7}[A-Za-z]$"

    matches = re.findall(pattern, ocr_string.strip())

    for possible in matches:
        if nric_validity(possible) and (possible.lower() == actual_string.lower()):
            return True
    return False


def nric_validity(nric):
    nricCheckDigits = 'JZIHGFEDCBA'
    finCheckDigits = 'XWUTRQPNMLK'
    weights = [2, 7, 6, 5, 4, 3, 2]
    if len(nric) != 9:
        return False

    firstChar = nric[0].upper()
    digits = nric[1:8]
    lastChar = nric[8].upper()

    if firstChar not in "STFG" or not digits.isdigit():
        return False

    total = 0
    if firstChar in "GT":
        total += 4

    for i in range(7):
        total += int(digits[i]) * weights[i]

    if firstChar in "ST":
        return nricCheckDigits[total % 11] == lastChar

    return finCheckDigits[total % 11] == lastChar


def find_nric_name(first_name, last_name, ocr_results):
    found_name_flag = False
    img_words = ocr_results

    names = [first_name, last_name]
    for search_string in names:
        query = search_string.split(" ")

        img_words['text'] = img_words['text'].str.lower()

        if len(query) >= 1:
            search_term = search_string.split(" ")[0]
            result = img_words[img_words['text'].str.contains(
                search_term)]
            if not result.empty:
                found_name_flag = True

    return found_name_flag


def find_address(first_name, last_name , address, postal_code, ocr_results):

    if not find_nric_name(first_name, last_name, ocr_results):
        return False

    find_address_flag = False
    img_words = ocr_results

    address_components = address.split(' ')
    search_address_components = []
    numeric_search = []
    for part in address_components:
        if not part.isdigit() and len(part.strip()) > 1:
            search_address_components.append(part.strip())
        if part.isdigit():
            numeric_search.append(part.strip())

    pos = 0
    for search_string in search_address_components:
        img_words['text'] = img_words['text'].str.lower()
        result = img_words[img_words['text'].str.contains(
            search_string)]
        if not result.empty:
            pos += 1

    if pos / len(search_address_components) < 0.5:
        return False

    else:
        pos = 0
    for search_string in numeric_search:
        img_words['text'] = img_words['text'].str.lower()
        all_possible = img_words[img_words['text'].str.contains(
            search_string)]
        if not result.empty:
            pos += 1

    if pos / len(numeric_search) < 0.5:
        return False
    else:
        return True


def process_kyc(input_image, nric, first_name, last_name):

    nric_valid = False
    image = cv2.imdecode(input_image, cv2.IMREAD_COLOR)

    lang = "eng"
    config = "--psm 12 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
    out_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    img_data = pytesseract.image_to_data(
        out_rgb,
        lang=lang,
        config=config,
        output_type=pytesseract.Output.DATAFRAME,
    )
    img_conf_text = img_data[["conf", "text"]]
    img_valid = img_conf_text[img_conf_text["text"].notnull()]
    img_words = img_valid[img_valid["text"].str.len() > 1]
    img_words

    valid = img_words[img_words['text'].apply(lambda x: find_nric(x, nric))]
    if not valid.empty:
        nric_valid = True

    name_valid = find_nric_name(first_name, last_name, img_words)

    return [nric_valid, name_valid]


def process_tier_two_kyc(input_image, first_name, last_name, address, postal_code):

    name_valid = False
    address_valid = False

    image = cv2.imdecode(input_image, cv2.IMREAD_COLOR)

    lang = "eng"
    config = "--psm 1 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
    out_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    img_data = pytesseract.image_to_data(
        out_rgb,
        lang=lang,
        config=config,
        output_type=pytesseract.Output.DATAFRAME,
    )

    img_conf_text = img_data[["conf", "text"]]
    img_valid = img_conf_text[img_conf_text["text"].notnull()]
    img_words = img_valid[img_valid["text"].str.len() > 1]

    return find_address(first_name, last_name , address, postal_code, img_words)
