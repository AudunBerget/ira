"""
Fetches IRAComplete.xls from a specific Google Drive folder, validates it,
and writes it to the repo path if it passes. Designed to be run inside the
GitHub Action, but works fine locally too if you set the same env vars.

Exits with a non-zero code (and a clear message) on any validation failure,
so the workflow step fails loudly instead of silently committing bad data.
"""

import hashlib
import io
import os
import sys

import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# ---- Configuration -----------------------------------------------------
# Adjust these to match your actual file's expected structure.

EXPECTED_FILENAME = os.environ.get("EXPECTED_FILENAME", "IRAcomplete.xls")
FOLDER_ID = os.environ["GDRIVE_FOLDER_ID"]
TARGET_PATH = os.environ.get("TARGET_PATH", "public/IRAcomplete.xls")
SA_KEY_PATH = "sa_key.json"

MIN_SIZE_BYTES = 5_000        # reject if suspiciously small (near-empty file)
MAX_SIZE_BYTES = 20_000_000   # reject if suspiciously large (20MB)

# Legacy .xls files (OLE Compound File format) start with this byte signature.
XLS_MAGIC_BYTES = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"

# Set these to whatever your actual spreadsheet should contain.
# Leave lists empty ([]) to skip that particular check.
EXPECTED_SHEET_NAMES = []       # e.g. ["Sheet1"]
EXPECTED_COLUMNS = []           # e.g. ["Account", "Balance", "Date"]
MIN_ROW_COUNT = 1               # reject if the sheet has no data rows

# --------------------------------------------------------------------------


def fail(message):
    print(f"VALIDATION FAILED: {message}", file=sys.stderr)
    sys.exit(1)


def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SA_KEY_PATH, scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=creds)


def find_latest_matching_file(service):
    """Search the target folder for files matching the expected filename,
    and return the most recently modified match."""
    query = (
        f"'{FOLDER_ID}' in parents "
        f"and name = '{EXPECTED_FILENAME}' "
        f"and trashed = false"
    )
    results = service.files().list(
        q=query,
        fields="files(id, name, modifiedTime, size, owners)",
        orderBy="modifiedTime desc",
    ).execute()

    files = results.get("files", [])
    if not files:
        fail(
            f"No file named '{EXPECTED_FILENAME}' found in folder {FOLDER_ID}. "
            "Check the file hasn't been renamed or moved."
        )

    latest = files[0]
    print(f"Found file: {latest['name']} (id={latest['id']}, "
          f"modified={latest['modifiedTime']}, "
          f"owner={latest.get('owners', [{}])[0].get('emailAddress', 'unknown')})")
    return latest


def download_file(service, file_id):
    request = service.files().get_media(fileId=file_id)
    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    buffer.seek(0)
    return buffer.read()


def validate(content):
    # 1. Not empty / not suspiciously tiny or huge
    size = len(content)
    if size < MIN_SIZE_BYTES:
        fail(f"File is only {size} bytes — looks empty or truncated.")
    if size > MAX_SIZE_BYTES:
        fail(f"File is {size} bytes — larger than expected, refusing to sync.")

    # 2. Correct file signature for a legacy .xls file
    if content[:8] != XLS_MAGIC_BYTES:
        fail(
            "File does not have a valid .xls (OLE) signature. "
            "It may have been saved as .xlsx, .csv, or corrupted."
        )

    # 3. File actually opens as a spreadsheet
    try:
        excel_file = pd.ExcelFile(io.BytesIO(content), engine="xlrd")
    except Exception as e:
        fail(f"File could not be opened as an Excel file: {e}")

#     # 4. Expected sheet names present
#     if EXPECTED_SHEET_NAMES:
#         missing = set(EXPECTED_SHEET_NAMES) - set(excel_file.sheet_names)
#         if missing:
#             fail(f"Missing expected sheet(s): {missing}. "
#                  f"Found sheets: {excel_file.sheet_names}")
#
#     # 5. Check the first sheet has data and expected columns
#     df = excel_file.parse(excel_file.sheet_names[0])
#
#     if len(df) < MIN_ROW_COUNT:
#         fail(f"Sheet '{excel_file.sheet_names[0]}' has {len(df)} data rows, "
#              f"expected at least {MIN_ROW_COUNT}.")
#
#     if EXPECTED_COLUMNS:
#         missing_cols = set(EXPECTED_COLUMNS) - set(df.columns)
#         if missing_cols:
#             fail(f"Missing expected column(s): {missing_cols}. "
#                  f"Found columns: {list(df.columns)}")
#
    print(f"Validation passed: {size} bytes, "
          f"{len(excel_file.sheet_names)} sheet(s), {len(df)} data rows.")


def file_hash(path_or_bytes):
    if isinstance(path_or_bytes, bytes):
        data = path_or_bytes
    else:
        if not os.path.exists(path_or_bytes):
            return None
        with open(path_or_bytes, "rb") as f:
            data = f.read()
    return hashlib.sha256(data).hexdigest()


def main():
    service = get_drive_service()
    latest = find_latest_matching_file(service)
    content = download_file(service, latest["id"])

    validate(content)

    new_hash = file_hash(content)
    old_hash = file_hash(TARGET_PATH)
    changed = new_hash != old_hash

    if changed:
        os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)
        with open(TARGET_PATH, "wb") as f:
            f.write(content)
        print(f"File written to {TARGET_PATH} (content changed).")
    else:
        print("Downloaded file is identical to what's already in the repo. Nothing to commit.")

    # Communicate back to the workflow step
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"changed={'true' if changed else 'false'}\n")


if __name__ == "__main__":
    main()
